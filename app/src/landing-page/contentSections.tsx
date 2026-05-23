// Ces données sont maintenant dans les fichiers de traduction landing.json
// Les composants LandingPage/FeaturesGrid/FAQ lisent directement depuis i18n

// Gardé uniquement pour le footer (statique, URLs ne changent pas)
export const footerNavigation = {
  app: [
    { name: 'footer_chat', href: '/chat', ns: 'landing' },
    { name: 'footer_dossier', href: '/dossier-medical', ns: 'landing' },
    { name: 'footer_rappels', href: '/rappels', ns: 'landing' },
    { name: 'footer_pricing', href: '/pricing', ns: 'landing' },
  ],
  company: [
    { name: 'footer_mentions', href: '/mentions-legales', ns: 'landing' },
    { name: 'footer_cgu', href: '/cgu', ns: 'landing' },
    { name: 'footer_privacy', href: '/mentions-legales', ns: 'landing' },
  ],
}
