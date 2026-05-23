import { useTranslation } from 'react-i18next'
import { Link as WaspRouterLink, routes } from 'wasp/client/router'

export function Announcement() {
  const { t } = useTranslation('common')
  return (
    <div className='from-cyan-600 to-cyan-500 text-white relative flex w-full items-center justify-center gap-3 bg-linear-to-r p-2.5 text-center text-sm font-medium'>
      <WaspRouterLink
        to={routes.PricingPageRoute.to}
        className='bg-white/20 hover:bg-white/30 cursor-pointer rounded-full px-3 py-1 text-xs transition-colors'
      >
        {t('try_free')}
      </WaspRouterLink>
    </div>
  )
}
