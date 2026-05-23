import { useTranslation } from 'react-i18next'
import { Link as WaspRouterLink, routes } from 'wasp/client/router'

/**
 * Page Conditions Générales d'Utilisation de Lifaia.
 * Doit être explicitement acceptée par l'utilisateur lors de l'onboarding.
 * TODO avant production : faire valider par un avocat spécialisé santé numérique.
 */
export default function CguPage() {
  const { t } = useTranslation('legal')

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      <div className='mx-auto max-w-3xl px-6 py-16'>
        {t('french_only_notice') && (
          <div className='mb-6 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-700 dark:border-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'>
            {t('french_only_notice')}
          </div>
        )}
        <h1 className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>
          {t('cgu_title')}
        </h1>
        <p className='mb-8 text-sm text-gray-500 dark:text-gray-400'>
          {t('cgu_version')}
        </p>

        {/* Encadré disclaimer médical — obligation légale */}
        <div className='mb-8 rounded-lg border-2 border-red-400 bg-red-50 p-5 dark:border-red-600 dark:bg-red-950'>
          <p className='font-bold text-red-700 dark:text-red-300'>
            ⚠️ Avertissement médical — à lire attentivement
          </p>
          <p className='mt-2 text-red-600 dark:text-red-400'>
            Lifaia est un{' '}
            <strong>outil d'information et de bien-être grand public</strong>.
            Il ne constitue pas un dispositif médical au sens du règlement (UE)
            2017/745. Il ne pose aucun diagnostic, ne prescrit aucun médicament et
            ne remplace en aucun cas la consultation d'un professionnel de santé.
            Les informations fournies sont à titre informatif uniquement et ne
            constituent pas un avis médical.
          </p>
          <p className='mt-2 text-red-600 dark:text-red-400'>
            <strong>En cas d'urgence médicale</strong>, appelez immédiatement le{' '}
            <strong>15 (SAMU)</strong>, le <strong>18 (Pompiers)</strong> ou le{' '}
            <strong>112 (numéro d'urgence européen)</strong>.
          </p>
        </div>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Article 1 — Objet et acceptation
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Les présentes Conditions Générales d'Utilisation (CGU) régissent
            l'accès et l'utilisation de l'application Lifaia, éditée par
            une entreprise individuelle (SIRET 83030040600048). En créant un compte ou en utilisant le service, l'utilisateur
            accepte sans réserve les présentes CGU ainsi que la{' '}
            <WaspRouterLink
              to={routes.MentionsLegalesRoute.to}
              className='underline hover:text-gray-900'
            >
              politique de confidentialité
            </WaspRouterLink>
            .
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Article 2 — Description du service
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Lifaia est une application web d'assistance santé personnelle basée
            sur l'intelligence artificielle. Elle permet à l'utilisateur de :
          </p>
          <ul className='mt-2 list-disc pl-6 text-gray-600 dark:text-gray-400'>
            <li>Décrire ses symptômes en langage naturel et recevoir des informations générales sur les approches possibles, selon différents systèmes de médecine ;</li>
            <li>Gérer son profil santé personnel (antécédents, allergies, médicaments en cours) ;</li>
            <li>Recevoir des rappels relatifs à ses médicaments, vaccins et bilans de santé ;</li>
            <li>Accéder à des informations de santé personnalisées selon son pays de résidence.</li>
          </ul>
          <p className='mt-3 font-medium text-gray-700 dark:text-gray-300'>
            Lifaia n'est pas un service de télémédecine. Aucun médecin ne
            consulte les données de l'utilisateur en temps réel. Le service ne
            remplace pas une consultation médicale professionnelle.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Article 3 — Limites de responsabilité médicale
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            L'utilisateur reconnaît et accepte expressément que :
          </p>
          <ul className='mt-2 list-disc pl-6 text-gray-600 dark:text-gray-400'>
            <li>Lifaia ne formule aucun diagnostic médical ;</li>
            <li>Lifaia ne prescrit aucun médicament ni traitement ;</li>
            <li>
              Les informations fournies par l'IA sont générées à partir de sources
              documentaires et doivent être systématiquement validées par un
              professionnel de santé avant toute décision médicale ;
            </li>
            <li>
              L'éditeur décline toute responsabilité pour les décisions prises par
              l'utilisateur sur la seule base des informations fournies par
              l'application.
            </li>
          </ul>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Article 4 — Données personnelles et de santé
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Les données de santé collectées sont considérées comme des données
            sensibles au sens du RGPD (article 9). Elles sont :
          </p>
          <ul className='mt-2 list-disc pl-6 text-gray-600 dark:text-gray-400'>
            <li>Chiffrées au repos (AES-256) et en transit (TLS 1.3) ;</li>
            <li>
              Hébergées exclusivement chez un prestataire certifié Hébergeur de
              Données de Santé (HDS) conformément à l'article L.1111-8 du Code de la
              santé publique ;
            </li>
            <li>Jamais vendues ni partagées avec des tiers à des fins commerciales ;</li>
            <li>
              Conservées pendant la durée d'activité du compte puis supprimées
              conformément aux obligations légales.
            </li>
          </ul>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            L'utilisateur dispose d'un droit d'accès, de rectification, d'effacement
            et de portabilité de ses données, exerceable à{' '}
            <a
              href='mailto:privacy@lifaia.com'
              className='underline hover:text-gray-900'
            >
              privacy@lifaia.com
            </a>
            .
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Article 5 — Conditions d'accès et compte utilisateur
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Le service est réservé aux personnes majeures (18 ans et plus). L'utilisation
            du service par des mineurs nécessite l'accord d'un représentant légal.
            L'utilisateur est responsable de la confidentialité de ses identifiants de
            connexion.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Article 6 — Transparence sur l'intelligence artificielle
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Conformément au règlement européen sur l'IA (AI Act, Règlement UE
            2024/1689), Lifaia informe ses utilisateurs qu'ils interagissent avec
            un système d'intelligence artificielle. L'IA utilisée est un modèle de
            langage (LLM) dont les réponses sont générées automatiquement et peuvent
            contenir des erreurs. L'utilisateur est invité à exercer son jugement
            critique et à consulter un professionnel de santé.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Article 7 — Offres et tarification
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Lifaia propose une offre gratuite avec accès limité et une offre
            premium avec accès complet. Les tarifs en vigueur sont affichés sur la
            page de tarification. L'éditeur se réserve le droit de modifier les
            tarifs avec un préavis de 30 jours.
          </p>
        </section>

        <section className='mb-8'>
          <h2 className='mb-3 text-xl font-semibold text-gray-800 dark:text-gray-200'>
            Article 8 — Droit applicable et litiges
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Les présentes CGU sont soumises au droit français. En cas de litige, les
            parties s'engagent à rechercher une solution amiable avant tout recours
            judiciaire. À défaut d'accord amiable, le litige sera soumis aux
            tribunaux compétents du ressort du siège social de l'éditeur.
          </p>
        </section>

        <div className='mt-12 border-t border-gray-200 pt-6 dark:border-gray-700'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {t('last_updated')}
          </p>
          <div className='mt-4 flex gap-4'>
            <WaspRouterLink
              to={routes.MentionsLegalesRoute.to}
              className='text-sm underline hover:text-gray-900 dark:hover:text-white'
            >
              {t('mentions_link')}
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
