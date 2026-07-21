import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'wasp/client/router'
import { useAuth } from 'wasp/client/auth'
import { getHistoriqueChat, getEnfants, effacerHistoriqueChat } from 'wasp/client/operations'
import { useQuery } from 'wasp/client/operations'
import type { OngletMedecine } from '../mistral/prompts'
import { isUserPremium, isOngletAccessible, LIMITE_MESSAGES_GRATUIT } from '../payment/freemium'
import { SubscriptionStatus } from '../payment/plans'
import i18n from '../client/i18n'

// Types des onglets traduits — construits à l'intérieur du composant avec useTranslation
type OngletConfig = {
  id: OngletMedecine
  label: string
  icone: string
}

// Récupère le token de session Wasp depuis localStorage (clé : "wasp:sessionId", valeur JSON-stringifiée)
function getWaspSessionToken(): string | null {
  try {
    const raw = localStorage.getItem('wasp:sessionId')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

type Message = {
  id: string
  role: string
  contenu: string
  urgenceDetectee: boolean
  createdAt: Date
}


/**
 * Page principale du chat médical Lifaia.
 * 6 onglets de médecines avec disclaimers adaptés au niveau de preuve.
 * Les réponses IA sont streamées via SSE pour afficher les tokens au fil de leur génération.
 */
export default function ChatPage() {
  const { data: user } = useAuth()
  const { t } = useTranslation('chat')

  // Configuration des onglets traduits — construite à l'intérieur du composant
  const ONGLETS: OngletConfig[] = [
    { id: 'moderne', label: t('tab_moderne'), icone: '🏥' },
    { id: 'osteopathie', label: t('tab_osteopathie'), icone: '🦴' },
    { id: 'phytotherapie', label: t('tab_phytotherapie'), icone: '🌿' },
    { id: 'nutrition', label: t('tab_nutrition'), icone: '🥗' },
    { id: 'aromatherapie', label: t('tab_aromatherapie'), icone: '🌸' },
    { id: 'homeopathie', label: t('tab_homeopathie'), icone: '💧' },
    { id: 'naturopathie', label: t('tab_naturopathie'), icone: '🌱' },
    { id: 'chinoise', label: t('tab_chinoise'), icone: '☯️' },
  ]

const premium = user ? isUserPremium(user as { subscriptionStatus?: string | null; subscriptionPlan?: string | null }) : false
  const [ongletActif, setOngletActif] = useState<OngletMedecine>('moderne')
  // null = consultation pour soi-même, string = id de l'enfant concerné
  const [contexteEnfantId, setContexteEnfantId] = useState<string | null>(null)
  const [saisie, setSaisie] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [enCours, setEnCours] = useState(false)
  // Vrai uniquement pendant la phase de pré-traitement, avant le premier token streamé
  const [attendPremierToken, setAttendPremierToken] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [limite, setLimite] = useState(30)
  const finListeRef = useRef<HTMLDivElement>(null)
  const zoneMessagesRef = useRef<HTMLDivElement>(null)
  // true = on suit le bas (scroll auto actif) ; false = l'utilisateur a scrollé vers le haut
  const suivreBasRef = useRef(true)

  const { data: enfants } = useQuery(getEnfants)

  const { data: historique } = useQuery(getHistoriqueChat, {
    onglet: ongletActif,
    limite,
  })

  // Mise à jour des messages quand l'historique change ou qu'on change d'onglet
  useEffect(() => {
    if (historique) {
      setMessages(historique as Message[])
    } else {
      setMessages([])
    }
  }, [historique, ongletActif])

  // Défilement automatique vers le bas — seulement si l'utilisateur est déjà en bas
  useEffect(() => {
    if (suivreBasRef.current) {
      finListeRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  function handleScroll() {
    const zone = zoneMessagesRef.current
    if (!zone) return
    const distanceDuBas = zone.scrollHeight - zone.scrollTop - zone.clientHeight
    // On reprend le suivi automatique si l'utilisateur est à moins de 80px du bas
    suivreBasRef.current = distanceDuBas < 80
  }

  const ongletConfig = ONGLETS.find((o) => o.id === ongletActif)!

  async function handleEnvoyer(e: React.FormEvent) {
    e.preventDefault()
    const texte = saisie.trim()
    if (!texte || enCours) return

    setErreur(null)
    setSaisie('')

    // Message utilisateur ajouté immédiatement (optimiste)
    const idMessageUtilisateur = `temp-user-${Date.now()}`
    const messageUtilisateur: Message = {
      id: idMessageUtilisateur,
      role: 'user',
      contenu: texte,
      urgenceDetectee: false,
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, messageUtilisateur])
    setEnCours(true)
    setAttendPremierToken(true)
    suivreBasRef.current = true // force le scroll vers le bas à l'envoi

    // Identifiant temporaire du message assistant en cours de streaming
    const idMessageStream = `stream-${Date.now()}`

    // Variables locales pour accumuler le contenu sans passer par le state React
    let contenuStream = ''
    let streamDémarré = false
    let estUrgence = false

    try {
      // Appel SSE via fetch natif — ReadableStream est l'API idéale pour du streaming SSE.
      // Le token de session Wasp est lu depuis localStorage et passé en header Authorization.
      const token = getWaspSessionToken()
      // En dev : URL relative proxifiée par Vite. En prod : URL absolue vers api.lifaia.com
      const apiBase = import.meta.env.REACT_APP_API_URL || ''
      const response = await fetch(`${apiBase}/api/chat-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ contenu: texte, onglet: ongletActif, contexteEnfantId }),
      })

      if (!response.ok) {
        const texteErreur = await response.text().catch(() => '')
        throw new Error(`Erreur ${response.status}${texteErreur ? ': ' + texteErreur : ''}`)
      }

      if (!response.body) {
        throw new Error('Streaming non supporté par ce navigateur.')
      }

      // Lecture progressive du flux SSE
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Extraire toutes les lignes complètes et conserver le fragment en cours
        const lignes = buffer.split('\n')
        buffer = lignes.pop() ?? ''

        for (const ligne of lignes) {
          if (!ligne.startsWith('data: ')) continue
          try {
            const data = JSON.parse(ligne.slice(6))

            if (data.token) {
              contenuStream += data.token

              if (!streamDémarré) {
                // Premier token : créer la bulle assistant et masquer l'indicateur
                streamDémarré = true
                setAttendPremierToken(false)
                setMessages((prev) => [
                  ...prev,
                  {
                    id: idMessageStream,
                    role: 'assistant',
                    contenu: contenuStream,
                    urgenceDetectee: estUrgence,
                    createdAt: new Date(),
                  },
                ])
              } else {
                // Tokens suivants : mise à jour progressive du message
                const snapContenu = contenuStream
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === idMessageStream ? { ...m, contenu: snapContenu } : m
                  )
                )
              }
            } else if (data.urgence) {
              estUrgence = true
            } else if (data.done) {
              // Remplacement de l'ID temporaire par l'ID persisté en base
              if (data.messageId) {
                const idFinal = data.messageId
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === idMessageStream ? { ...m, id: idFinal } : m
                  )
                )
              }
            } else if (data.error) {
              const msgErreur =
                data.error === 'PREMIUM_REQUIRED'
                  ? t('premium_required')
                  : data.error === 'DAILY_LIMIT_REACHED'
                  ? t('daily_limit_reached', { limit: LIMITE_MESSAGES_GRATUIT })
                  : data.error
              setErreur(msgErreur)
              setMessages((prev) => prev.filter((m) => m.id !== idMessageStream))
            }
          } catch {
            // Ligne SSE mal formée — ignorée silencieusement
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Service temporairement indisponible.'
      setErreur(msg)
      // Supprimer le message stream vide en cas d'erreur réseau
      setMessages((prev) => prev.filter((m) => m.id !== idMessageStream))
    } finally {
      setEnCours(false)
      setAttendPremierToken(false)
    }
  }

  // Efface l'historique de l'onglet actif et vide le state local
  async function handleNouvelleConversation() {
    try {
      await effacerHistoriqueChat({ onglet: ongletActif })
      setMessages([])
    } catch {
      // Échec silencieux — l'utilisateur peut réessayer
    }
  }

  return (
    <div className='flex flex-1 flex-col bg-gray-50 dark:bg-gray-900 min-h-0 overflow-hidden'>
      {/* Onglets de médecines */}
      <div className='border-b border-gray-200 bg-white shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:shadow-none'>
        <div className='mx-auto max-w-4xl overflow-x-auto'>
          <div className='flex min-w-max items-center'>
            <div className='flex flex-1 min-w-max'>
            {ONGLETS.map((onglet) => {
              const accessible = isOngletAccessible(onglet.id, premium)
              return accessible ? (
                <button
                  key={onglet.id}
                  onClick={() => setOngletActif(onglet.id)}
                  className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    ongletActif === onglet.id
                      ? 'border-cyan-500 text-cyan-600 dark:border-cyan-400 dark:text-cyan-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <span>{onglet.icone}</span>
                  <span>{onglet.label}</span>
                </button>
              ) : (
                <Link
                  key={onglet.id}
                  to='/pricing'
                  className='flex items-center gap-1.5 border-b-2 border-transparent px-4 py-3 text-sm font-medium whitespace-nowrap text-gray-300 hover:text-gray-400 dark:text-gray-600 dark:hover:text-gray-500'
                  title={t('premium_tab_title')}
                >
                  <span>{onglet.icone}</span>
                  <span>{onglet.label}</span>
                  <span className='ml-0.5 text-xs'>🔒</span>
                </Link>
              )
            })}
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleNouvelleConversation}
                className='ml-auto shrink-0 rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300 mr-2'
              >
                {t('new_conversation')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sélecteur de contexte — visible uniquement si l'utilisateur a des enfants */}
      {enfants && enfants.length > 0 && (
        <div className='border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800/50'>
          <div className='mx-auto flex max-w-4xl items-center gap-3'>
            <span className='text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap'>
              {t('consult_for')}
            </span>
            <div className='flex flex-wrap gap-2'>
              <button
                onClick={() => setContexteEnfantId(null)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  contexteEnfantId === null
                    ? 'bg-cyan-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                }`}
              >
                {t('me', { ns: 'common' })}
              </button>
              {enfants.map((enfant) => (
                <button
                  key={enfant.id}
                  onClick={() => setContexteEnfantId(enfant.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    contexteEnfantId === enfant.id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  {enfant.prenom}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer homéopathie uniquement */}
      {ongletConfig.id === 'homeopathie' && (
        <div className='border-b px-4 py-1.5'>
          <div className='mx-auto max-w-4xl'>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {t('homeopathie_disclaimer')}
            </p>
          </div>
        </div>
      )}


      {/* Zone de messages */}
      <div ref={zoneMessagesRef} onScroll={handleScroll} className='flex-1 overflow-y-auto px-4 py-6'>
        <div className='mx-auto max-w-3xl space-y-4'>
          {/* Bouton charger plus — visible si l'historique est plein */}
          {historique && historique.length >= limite && (
            <div className='flex justify-center'>
              <button
                onClick={() => setLimite((l) => l + 30)}
                className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400'
              >
                {t('load_previous')}
              </button>
            </div>
          )}

          {messages.length === 0 && !enCours && (
            <div className='rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-center dark:border-cyan-900 dark:bg-cyan-900/20'>
              <p className='text-sm text-cyan-700 dark:text-cyan-300'>
                {ongletConfig.icone} <strong>{ongletConfig.label}</strong>
                <br />
                {t('empty_tab_line1', { label: ongletConfig.label })}
                <br />
                {t('empty_tab_line2')}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <BulleMessage key={message.id} message={message} />
          ))}

          {/* Indicateur de saisie : affiché uniquement avant le premier token streamé */}
          {attendPremierToken && (
            <div className='flex justify-start'>
              <div className='rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm dark:bg-gray-800'>
                <div className='flex gap-1'>
                  <span className='h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]' />
                  <span className='h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]' />
                  <span className='h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]' />
                </div>
              </div>
            </div>
          )}

          <div ref={finListeRef} />
        </div>
      </div>

      {erreur && (
        <div className='border-t border-red-200 bg-red-50 px-4 py-2 dark:border-red-800 dark:bg-red-900/20'>
          <p className='mx-auto max-w-3xl text-center text-sm text-red-600 dark:text-red-400'>
            {erreur}{' '}
            {(erreur.includes('Premium') || erreur.includes('premium') || erreur.includes('limite') || erreur.includes('limit')) && (
              <Link to='/pricing' className='underline hover:text-red-700 dark:hover:text-red-300'>
                {t('see_offers')}
              </Link>
            )}
          </p>
        </div>
      )}

      {/* Zone de saisie */}
      <div className='border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-800'>
        <form onSubmit={handleEnvoyer} className='mx-auto flex max-w-3xl items-end gap-3'>
          <textarea
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleEnvoyer(e)
              }
            }}
            placeholder={t('placeholder', { label: ongletConfig.label })}
            rows={2}
            maxLength={2000}
            disabled={enCours}
            className='flex-1 resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
          />
          <button
            type='submit'
            disabled={!saisie.trim() || enCours}
            className='rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {t('send')}
          </button>
        </form>
        <p className='mx-auto mt-1 max-w-3xl text-right text-xs text-gray-400'>
          {saisie.length}/2000
        </p>
      </div>
    </div>
  )
}

function BulleMessage({ message }: { message: Message }) {
  const estUtilisateur = message.role === 'user'

  if (message.urgenceDetectee) {
    return (
      <div className='rounded-xl border-2 border-red-400 bg-red-50 p-4 dark:border-red-600 dark:bg-red-900/30'>
        <div className='whitespace-pre-wrap text-sm text-red-800 dark:text-red-200'>
          {formaterMarkdown(message.contenu)}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${estUtilisateur ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
          estUtilisateur
            ? 'rounded-tr-sm bg-cyan-600 text-white'
            : 'rounded-tl-sm bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100'
        }`}
      >
        <div className='whitespace-pre-wrap leading-relaxed'>
          {formaterMarkdown(message.contenu)}
        </div>
      </div>
    </div>
  )
}

function formaterMarkdown(texte: string): React.ReactNode {
  const lignes = texte.split('\n')
  return lignes.map((ligne, i) => {
    const parties = ligne.split(/(\*\*[^*]+\*\*)/g)
    return (
      <span key={i}>
        {parties.map((partie, j) =>
          partie.startsWith('**') && partie.endsWith('**') ? (
            <strong key={j}>{partie.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{partie}</span>
          )
        )}
        {i < lignes.length - 1 && <br />}
      </span>
    )
  })
}
