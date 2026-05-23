import { useTranslation } from 'react-i18next'
import { Separator } from '../../client/components/ui/separator'

interface NavigationItem {
  name: string;
  href: string;
  ns?: string;
}

export default function Footer({
  footerNavigation,
}: {
  footerNavigation: {
    app: NavigationItem[];
    company: NavigationItem[];
  };
}) {
  const { t } = useTranslation('landing')

  return (
    <div className="dark:bg-boxdark-2 mx-auto mt-6 max-w-7xl px-6 lg:px-8">
      <Separator className="opacity-10" />
      <footer
        aria-labelledby="footer-heading"
        className="relative py-24 sm:mt-32"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mt-10 flex items-start justify-end gap-20">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              {t('footer_app_title')}
            </h3>
            <ul role="list" className="mt-6 space-y-4">
              {footerNavigation.app.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white"
                  >
                    {t(item.name, { ns: item.ns ?? 'landing' })}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              {t('footer_company_title')}
            </h3>
            <ul role="list" className="mt-6 space-y-4">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white"
                  >
                    {t(item.name, { ns: item.ns ?? 'landing' })}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
