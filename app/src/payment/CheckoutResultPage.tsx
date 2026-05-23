import { useEffect } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Link as WaspRouterLink, routes } from 'wasp/client/router'

const REDIRECT_DELAY_MS = 5000

export default function CheckoutResultPage() {
  const navigate = useNavigate()
  const [urlSearchParams] = useSearchParams()
  const status = urlSearchParams.get('status')
  const { t } = useTranslation('pricing')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate('/chat')
    }, REDIRECT_DELAY_MS)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  if (status !== 'success' && status !== 'canceled') {
    return <Navigate to='/chat' />
  }

  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <div className='w-full max-w-md rounded-2xl border border-gray-200 bg-white px-10 py-10 text-center shadow-xl dark:border-gray-700 dark:bg-gray-800'>
        {status === 'success' && (
          <>
            <div className='mb-4 text-5xl'>🎉</div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
              {t('checkout_success_title')}
            </h1>
            <p className='mb-6 text-gray-600 dark:text-gray-400'>
              {t('checkout_success_text')}
            </p>
          </>
        )}
        {status === 'canceled' && (
          <>
            <div className='mb-4 text-5xl'>↩️</div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
              {t('checkout_canceled_title')}
            </h1>
            <p className='mb-6 text-gray-600 dark:text-gray-400'>
              {t('checkout_canceled_text')}
            </p>
          </>
        )}

        <p className='text-sm text-gray-400 dark:text-gray-500'>
          {t('redirect_seconds', { seconds: REDIRECT_DELAY_MS / 1000 })}
        </p>

        <div className='mt-6 flex justify-center gap-4'>
          <WaspRouterLink
            to={routes.ChatRoute.to}
            className='rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700'
          >
            {t('go_to_chat')}
          </WaspRouterLink>
          {status === 'canceled' && (
            <WaspRouterLink
              to={routes.PricingPageRoute.to}
              className='rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
            >
              {t('see_offers')}
            </WaspRouterLink>
          )}
        </div>
      </div>
    </div>
  )
}
