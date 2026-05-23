import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'wasp/client/auth'
import { generateCheckoutSession, getCustomerPortalUrl, useQuery } from 'wasp/client/operations'
import { PaymentPlanId, SubscriptionStatus } from './plans'
import { LIMITE_MESSAGES_GRATUIT } from './freemium'
import { Card, CardContent, CardHeader } from '../client/components/ui/card'
import { Button } from '../client/components/ui/button'
import { Alert, AlertDescription } from '../client/components/ui/alert'
import { Badge } from '../client/components/ui/badge'

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
        <Alert variant='destructive' className='mb-8'>
          <AlertDescription className='text-center'>{erreur}</AlertDescription>
        </Alert>
      )}

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Plan Gratuit */}
        <Card className='border-gray-200 dark:border-gray-700'>
          <CardHeader className='pb-0'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>{t('free_title')}</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{t('free_subtitle')}</p>
            <div className='mt-2 flex items-baseline gap-1'>
              <span className='text-4xl font-bold text-gray-900 dark:text-white'>0 €</span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{t('free_per_month')}</span>
            </div>
          </CardHeader>
          <CardContent className='pt-6'>
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
              <Button variant='outline' className='w-full' onClick={() => navigate('/chat')}>
                {t('free_current_plan')}
              </Button>
            ) : (
              <Button className='w-full' onClick={() => navigate('/signup')}>
                {t('signup_cta')}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Plan Premium mensuel */}
        <Card className='border-cyan-200 dark:border-cyan-900'>
          <CardHeader className='pb-0'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>{t('premium_title')}</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{t('premium_subtitle')}</p>
            <div className='mt-2 flex items-baseline gap-1'>
              <span className='text-4xl font-bold text-gray-900 dark:text-white'>7,99 €</span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{t('premium_per_month')}</span>
            </div>
          </CardHeader>
          <CardContent className='pt-6'>
            <ul className='mb-8 space-y-3'>
              {featuresPremium.map((f) => (
                <li key={f} className='flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200'>
                  <svg className='mt-0.5 h-4 w-4 shrink-0 text-cyan-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {isPremium ? (
              <Button
                variant='outline'
                className='w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-300 dark:hover:bg-cyan-900/30'
                onClick={handleGererAbonnement}
              >
                {t('manage_subscription')}
              </Button>
            ) : (
              <Button className='w-full' onClick={() => handleSouscrire(PaymentPlanId.Premium)} disabled={enCours !== null}>
                {enCours === PaymentPlanId.Premium ? t('redirecting') : user ? t('choose_monthly') : t('signup_cta')}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Plan Premium annuel — recommandé */}
        <Card className='relative border-2 border-cyan-500'>
          <div className='absolute -top-3.5 left-1/2 -translate-x-1/2'>
            <Badge>{t('premium_badge')}</Badge>
          </div>
          <CardHeader className='pb-0'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>{t('premium_annual_title')}</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{t('premium_annual_subtitle')}</p>
            <div className='mt-2 flex items-baseline gap-1'>
              <span className='text-4xl font-bold text-gray-900 dark:text-white'>79,99 €</span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{t('premium_annual_per_year')}</span>
            </div>
            <p className='text-xs font-medium text-green-600 dark:text-green-400'>{t('premium_annual_savings')}</p>
          </CardHeader>
          <CardContent className='pt-6'>
            <ul className='mb-8 space-y-3'>
              {featuresPremium.map((f) => (
                <li key={f} className='flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200'>
                  <svg className='mt-0.5 h-4 w-4 shrink-0 text-cyan-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            {isPremium ? (
              <Button
                variant='outline'
                className='w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-700 dark:text-cyan-300 dark:hover:bg-cyan-900/30'
                onClick={handleGererAbonnement}
              >
                {t('manage_subscription')}
              </Button>
            ) : (
              <Button className='w-full' onClick={() => handleSouscrire(PaymentPlanId.PremiumAnnuel)} disabled={enCours !== null}>
                {enCours === PaymentPlanId.PremiumAnnuel ? t('redirecting') : user ? t('choose_annual') : t('signup_cta')}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <p className='mt-10 text-center text-xs text-gray-400 dark:text-gray-500'>
        {t('stripe_notice')}
      </p>
    </div>
  )
}
