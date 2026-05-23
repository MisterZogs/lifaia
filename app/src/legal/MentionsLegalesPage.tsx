import { useTranslation } from 'react-i18next'
import { Link as WaspRouterLink, routes } from 'wasp/client/router'

/**
 * Page Mentions Légales de Lifaia.
 * Accessible sans connexion, référencée depuis le footer et les CGU.
 * TODO avant production : faire relire par un avocat spécialisé santé numérique.
 */
export default function MentionsLegalesPage() {
  const { t } = useTranslation('legal')

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      <div className='mx-auto max-w-3xl px-6 py-16'>
        {t('french_only_notice') && (
          <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
            {t('french_only_notice')}
          </div>
        )}
        <h1 className='mb-8 text-3xl font-bold text-gray-900 dark:text-white'>
          {t('mentions_title')}
        </h1>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            1. Éditeur du site
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Lifaia
            <br />
            Entreprise individuelle (auto-entrepreneur)
            <br />
            45 Av. du Président J F Kennedy, 64200 Biarritz, France
            <br />
            SIRET : 83030040600048
            <br />
            Représentant légal : Gaëtan F.
            <br />
            Email : contact@lifaia.com
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            2. Directeur de la publication
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Gaëtan F.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            3. Hébergement
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Les données de santé sont hébergées chez un prestataire certifié
            Hébergeur de Données de Santé (HDS) conformément à l'article L.1111-8
            du Code de la santé publique.
            <br />
            <span className='font-medium text-amber-600'>[HÉBERGEUR HDS — À COMPLÉTER : OVHcloud HDS / Scaleway Healthcare / autre]</span>
            <br />
            <span className='font-medium text-amber-600'>[ADRESSE HÉBERGEUR — À COMPLÉTER]</span>
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            4. Nature du service — Avertissement médical important
          </h2>
          <div className='rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-950'>
            <p className='font-semibold text-amber-800 dark:text-amber-200'>
              Lifaia est un outil d'information et de bien-être grand public.
            </p>
            <p className='mt-2 text-amber-700 dark:text-amber-300'>
              Cette application <strong>n'est pas un dispositif médical</strong> au
              sens du règlement (UE) 2017/745. Elle ne pose aucun diagnostic, ne
              prescrit aucun médicament et ne remplace en aucun cas l'avis d'un
              professionnel de santé qualifié. En cas d'urgence médicale, appelez
              immédiatement le 15 (SAMU), le 18 (Pompiers) ou le 112 (numéro
              d'urgence européen).
            </p>
          </div>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            5. Propriété intellectuelle
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            L'ensemble du contenu de ce site (textes, images, interfaces, code
            source) est la propriété de Lifaia ou de ses partenaires et est
            protégé par le droit d'auteur. Toute reproduction totale ou partielle
            est interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            6. Protection des données personnelles (RGPD)
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Lifaia collecte et traite des données à caractère personnel,
            incluant des données de santé, dans le respect du Règlement Général sur
            la Protection des Données (RGPD — Règlement UE 2016/679) et de la loi
            Informatique et Libertés.
          </p>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            <strong>Délégué à la Protection des Données (DPO) :</strong>{' '}
            <span className='font-medium text-amber-600'>[NOM DPO — À COMPLÉTER]</span> —{' '}
            <a
              href='mailto:dpo@lifaia.com'
              className='underline hover:text-gray-900'
            >
              dpo@lifaia.com
            </a>
          </p>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            Pour exercer vos droits (accès, rectification, effacement,
            portabilité), contactez-nous à{' '}
            <a
              href='mailto:privacy@lifaia.com'
              className='underline hover:text-gray-900'
            >
              privacy@lifaia.com
            </a>
            . Vous pouvez également introduire une réclamation auprès de la CNIL
            (www.cnil.fr).
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            7. Cookies
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Lifaia utilise uniquement des cookies strictement nécessaires au
            fonctionnement du service (session d'authentification). Aucun cookie
            publicitaire ou de tracking tiers n'est utilisé sans votre consentement
            explicite.
          </p>
        </section>

        <div className='mt-12 border-t border-gray-200 pt-6 dark:border-gray-700'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {t('last_updated')}
          </p>
          <div className='mt-4 flex gap-4'>
            <WaspRouterLink
              to={routes.CguRoute.to}
              className='text-sm underline hover:text-gray-900 dark:hover:text-white'
            >
              {t('cgu_link')}
            </WaspRouterLink>
            <WaspRouterLink
              to={routes.LandingPageRoute.to}
              className='text-sm underline hover:text-gray-900 dark:hover:text-white'
            >
              {t('back_home')}
            </WaspRouterLink>
          </div>
        </div>
      </div>
    </div>
  )
}
