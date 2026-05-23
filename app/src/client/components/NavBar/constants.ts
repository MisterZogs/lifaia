import { routes } from 'wasp/client/router'
import type { NavigationItem } from './NavBar'

// Les noms sont des clés i18n — traduits dans NavBar.tsx via t(item.name, { ns: item.ns ?? 'common' })
export const marketingNavigationItems: NavigationItem[] = [
  { name: 'nav_features', to: '/#features', ns: 'landing' },
  { name: 'nav_pricing', to: routes.PricingPageRoute.to, ns: 'landing' },
] as const

// Navigation principale de l'app après connexion
export const demoNavigationitems: NavigationItem[] = [
  { name: 'my_assistant', to: routes.ChatRoute.to },
  { name: 'nav_dossier', to: routes.DossierMedicalRoute.to, ns: 'landing' },
  { name: 'nav_rappels', to: routes.RappelsRoute.to, ns: 'landing' },
  { name: 'account_settings', to: routes.AccountRoute.to },
] as const
