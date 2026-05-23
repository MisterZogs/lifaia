import { useTranslation } from 'react-i18next'
import { Link } from 'wasp/client/router'
import type { User } from 'wasp/entities'
import { Card, CardContent, CardHeader, CardTitle } from '../client/components/ui/card'
import { Separator } from '../client/components/ui/separator'

export default function AccountPage({ user }: { user: User }) {
  const { t } = useTranslation('common')

  return (
    <div className='mx-auto max-w-2xl px-4 py-10 space-y-8'>
      <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{t('account_settings')}</h1>

      <Card>
        <CardHeader>
          <CardTitle className='text-sm font-semibold'>{t('account_info')}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className='pt-4 space-y-3'>
          {user.email && (
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{t('email_address')}</span>
              <span className='text-sm text-gray-900 dark:text-white'>{user.email}</span>
            </div>
          )}
          <div className='pt-1'>
            <Link
              to='/dossier-medical'
              className='text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400'
            >
              {t('manage_medical_profile')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
