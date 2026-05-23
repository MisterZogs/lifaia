import { useTranslation } from 'react-i18next'
import { Link as WaspRouterLink, routes } from 'wasp/client/router'
import { Button } from '../../client/components/ui/button'
import { Badge } from '../../client/components/ui/badge'

export default function Hero() {
  const { t } = useTranslation('landing')
  return (
    <div className='relative w-full pt-6'>
      <TopGradient />
      <BottomGradient />
      <div className='md:pt-12 md:px-24 pb-0'>
        <div className='max-w-8xl mx-auto px-6 lg:px-8'>
          <div className='lg:mb-18 mx-auto max-w-3xl text-center'>
            <h1 className='text-foreground text-5xl font-bold sm:text-6xl'>
              {t('hero_title_1')}{' '}
              <span className='text-gradient-primary'>{t('hero_title_highlight')}</span>
              {t('hero_title_2') ? <>{' '}{t('hero_title_2')}</> : null}
            </h1>
            <p className='text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8'>
              {t('hero_subtitle')}
            </p>

            <div className='mt-10 flex items-center justify-center gap-x-4'>
              <Button size='lg' variant='default' asChild>
                <WaspRouterLink to={routes.SignupRoute.to}>
                  {t('cta_start')}
                </WaspRouterLink>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <WaspRouterLink to={routes.PricingPageRoute.to}>
                  {t('cta_pricing')}
                </WaspRouterLink>
              </Button>
            </div>

            {/* Preuves sociales légères */}
            <div className='mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400'>
              <span>{t('proof_free')}</span>
              <span>{t('proof_no_card')}</span>
              <span>{t('proof_hosted')}</span>
            </div>
          </div>

          {/* Aperçu des onglets */}
          <div className='mt-16 flex justify-center'>
            <div className='flex flex-wrap justify-center gap-2'>
              {[
                { label: t('tab_moderne', { ns: 'chat' }), emoji: '🏥' },
                { label: t('tab_osteopathie', { ns: 'chat' }), emoji: '🦴' },
                { label: t('tab_phytotherapie', { ns: 'chat' }), emoji: '🌿' },
                { label: t('tab_nutrition', { ns: 'chat' }), emoji: '🥗' },
                { label: t('tab_aromatherapie', { ns: 'chat' }), emoji: '🌸' },
                { label: t('tab_homeopathie', { ns: 'chat' }), emoji: '💧' },
                { label: t('tab_naturopathie', { ns: 'chat' }), emoji: '🌱' },
                { label: t('tab_chinoise', { ns: 'chat' }), emoji: '☯️' },
              ].map((o) => (
                <Badge
                  key={o.label}
                  variant='secondary'
                  className='px-4 py-2 text-sm shadow-sm'
                >
                  {o.emoji} {o.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TopGradient() {
  return (
    <div className='absolute right-0 top-0 -z-10 w-full transform-gpu overflow-hidden blur-3xl sm:top-0' aria-hidden='true'>
      <div
        className='aspect-1020/880 w-280 flex-none bg-linear-to-tr from-cyan-400 to-cyan-300 opacity-10 sm:right-1/4 sm:translate-x-1/2 dark:hidden'
        style={{ clipPath: 'polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)' }}
      />
    </div>
  )
}

function BottomGradient() {
  return (
    <div className='absolute inset-x-0 top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-65rem)]' aria-hidden='true'>
      <div
        className='relative aspect-1020/880 w-360 bg-linear-to-br from-cyan-400 to-cyan-300 opacity-10 sm:-left-3/4 sm:translate-x-1/4 dark:hidden'
        style={{ clipPath: 'ellipse(80% 30% at 80% 50%)' }}
      />
    </div>
  )
}
