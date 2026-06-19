MyDoctorIA — Contexte du projet

🎯 Vision
MyDoctorIA est une application web et mobile d'assistance santé personnelle basée sur l'IA. L'application permet à un utilisateur de décrire ses symptômes et reçoit des informations sur les approches possibles selon plusieurs systèmes de médecine, gère ses antécédents et rappels (vaccins, médicaments, check-ups), et adapte ses réponses au pays de l'utilisateur.
Positionnement légal : outil d'information et de bien-être grand public. L'application N'EST PAS un dispositif médical, ne pose aucun diagnostic, ne prescrit aucun médicament, et ne remplace jamais un avis médical professionnel. Ce positionnement est critique pour éviter la classification en dispositif médical au sens du règlement MDR et en système IA à haut risque au sens de l'AI Act européen.

🧱 Architecture fonctionnelle
Fonctionnalités principales (MVP)

Profil patient persistant

Antécédents médicaux personnels et familiaux
Allergies, traitements en cours
Carnet de vaccination
Pays de résidence (paramétrable, influence les noms de médicaments, dosages, numéros d'urgence)
Langue préférée
Données stockées de façon chiffrée, hébergement HDS (Hébergeur de Données de Santé) en France/UE
Aide au voyage : liste des vaccins recommandés par destination, médicaments à emporter selon le profil patient, numéros d'urgence locaux — généré à partir du profil existant
Fiche médicale exportable (PDF structuré) : résumé des antécédents, allergies, traitements, vaccins — à imprimer et faire valider/annoter par le médecin traitant


Chat de description de symptômes

L'utilisateur décrit ses symptômes en langage naturel
L'IA pose des questions de clarification (durée, intensité, contexte)
Le chat est strictement borné au médical (refus poli de toute autre requête)
Mémoire long terme : l'IA accède au profil patient pour personnaliser les réponses


Affichage des résultats par onglets (médecines)

Onglet 1 : Médecine moderne (allopathique, evidence-based)
Onglet 2 : Médecine traditionnelle chinoise
Onglet 3 : Médecine ayurvédique
Onglet 4 : Homéopathie
Onglet 5 : Naturopathie
Onglet 6 : Nutrition
Chaque onglet doit afficher un disclaimer sur le niveau de preuve scientifique
Chaque onglet renvoie systématiquement vers un professionnel de santé
Orientation vers les bons sites : après chaque réponse, afficher des liens contextuels vers des ressources fiables (Ameli.fr, HAS, Doctolib pour RDV, numéros d'urgence, Vidal grand public, etc.) — adaptés au pays de l'utilisateur

Paragraphe "Avis d'autres patients" (sources forums)

Afficher en section séparée des témoignages issus de forums publics (Doctissimo, Reddit santé, etc.)
Présentation explicite : "Ces témoignages sont des expériences personnelles, non validées médicalement"
Usage uniquement comme complément humain, jamais comme source de recommandation
Ne pas utiliser les forums comme source RAG pour les conseils — uniquement pour l'angle "vécu patient"


Rappels et notifications

Rappels de prise de médicaments (configurables)
Rappels de vaccins (selon calendrier vaccinal du pays)
Rappels de check-ups médicaux (mammographie, coloscopie, bilan lipidique, etc., adaptés à l'âge/sexe/pays)


Modèle économique freemium

Gratuit : chat limité (X messages/jour), accès à l'onglet médecine moderne uniquement, profil de base, rappels
Premium (à fixer, ex. 7-9€/mois) : chat illimité, tous les onglets de médecines, export PDF du dossier, support prioritaire



Fonctionnalités hors-MVP (v2+)

Intégration avec Apple Santé / Google Fit (données biométriques)
Import/lecture d'ordonnances et comptes-rendus (OCR + parsing)
Suivi de symptômes dans le temps (graphiques)
Partage du dossier avec un médecin (export PDF chiffré, lien temporaire)
Détection des interactions médicamenteuses
Intégration Doctolib : prise de RDV directe depuis l'app (via API Doctolib si disponible, ou lien profond vers doctolib.fr avec spécialité pré-remplie)
Import données depuis Mon Espace Santé (DMP — Dossier Médical Partagé) : ordonnances, comptes-rendus, historique
Import depuis Excel/CSV : pour migration depuis d'autres outils ou saisie en masse

🛡️ Contraintes légales et éthiques (non-négociables)
Garde-fous absolus dans le code et les prompts

Jamais de diagnostic. L'IA ne dit jamais "vous avez X". Elle dit "vos symptômes pourraient correspondre à plusieurs causes, dont…".
Jamais de prescription. L'IA ne dit jamais "prenez X mg de Y". Elle peut dire "les approches couramment envisagées pour ce type de symptômes incluent…, à valider avec un médecin".
Toujours renvoyer vers un professionnel à la fin de chaque réponse de symptôme.
Détection des urgences vitales : douleur thoracique, essoufflement aigu, pensées suicidaires, signes d'AVC (FAST), etc. → bypass complet du chat normal, affichage immédiat du numéro d'urgence du pays (15/112 en FR, 911 aux US, etc.) avec instruction d'appeler maintenant.
Pas de réponses non-médicales : si l'utilisateur demande autre chose (météo, code, recette), refus poli et redirection.
Disclaimer scientifique sur les médecines alternatives : chaque onglet (chinoise, ayurvédique, homéopathie, naturopathie) doit afficher en haut une mention claire du niveau de preuve scientifique de l'approche (l'homéopathie notamment, déremboursée en France depuis 2021 sur la base de l'avis HAS).

Conformité réglementaire

RGPD : consentement explicite, granulaire, révocable. Politique de confidentialité claire. Droit à l'effacement implémenté.
HDS : hébergement obligatoire chez un prestataire certifié Hébergeur de Données de Santé (OVH HDS, Scaleway, Outscale, ou clouds publics avec offre HDS). À paramétrer dès le déploiement, pas après.
AIPD : Analyse d'Impact sur la Protection des Données à réaliser avant la mise en production.
DPO : un Délégué à la Protection des Données doit être désigné (peut être externe, mutualisé).
Mentions légales : disclaimer médical obligatoire à l'inscription, accepté explicitement par l'utilisateur.
CGU : doivent inclure clause de non-responsabilité médicale et clarification "outil d'information, pas dispositif médical".
AI Act EU : positionnement comme système IA à risque limité (transparence : l'utilisateur sait qu'il parle à une IA). Éviter à tout prix d'être qualifié de "système IA à haut risque" en se gardant du diagnostic, du triage et de la recommandation de traitement formels.

Chiffrement et sécurité

Chiffrement au repos (AES-256) pour toutes les données de santé
Chiffrement en transit (TLS 1.3)
Authentification multi-facteurs proposée
Audit logs de tous les accès aux données de santé (exigence HDS)
Pas de stockage de mots de passe en clair (bcrypt minimum, argon2id recommandé)
Aucune donnée de santé ne doit transiter dans des URLs (paramètres GET interdits pour des infos sensibles)

🌍 Internationalisation

Langue de lancement : français (FR-FR)
Langues prévues v2 : anglais (EN-US, EN-GB), espagnol (ES-ES, ES-MX)
Paramètre "Pays" indépendant de la langue : influence :

Noms commerciaux des médicaments (Doliprane vs Tylenol vs Acetaminophen)
Calendrier vaccinal (différent FR/US/UK/Allemagne)
Numéros d'urgence (15/18/112 pour FR, 911 pour US, 999 pour UK, 112 partout en UE)
Système de santé local mentionné (Sécu, NHS, Medicare)
Recommandations de check-ups (âges et fréquences varient par pays)


Tous les textes UI doivent être externalisés dans des fichiers de traduction (i18n)

🧠 Stack IA
Modèle LLM principal

Mistral Large (via API Mistral, hébergement européen) pour le chat médical principal
Mistral Small pour les tâches simples (formatage, classification d'intention, détection d'urgence)
Fallback possible : Claude Sonnet 4.6 via API Anthropic pour les cas complexes (à activer plus tard, vérifier conformité RGPD via Bedrock UE ou option européenne)

Architecture IA

RAG obligatoire : ne JAMAIS utiliser le LLM seul pour des réponses médicales. Construire une base vectorielle (Qdrant ou pgvector) contenant :

Recommandations HAS (France) — disponibles en open data sur has-sante.fr
Base Vidal ou équivalent open : le Vidal professionnel n'est pas librement accessible (abonnement payant), mais des alternatives open existent — BCB (Base de données Codage des médicaments, partiellement ouverte), Thériaque (CNHIM, accès institutionnel), base publique ANSM, base Médicaments de l'ANSM (open data data.ansm.sante.fr). Évaluer coût d'un accès Vidal API vs alternatives open source.
Recommandations OMS — open access
Calendrier vaccinal français (DGS) — open data
Pour les médecines alternatives : sources reconnues de chaque tradition, présentées comme telles (pas comme preuve scientifique)
Sources potentiellement à scanner/intégrer (contenu non disponible librement en ligne) :
  - Livres de référence pharmacopée chinoise (ex. Materia Medica de Bensky)
  - Charaka Samhita / Sushruta Samhita (ayurvéda) — certaines traductions en domaine public
  - Pharmacopée française (ANSM) — partiellement accessible
  - Monographies de plantes (ESCOP, Commission E allemande) — payantes, à acheter et scanner
  - Formulaire National — disponible sur le site de l'ANSM


Le LLM doit s'appuyer sur les documents retournés par le RAG et ne pas inventer de posologies ou de protocoles.
Citation obligatoire des sources dans les réponses.

Prompts système

Le system prompt principal doit inclure :

Le profil patient (anonymisé en interne via un ID, jamais le nom complet dans le prompt)
Le pays et la langue
Le rappel des garde-fous (pas de diagnostic, pas de prescription, renvoi vers pro)
Les instructions spécifiques selon l'onglet médecine sélectionné
La détection d'urgence en première priorité absolue


Un système de modération doit être appliqué avant et après chaque appel LLM (filtrer les sorties qui contiendraient des prescriptions explicites, des diagnostics affirmatifs, etc.).

🏗️ Stack technique

Base : OpenSaaS (https://opensaas.sh/) — Wasp + React + Node.js + PostgreSQL
Hébergement : OVH Public Cloud HDS, Scaleway Healthcare, ou Outscale (FR/UE certifié HDS)
Base vectorielle : pgvector (intégré à PostgreSQL pour simplifier) ou Qdrant Cloud EU
Paiements : Stripe (avec compte EU, données de paiement séparées des données de santé)
Emails transactionnels : SendGrid EU ou Brevo (FR)
Authentification : intégrée OpenSaaS, étendue avec MFA (TOTP)
Monitoring : Sentry (avec scrubbing strict des données PII), logs anonymisés

📐 Conventions de code

TypeScript strict partout (front et back)
Composants React fonctionnels, hooks, pas de class components
Tests unitaires pour toute logique critique (détection d'urgence, calculs de doses, etc.)
Tests d'intégration pour les flux RAG et appels LLM (mockés)
Pas de logs contenant des données de santé en production
Toute requête vers le LLM doit être loggée (sans le contenu PII) pour audit, avec timestamp, modèle utilisé, latence, coût
Code commenté en français (cohérence avec le marché cible) ou en anglais (cohérence internationale) — choisir une convention et s'y tenir

🚀 Roadmap MVP
Phase 1 — Fondations (sprint 1-2)

Setup OpenSaaS, déploiement HDS
Auth + onboarding utilisateur (profil de base, pays, langue)
Page de mentions légales et CGU médicales

Phase 2 — Chat médical core (sprint 3-4)

Intégration Mistral API
Système RAG avec base initiale (HAS, OMS, calendrier vaccinal FR)
Détection d'urgence (priorité #1)
Chat avec un seul onglet : médecine moderne

Phase 3 — Multi-médecines (sprint 5-6)

Ajout des 5 autres onglets (chinoise, ayurvédique, homéo, naturo, nutrition)
Disclaimers spécifiques par onglet
Sources documentaires pour chaque médecine

Phase 4 — Rappels et profil avancé (sprint 7-8)

Antécédents, vaccins, traitements en cours
Système de rappels (médicaments, vaccins, check-ups)
Notifications email + push (PWA)

Phase 5 — Freemium (sprint 9)

Intégration Stripe
Gating des fonctionnalités premium
Tableau de bord utilisateur

Phase 6 — Conformité finale et lancement (sprint 10)

AIPD finalisée
Audit sécurité externe
Test bêta privé (~50 utilisateurs)
Lancement public

⚠️ Décisions à confirmer avec un avocat spécialisé santé numérique AVANT le lancement

Le positionnement "outil d'information" tient-il juridiquement avec les fonctionnalités prévues (notamment la "recommandation à valider par un médecin") ?
Faut-il une déclaration auprès de l'ANSM ?
La présentation côte à côte de la médecine moderne et de l'homéopathie pose-t-elle un risque de désinformation médicale poursuivable ?
Quel est le statut HDS exact requis (un hébergeur certifié suffit-il ou faut-il une certification supplémentaire pour l'éditeur) ?
Quelles formulations exactes peuvent être utilisées dans le chat pour les "recommandations médicamenteuses à valider" sans tomber dans l'exercice illégal de la médecine ?

Aucun déploiement en production avant validation juridique de ces points.