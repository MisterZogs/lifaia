import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'wasp/client/auth'
import { useNavigate } from 'react-router'
import { completerOnboarding, abonnerNotificationsPush, desabonnerNotificationsPush } from 'wasp/client/operations'
import { Link as WaspRouterLink, routes } from 'wasp/client/router'
import { Button } from '../client/components/ui/button'
import { Alert, AlertDescription } from '../client/components/ui/alert'

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

const PAYS_SUPPORTES = [
  { code: 'FR', label: 'France', langue: 'fr-FR' },
  { code: 'BE', label: 'Belgique', langue: 'fr-FR' },
  { code: 'CH', label: 'Suisse', langue: 'fr-FR' },
  { code: 'CA', label: 'Canada (Québec)', langue: 'fr-FR' },
  { code: 'US', label: 'États-Unis', langue: 'en-US' },
  { code: 'GB', label: 'Royaume-Uni', langue: 'en-GB' },
] as const

type Sexe = 'homme' | 'femme' | 'autre'

/**
 * Onboarding en 3 étapes :
 * 1. Profil (pays, sexe, date de naissance, taille, poids)
 * 2. Acceptations légales (avertissement médical + CGU)
 * 3. Notifications (email + push)
 */
export default function OnboardingPage() {
  const { data: user, isLoading } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation('auth')
  const { t: tc } = useTranslation('common')

  // Étape courante : 1, 2 ou 3
  const [etape, setEtape] = useState<1 | 2 | 3>(1)

  // Étape 1 — profil
  const [pays, setPays] = useState('FR')
  const [sexe, setSexe] = useState<Sexe | ''>('')
  const [dateNaissance, setDateNaissance] = useState('')
  const [tailleCm, setTailleCm] = useState('')
  const [poidsKg, setPoidsKg] = useState('')

  // Étape 2 — légal
  const [cgAcceptee, setCgAcceptee] = useState(false)
  const [disclaimerAccepte, setDisclaimerAccepte] = useState(false)

  // Étape 3 — notifications
  // Email activé par défaut
  const [emailNotifActif, setEmailNotifActif] = useState(true)
  // Support push détecté dans le navigateur
  const [pushSupporte, setPushSupporte] = useState(false)
  const [pushActif, setPushActif] = useState(false)
  const [pushBloque, setPushBloque] = useState(false)
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null)

  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, setEnCours] = useState(false)

  // Détection du support push à l'initialisation
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setPushSupporte(true)
      if (Notification.permission === 'denied') {
        setPushBloque(true)
      }
    }
  }, [])

  useEffect(() => {
    if (!isLoading && user?.onboardingTermine) {
      navigate('/chat')
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-gray-500'>{tc('loading')}</p>
      </div>
    )
  }

  const paysSelectionne = PAYS_SUPPORTES.find((p) => p.code === pays)
  const langue = paysSelectionne?.langue ?? 'fr-FR'

  function handleEtape1(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)
    if (!sexe) {
      setErreur(t('onboarding_sex_required'))
      return
    }
    setEtape(2)
  }

  function handleEtape2(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)

    if (!cgAcceptee) {
      setErreur(t('onboarding_cgu_required'))
      return
    }
    if (!disclaimerAccepte) {
      setErreur(t('onboarding_disclaimer_required'))
      return
    }

    // Passer à l'étape 3 — notifications
    setEtape(3)
  }

  /**
   * Active les notifications push pendant l'onboarding.
   * Même logique que dans RappelsPage.
   */
  async function activerPushOnboarding() {
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
      if (!vapidPublicKey) return

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
      setPushSubscription(sub)
    } catch (err) {
      console.error('[ONBOARDING PUSH] Erreur activation :', err)
    }
  }

  async function desactiverPushOnboarding() {
    if (!pushSubscription) return
    try {
      const endpoint = pushSubscription.endpoint
      await pushSubscription.unsubscribe()
      await desabonnerNotificationsPush({ endpoint })
      setPushActif(false)
      setPushSubscription(null)
    } catch (err) {
      console.error('[ONBOARDING PUSH] Erreur désactivation :', err)
    }
  }

  /**
   * Étape finale : persiste le profil et redirige vers le chat.
   * Les préférences de notification sont gérées côté client (non envoyées au serveur).
   */
  async function handleEtape3(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await completerOnboarding({
        pays,
        langue,
        cgAcceptee: true,
        disclaimerMedicalAccepte: true,
        sexe: sexe as Sexe,
        dateNaissance: dateNaissance || undefined,
        tailleCm: tailleCm ? parseInt(tailleCm, 10) : undefined,
        poidsKg: poidsKg ? parseFloat(poidsKg) : undefined,
      })
      navigate('/chat')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : tc('error_generic')
      setErreur(message)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900'>
      <div className='w-full max-w-lg rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800'>
        {/* En-tête avec indicateur d'étapes (3 segments) */}
        <div className='mb-6'>
          <div className='mb-4 flex items-center justify-between text-xs text-gray-400'>
            <span>{t('onboarding_step', { step: etape, total: 3 })}</span>
            <div className='flex gap-1'>
              <div className={`h-1.5 w-10 rounded-full ${etape >= 1 ? 'bg-cyan-500' : 'bg-gray-200'}`} />
              <div className={`h-1.5 w-10 rounded-full ${etape >= 2 ? 'bg-cyan-500' : 'bg-gray-200'}`} />
              <div className={`h-1.5 w-10 rounded-full ${etape >= 3 ? 'bg-cyan-500' : 'bg-gray-200'}`} />
            </div>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {etape === 1 ? t('onboarding_profile_title') : etape === 2 ? t('onboarding_legal_title') : t('onboarding_notif_title')}
          </h1>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {etape === 1 ? t('onboarding_profile_subtitle') : etape === 2 ? t('onboarding_legal_subtitle') : t('onboarding_notif_subtitle')}
          </p>
        </div>

        {/* ÉTAPE 1 — Profil */}
        {etape === 1 && (
          <form onSubmit={handleEtape1} className='space-y-5'>
            {/* Pays */}
            <div>
              <label htmlFor='pays' className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                {t('onboarding_country')}
              </label>
              <p className='mb-2 text-xs text-gray-500 dark:text-gray-400'>
                {t('onboarding_country_hint')}
              </p>
              <select
                id='pays'
                value={pays}
                onChange={(e) => setPays(e.target.value)}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              >
                {PAYS_SUPPORTES.map((p) => (
                  <option key={p.code} value={p.code}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Sexe biologique */}
            <div>
              <p className='mb-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
                {tc('sex')} <span className='text-red-500'>*</span>
              </p>
              <p className='mb-2 text-xs text-gray-500 dark:text-gray-400'>
                {t('onboarding_sex_hint')}
              </p>
              <div className='flex gap-3'>
                {(['homme', 'femme', 'autre'] as Sexe[]).map((s) => (
                  <button
                    key={s}
                    type='button'
                    onClick={() => setSexe(s)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                      sexe === s
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {tc(`sex_${s === 'homme' ? 'male' : s === 'femme' ? 'female' : 'other'}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Date de naissance */}
            <div>
              <label htmlFor='dateNaissance' className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                {tc('dob')}
              </label>
              <input
                id='dateNaissance'
                type='date'
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>

            {/* Taille + Poids côte à côte */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label htmlFor='taille' className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {tc('height_cm')}
                </label>
                <input
                  id='taille'
                  type='number'
                  value={tailleCm}
                  onChange={(e) => setTailleCm(e.target.value)}
                  placeholder='170'
                  min={50}
                  max={250}
                  className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label htmlFor='poids' className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {tc('weight_kg')}
                </label>
                <input
                  id='poids'
                  type='number'
                  value={poidsKg}
                  onChange={(e) => setPoidsKg(e.target.value)}
                  placeholder='70'
                  min={2}
                  max={500}
                  step='0.1'
                  className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>
            </div>

            {erreur && (
              <Alert variant='destructive'>
                <AlertDescription>{erreur}</AlertDescription>
              </Alert>
            )}

            <Button type='submit' className='w-full py-3'>
              {t('onboarding_continue')}
            </Button>
          </form>
        )}

        {/* ÉTAPE 2 — Légal */}
        {etape === 2 && (
          <form onSubmit={handleEtape2} className='space-y-5'>
            {/* Avertissement médical */}
            <div className='rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-900/30'>
              <p className='mb-2 text-sm font-semibold text-amber-800 dark:text-amber-200'>
                {t('onboarding_medical_warning_title')}
              </p>
              <p className='mb-3 text-xs text-amber-700 dark:text-amber-300'>
                {t('onboarding_medical_warning_text')}
              </p>
              <label className='flex cursor-pointer items-start gap-2'>
                <input
                  type='checkbox'
                  checked={disclaimerAccepte}
                  onChange={(e) => setDisclaimerAccepte(e.target.checked)}
                  className='mt-0.5 h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500'
                />
                <span className='text-xs font-medium text-amber-800 dark:text-amber-200'>
                  {t('onboarding_medical_warning_check')}
                </span>
              </label>
            </div>

            {/* CGU */}
            <div>
              <label className='flex cursor-pointer items-start gap-2'>
                <input
                  type='checkbox'
                  checked={cgAcceptee}
                  onChange={(e) => setCgAcceptee(e.target.checked)}
                  className='mt-0.5 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500'
                />
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  {t('onboarding_cgu_check')}{' '}
                  <WaspRouterLink
                    to={routes.CguRoute.to}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-medium text-cyan-600 underline hover:text-cyan-800 dark:text-cyan-400'
                  >
                    {t('onboarding_cgu_link')}
                  </WaspRouterLink>{' '}
                  {t('onboarding_cgu_and')}{' '}
                  <WaspRouterLink
                    to={routes.MentionsLegalesRoute.to}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-medium text-cyan-600 underline hover:text-cyan-800 dark:text-cyan-400'
                  >
                    {t('onboarding_privacy_link')}
                  </WaspRouterLink>
                  .
                </span>
              </label>
            </div>

            {erreur && (
              <Alert variant='destructive'>
                <AlertDescription>{erreur}</AlertDescription>
              </Alert>
            )}

            <div className='flex gap-3'>
              <Button
                type='button'
                variant='outline'
                className='flex-1 py-3'
                onClick={() => { setEtape(1); setErreur(null) }}
              >
                {t('onboarding_back')}
              </Button>
              <Button type='submit' className='flex-1 py-3'>
                {t('onboarding_continue')}
              </Button>
            </div>
          </form>
        )}

        {/* ÉTAPE 3 — Notifications */}
        {etape === 3 && (
          <form onSubmit={handleEtape3} className='space-y-5'>
            {/* Toggle email — activé par défaut */}
            <div className='flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-600'>
              <div>
                <p className='text-sm font-medium text-gray-900 dark:text-white'>
                  📧 {t('onboarding_email_notif')}
                </p>
              </div>
              <button
                type='button'
                onClick={() => setEmailNotifActif(!emailNotifActif)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifActif ? 'bg-cyan-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
                role='switch'
                aria-checked={emailNotifActif}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    emailNotifActif ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Toggle notifications push */}
            {pushSupporte && (
              <div className='flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-600'>
                <div>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    🔔 {t('onboarding_push_notif')}
                  </p>
                  {pushBloque && (
                    <p className='mt-1 text-xs text-amber-600 dark:text-amber-400'>
                      {t('push_blocked', { ns: 'rappels' })}
                    </p>
                  )}
                </div>
                {!pushBloque && (
                  <button
                    type='button'
                    onClick={pushActif ? desactiverPushOnboarding : activerPushOnboarding}
                    className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                      pushActif ? 'bg-cyan-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                    role='switch'
                    aria-checked={pushActif}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        pushActif ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                )}
              </div>
            )}

            {erreur && (
              <Alert variant='destructive'>
                <AlertDescription>{erreur}</AlertDescription>
              </Alert>
            )}

            <div className='flex gap-3'>
              <Button
                type='button'
                variant='outline'
                className='flex-1 py-3'
                onClick={() => { setEtape(2); setErreur(null) }}
              >
                {t('onboarding_back')}
              </Button>
              <Button type='submit' disabled={enCours} className='flex-1 py-3'>
                {enCours ? tc('saving') : t('onboarding_finish')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
