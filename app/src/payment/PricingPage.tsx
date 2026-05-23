import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'wasp/client/auth'
import { generateCheckoutSession, getCustomerPortalUrl, useQuery } from 'wasp/client/operations'
import { PaymentPlanId, SubscriptionStatus } from './plans'
import { LIMITE_MESSAGES_GRATUIT } from './freemium'

export default function PricingPage() {
  const [enCours, setEnCours] = useState<PaymentPlanId | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)
  const { data: user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation('pricing')

  const isPremium =
    !!user?.subscriptionStatus &&
    (user.subscriptionStatus === SubscriptionStatus.Active ||
      user.subscriptionStatus === SubscriptionStatus.CancelAtPeriodEnd)

  const { data: customerPortalUrl } = useQuery(getCustomerPortalUrl, { enabled: isPremium })

  const featuresGratuit = t('features_gratuit', { returnObjects: true }) as string[]
  const featuresPremium = t('features_premium', { returnObjects: true }) as string[]

  // Remplacement dynamique du nombre de messages dans la liste gratuit
  const featuresGratuitFinal = featuresGratuit.map((f) =>
    typeof f === 'string' ? f.replace('10', String(LIMITE_MESSAGES_GRATUIT)) : f
  )

  async function handleSouscrire(planId: PaymentPlanId) {
    if (!user) {
      navigate('/signup')
      return
    }
    try {
      setEnCours(planId)
      setErreur(null)
      const result = await generateCheckoutSession(planId)
      if (result?.sessionUrl) {
        window.open(result.sessionUrl, '_self')
      }
    } catch (err: unknown) {
      setErreur(err instanceof Error ? err.message : t('error_generic', { ns: 'common' }))
      setEnCours(null)
    }
  }

  function handleGererAbonnement() {
    if (customerPortalUrl) window.open(customerPortalUrl, '_blank')
  }

  return (
    <div className='mx-auto max-w-5xl px-4 py-16'>
      <div className='text-center mb-12'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl'>
          {t('title')}
        </h1>
        <p className='mt-4 text-lg text-gray-600 dark:text-gray-400'>
          {t('subtitle')}
        </p>
      </div>

      {erreur && (
        <div className='mb-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'>
          {erreur}
        </div>
      )}

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Plan Gratuit */}
        <div className='rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800'>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>{t('free_title')}</h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{t('free_subtitle')}</p>
            <div className='mt-4 flex items-baseline gap-1'>
              <span className='text-4xl font-bold text-gray-900 dark:text-white'>0 €</span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{t('free_per_month')}</span>
            </div>
          </div>
          <ul className='mb-8 space-y-3'>
            {featuresGratuitFinal.map((f) => (
              <li key={f} className='flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300'>
                <svg className='mt-0.5 h-4 w-4 shrink-0 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          {user ? (
            <button onClick={() => navigate('/chat')} className='w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'>
              {t('free_current_plan')}
            </button>
          ) : (
            <button onClick={() => navigate('/signup')} className='w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700'>
              {t('signup_cta')}
            </button>
          )}
        </div>

        {/* Plan Premium mensuel */}
        <div className='rounded-2xl border border-blue-200 bg-white p-8 dark:border-blue-900 dark:bg-gray-800'>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>{t('premium_title')}</h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{t('premium_subtitle')}</p>
            <div className='mt-4 flex items-baseline gap-1'>
              <span className='text-4xl font-bold text-gray-900 dark:text-white'>7,99 €</span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{t('premium_per_month')}</span>
            </div>
          </div>
          <ul className='mb-8 space-y-3'>
            {featuresPremium.map((f) => (
              <li key={f} className='flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200'>
                <svg className='mt-0.5 h-4 w-4 shrink-0 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          {isPremium ? (
            <button onClick={handleGererAbonnement} className='w-full rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
              {t('manage_subscription')}
            </button>
          ) : (
            <button onClick={() => handleSouscrire(PaymentPlanId.Premium)} disabled={enCours !== null} className='w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60'>
              {enCours === PaymentPlanId.Premium ? t('redirecting') : user ? t('choose_monthly') : t('signup_cta')}
            </button>
          )}
        </div>

        {/* Plan Premium annuel */}
        <div className='relative rounded-2xl border-2 border-blue-500 bg-white p-8 dark:bg-gray-800'>
          <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
            <span className='rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white'>
              {t('premium_badge')}
            </span>
          </div>
          <div className='mb-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>{t('premium_annual_title')}</h2>
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{t('premium_annual_subtitle')}</p>
            <div className='mt-4 flex items-baseline gap-1'>
              <span className='text-4xl font-bold text-gray-900 dark:text-white'>79,99 €</span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{t('premium_annual_per_year')}</span>
            </div>
            <p className='mt-1 text-xs text-green-600 dark:text-green-400 font-medium'>{t('premium_annual_savings')}</p>
          </div>
          <ul className='mb-8 space-y-3'>
            {featuresPremium.map((f) => (
              <li key={f} className='flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200'>
                <svg className='mt-0.5 h-4 w-4 shrink-0 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
                {f}
              </li>
            ))}
          </ul>
          {isPremium ? (
            <button onClick={handleGererAbonnement} className='w-full rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
              {t('manage_subscription')}
            </button>
          ) : (
            <button onClick={() => handleSouscrire(PaymentPlanId.PremiumAnnuel)} disabled={enCours !== null} className='w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60'>
              {enCours === PaymentPlanId.PremiumAnnuel ? t('redirecting') : user ? t('choose_annual') : t('signup_cta')}
            </button>
          )}
        </div>
      </div>

      <p className='mt-10 text-center text-xs text-gray-400 dark:text-gray-500'>
        {t('stripe_notice')}
      </p>
    </div>
  )
}
