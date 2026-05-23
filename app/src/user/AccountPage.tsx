import { useTranslation } from 'react-i18next'
import { Link } from 'wasp/client/router'
import type { User } from 'wasp/entities'

export default function AccountPage({ user }: { user: User }) {
  const { t } = useTranslation('common')

  return (
    <div className='mx-auto max-w-2xl px-4 py-10 space-y-8'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{t('account_settings')}</h1>

      <section className='rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
        <div className='border-b border-gray-200 px-6 py-4 dark:border-gray-700'>
          <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>{t('account_info')}</h2>
        </div>
        <div className='px-6 py-4 space-y-3'>
          {user.email && (
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{t('email_address')}</span>
              <span className='text-sm text-gray-900 dark:text-white'>{user.email}</span>
            </div>
          )}
          <div className='pt-1'>
            <Link
              to='/dossier-medical'
              className='text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400'
            >
              {t('manage_medical_profile')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
