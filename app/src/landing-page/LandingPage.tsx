import { useTranslation } from 'react-i18next'
import FAQ from './components/FAQ'
import FeaturesGrid from './components/FeaturesGrid'
import Footer from './components/Footer'
import Hero from './components/Hero'
import { footerNavigation } from './contentSections'

export default function LandingPage() {
  const { t } = useTranslation('landing')

  const features = t('features', { returnObjects: true }) as any[]
  const faqs = t('faqs', { returnObjects: true }) as any[]

  return (
    <div className='bg-background text-foreground'>
      <main className='isolate'>
        <Hero />
        <FeaturesGrid features={features} />
        <FAQ faqs={faqs} />
      </main>
      {/* Disclaimer médical en bas de page */}
      <div className='border-t border-gray-200 py-4 text-center dark:border-gray-800'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>{t('hero_disclaimer')}</p>
      </div>
      <Footer footerNavigation={footerNavigation} />
    </div>
  )
}
