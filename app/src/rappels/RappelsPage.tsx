import { useState, useMemo, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'wasp/client/operations'
import i18n from '../client/i18n'
import { getRappels, getEnfants, ajouterRappel, modifierRappel, supprimerRappel, marquerRappelFait, abonnerNotificationsPush, desabonnerNotificationsPush } from 'wasp/client/operations'

// ─── Types ────────────────────────────────────────────────────────────────────

type TypeRappel = 'medicament' | 'vaccin' | 'checkup'
type FrequenceRappel = 'unique' | 'quotidien' | 'hebdomadaire' | 'mensuel' | 'annuel'

type Rappel = {
  id: string
  type: string
  titre: string
  dateProchaine: Date
  frequence: string
  heure: string | null
  actif: boolean
  notes: string | null
  enfantId: string | null
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const ICONES_TYPE: Record<TypeRappel, string> = {
  medicament: '💊',
  vaccin: '💉',
  checkup: '🩺',
}

function statutRappel(date: Date): 'retard' | 'aujourdhui' | 'proche' | 'planifie' {
  const d = new Date(date)
  const maintenant = new Date()
  const debutAujourdhui = new Date(maintenant)
  debutAujourdhui.setHours(0, 0, 0, 0)
  const finAujourdhui = new Date(debutAujourdhui)
  finAujourdhui.setHours(23, 59, 59, 999)
  const dans7j = new Date(debutAujourdhui)
  dans7j.setDate(dans7j.getDate() + 7)

  if (d < debutAujourdhui) return 'retard'
  if (d <= finAujourdhui) return 'aujourdhui'
  if (d <= dans7j) return 'proche'
  return 'planifie'
}

const BADGES: Record<string, string> = {
  retard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  aujourdhui: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  proche: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  planifie: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

function dateVersInput(d: Date | null | undefined): string {
  if (!d) return ''
  return new Date(d).toISOString().split('T')[0]
}

// ─── Composant principal ──────────────────────────────────────────────────────

// Convertit une clé base64url en Uint8Array (requis par pushManager.subscribe)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function RappelsPage() {
  const { t } = useTranslation('rappels')
  const { t: tc } = useTranslation('common')
  const { data: enfants } = useQuery(getEnfants)
  const [enfantId, setEnfantId] = useState<string | null>(null)
  const [afficherInactifs, setAfficherInactifs] = useState(false)

  // ── État des notifications push ───────────────────────────────────────────
  // Indique si le navigateur supporte les notifications push
  const [pushSupporte, setPushSupporte] = useState(false)
  // Indique si l'utilisateur est actuellement abonné
  const [pushActif, setPushActif] = useState(false)
  // Indique si les notifications sont bloquées par le navigateur
  const [pushBloque, setPushBloque] = useState(false)
  // Référence à la subscription push courante (pour désabonnement)
  const [subscriptionPush, setSubscriptionPush] = useState<PushSubscription | null>(null)

  // Vérification du support et de l'état actuel à l'initialisation
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupporte(true)
      navigator.serviceWorker.ready.then((registration) => {
        registration.pushManager.getSubscription().then((sub) => {
          if (sub) {
            setPushActif(true)
            setSubscriptionPush(sub)
          }
        })
      })
      // Vérifier si les notifications sont déjà bloquées par le navigateur
      if (Notification.permission === 'denied') {
        setPushBloque(true)
      }
    }
  }, [])

  /**
   * Active les notifications push :
   * 1. Demande la permission navigateur
   * 2. Récupère ou crée la subscription Web Push
   * 3. Enregistre la subscription côté serveur
   */
  async function activerPush() {
    if (!pushSupporte) return
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'denied') {
        setPushBloque(true)
        return
      }
      if (permission !== 'granted') return

      const registration = await navigator.serviceWorker.ready
      const vapidPublicKey = import.meta.env.REACT_APP_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) {
        console.warn('[PUSH] REACT_APP_VAPID_PUBLIC_KEY non définie')
        return
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      })

      const subJson = sub.toJSON()
      await abonnerNotificationsPush({
        endpoint: subJson.endpoint!,
        p256dh: subJson.keys!.p256dh,
        auth: subJson.keys!.auth,
      })

      setPushActif(true)
      setSubscriptionPush(sub)
    } catch (err) {
      console.error('[PUSH] Erreur activation :', err)
    }
  }

  /**
   * Désactive les notifications push :
   * 1. Désabonne le navigateur
   * 2. Supprime la subscription côté serveur
   */
  async function desactiverPush() {
    if (!subscriptionPush) return
    try {
      const endpoint = subscriptionPush.endpoint
      await subscriptionPush.unsubscribe()
      await desabonnerNotificationsPush({ endpoint })
      setPushActif(false)
      setSubscriptionPush(null)
    } catch (err) {
      console.error('[PUSH] Erreur désactivation :', err)
    }
  }

  const { data: rappels, refetch } = useQuery(getRappels, { enfantId })

  const aDesEnfants = enfants && enfants.length > 0

  const rappelsFiltres = useMemo(() => {
    if (!rappels) return []
    return afficherInactifs ? rappels : rappels.filter((r) => r.actif)
  }, [rappels, afficherInactifs])

  const parType = useMemo(() => ({
    medicament: rappelsFiltres.filter((r) => r.type === 'medicament'),
    vaccin: rappelsFiltres.filter((r) => r.type === 'vaccin'),
    checkup: rappelsFiltres.filter((r) => r.type === 'checkup'),
  }), [rappelsFiltres])

  const nbEnRetard = rappels?.filter((r) => r.actif && statutRappel(r.dateProchaine as Date) === 'retard').length ?? 0

  return (
    <div className='mx-auto max-w-3xl px-4 py-10 space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{t('title')}</h1>
          {nbEnRetard > 0 && (
            <span className='rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300'>
              {nbEnRetard} {t('late')}
            </span>
          )}
        </div>
        <button
          onClick={() => setAfficherInactifs(!afficherInactifs)}
          className='text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        >
          {afficherInactifs ? t('hide_inactive') : t('show_inactive')}
        </button>
      </div>

      {/* Sélecteur patient */}
      {aDesEnfants && (
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setEnfantId(null)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              enfantId === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
            }`}
          >
            {tc('me')}
          </button>
          {enfants.map((e) => (
            <button
              key={e.id}
              onClick={() => setEnfantId(e.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                enfantId === e.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {e.prenom}
            </button>
          ))}
        </div>
      )}

      {/* Bloc notifications push — masqué si le navigateur ne supporte pas */}
      {pushSupporte && (
        <div className='rounded-xl border border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-semibold text-gray-900 dark:text-white'>
                🔔 {pushActif ? t('push_disable') : t('push_enable')}
              </p>
              {pushBloque && (
                <p className='mt-1 text-xs text-amber-600 dark:text-amber-400'>
                  {t('push_blocked')}
                </p>
              )}
            </div>
            {!pushBloque && (
              <button
                onClick={pushActif ? desactiverPush : activerPush}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                  pushActif
                    ? 'border border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {pushActif ? t('push_disable') : t('push_enable')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sections par type */}
      {(['medicament', 'vaccin', 'checkup'] as TypeRappel[]).map((type) => (
        <SectionRappels
          key={type}
          type={type}
          items={parType[type]}
          enfantId={enfantId}
          onRefetch={refetch}
        />
      ))}
    </div>
  )
}

// ─── Section par type ─────────────────────────────────────────────────────────

function SectionRappels({
  type, items, enfantId, onRefetch,
}: {
  type: TypeRappel
  items: Rappel[]
  enfantId: string | null
  onRefetch: () => void
}) {
  const { t } = useTranslation('rappels')
  const [ajout, setAjout] = useState(false)
  const [edition, setEdition] = useState<Rappel | null>(null)
  const [ouvert, setOuvert] = useState(true)

  const typeLabel = t(`type_${type}`)

  return (
    <div className='rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
      <button
        onClick={() => setOuvert(!ouvert)}
        className='flex w-full items-center justify-between px-6 py-4 text-left'
      >
        <div className='flex items-center gap-3'>
          <span className='text-lg'>{ICONES_TYPE[type]}</span>
          <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>{typeLabel}s</h2>
          {items.length > 0 && (
            <span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300'>
              {items.length}
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${ouvert ? 'rotate-180' : ''}`}
          fill='none' viewBox='0 0 24 24' stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {ouvert && (
        <div className='border-t border-gray-200 px-6 py-4 space-y-3 dark:border-gray-700'>
          {items.map((r) => (
            <CarteRappel
              key={r.id}
              rappel={r}
              onEdit={() => setEdition(r)}
              onDelete={async () => { await supprimerRappel({ id: r.id }); onRefetch() }}
              onFait={async () => { await marquerRappelFait({ id: r.id }); onRefetch() }}
            />
          ))}

          {items.length === 0 && !ajout && (
            <p className='text-sm text-gray-400 dark:text-gray-500'>
              {t('none', { type: typeLabel.toLowerCase() })}
            </p>
          )}

          {(ajout || edition) && (
            <FormulaireRappel
              initial={edition ?? undefined}
              typeForce={type}
              onSave={async (data) => {
                if (edition) {
                  await modifierRappel({ id: edition.id, ...data })
                } else {
                  await ajouterRappel({ ...data, enfantId })
                }
                onRefetch()
                setAjout(false)
                setEdition(null)
              }}
              onCancel={() => { setAjout(false); setEdition(null) }}
            />
          )}

          {!ajout && !edition && (
            <button
              onClick={() => setAjout(true)}
              className='flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
              </svg>
              {t('add_reminder')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Carte rappel ─────────────────────────────────────────────────────────────

function CarteRappel({
  rappel, onEdit, onDelete, onFait,
}: {
  rappel: Rappel
  onEdit: () => void
  onDelete: () => void
  onFait: () => void
}) {
  const { t } = useTranslation('rappels')
  const { t: tc } = useTranslation('common')
  const statut = rappel.actif ? statutRappel(rappel.dateProchaine as Date) : 'planifie'
  const dateStr = new Date(rappel.dateProchaine).toLocaleDateString(i18n.language)
  const frequenceLabel = t(`freq_${rappel.frequence}`) ?? rappel.frequence

  return (
    <div className={`flex items-start justify-between rounded-lg px-4 py-3 ${rappel.actif ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-gray-50/50 opacity-60 dark:bg-gray-700/20'}`}>
      <div className='space-y-1 flex-1 min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-sm font-medium text-gray-900 dark:text-white'>{rappel.titre}</span>
          {rappel.actif && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${BADGES[statut]}`}>
              {t(`status_${statut}`)}
            </span>
          )}
          {!rappel.actif && (
            <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-400 dark:bg-gray-700'>
              {t('inactive')}
            </span>
          )}
        </div>
        <div className='flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400'>
          <span>{dateStr}{rappel.heure ? ` à ${rappel.heure}` : ''}</span>
          {rappel.frequence !== 'unique' && <span>{frequenceLabel}</span>}
        </div>
        {rappel.notes && <p className='text-xs text-gray-500 dark:text-gray-400'>{rappel.notes}</p>}
      </div>

      <div className='ml-4 flex shrink-0 items-center gap-1'>
        {rappel.actif && (
          <button
            onClick={onFait}
            title={t('mark_done')}
            className='rounded p-1 text-gray-400 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400'
          >
            <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </button>
        )}
        <button
          onClick={onEdit}
          title={tc('edit')}
          className='rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600'
        >
          <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
          </svg>
        </button>
        <button
          onClick={onDelete}
          title={tc('delete')}
          className='rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400'
        >
          <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Formulaire ───────────────────────────────────────────────────────────────

function FormulaireRappel({
  initial, typeForce, onSave, onCancel,
}: {
  initial?: Rappel
  typeForce: TypeRappel
  onSave: (data: { type: TypeRappel; titre: string; dateProchaine: string; frequence: FrequenceRappel; heure?: string | null; notes?: string | null }) => Promise<void>
  onCancel: () => void
}) {
  const { t } = useTranslation('rappels')
  const { t: tc } = useTranslation('common')
  const [titre, setTitre] = useState(initial?.titre ?? '')
  const [dateProchaine, setDateProchaine] = useState(dateVersInput(initial?.dateProchaine as Date | null) || new Date().toISOString().split('T')[0])
  const [frequence, setFrequence] = useState<FrequenceRappel>((initial?.frequence as FrequenceRappel) ?? 'unique')
  const [heure, setHeure] = useState(initial?.heure ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [enCours, setEnCours] = useState(false)

  const LABELS_FREQUENCE: Record<FrequenceRappel, string> = {
    unique: t('freq_unique'),
    quotidien: t('freq_quotidien'),
    hebdomadaire: t('freq_hebdomadaire'),
    mensuel: t('freq_mensuel'),
    annuel: t('freq_annuel'),
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnCours(true)
    try {
      await onSave({ type: typeForce, titre, dateProchaine, frequence, heure: typeForce === 'medicament' ? (heure || null) : null, notes: notes || null })
    } finally {
      setEnCours(false)
    }
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'

  return (
    <form onSubmit={handleSubmit} className='space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div className='sm:col-span-2'>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('description_required')}</label>
          <input
            type='text'
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            placeholder={t(`placeholder_${typeForce}`)}
            className={inputClass}
          />
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('date_required')}</label>
          <input
            type='date'
            value={dateProchaine}
            onChange={(e) => setDateProchaine(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('frequency_required')}</label>
          <select value={frequence} onChange={(e) => setFrequence(e.target.value as FrequenceRappel)} className={inputClass}>
            {(Object.entries(LABELS_FREQUENCE) as [FrequenceRappel, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
        {typeForce === 'medicament' && (
          <div>
            <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('time_label')}</label>
            <input
              type='time'
              value={heure}
              onChange={(e) => setHeure(e.target.value)}
              className={inputClass}
            />
          </div>
        )}
        <div className='sm:col-span-2'>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{tc('notes')}</label>
          <input
            type='text'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('additional_info')}
            className={inputClass}
          />
        </div>
      </div>
      <div className='flex gap-2'>
        <button
          type='submit'
          disabled={enCours}
          className='rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50'
        >
          {enCours ? tc('saving') : tc('save')}
        </button>
        <button
          type='button'
          onClick={onCancel}
          className='rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
        >
          {tc('cancel')}
        </button>
      </div>
    </form>
  )
}
