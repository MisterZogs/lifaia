// Documents médicaux de référence pour le RAG Lifaia.
// Sources : calendrier vaccinal Ministère de la Santé FR 2025, HAS, OMS, ANSM, SAMU.

export type ChunkDocument = {
  source: string
  titre: string
  contenu: string
}

export const DOCUMENTS_MEDICAUX: ChunkDocument[] = [
  // ─── Calendrier vaccinal français ─────────────────────────────────────────
  {
    source: 'calendrier_vaccinal_fr_2025',
    titre: 'Calendrier vaccinal FR — Nourrisson (0-18 mois)',
    contenu: `Vaccinations obligatoires et recommandées pour les nourrissons en France (2025) :

À 2 mois : DTPolio (diphtérie, tétanos, polio) + Coqueluche + Hib + Hépatite B + Pneumocoque (Prevenar 20) — 1re dose.
À 4 mois : DTPolio + Coqueluche + Hib + Hépatite B + Méningocoque B (Bexsero) — 2e dose.
À 5 mois : Méningocoque C — 1re dose.
À 11 mois : DTPolio + Coqueluche + Hib + Hépatite B + Pneumocoque — rappel.
À 12 mois : ROR (rougeole-oreillons-rubéole) — 1re dose + Méningocoque C rappel + Méningocoque B rappel.
À 16-18 mois : ROR — 2e dose + DTPolio + Coqueluche rappel.

Depuis 2018 : 11 vaccins obligatoires pour les enfants nés après le 1er janvier 2018 (DTPolio, coqueluche, hépatite B, hib, pneumocoque, méningocoque C, ROR).`,
  },
  {
    source: 'calendrier_vaccinal_fr_2025',
    titre: 'Calendrier vaccinal FR — Enfant et adolescent (6-17 ans)',
    contenu: `Vaccinations recommandées pour les enfants et adolescents en France (2025) :

À 6 ans : DTPolio rappel (vaccin tétravalent).
À 11-13 ans : DTPolio + Coqueluche rappel (dTcaPolio). Méningocoque ACYW135. HPV (papillomavirus) : 2 doses espacées de 6 mois pour les filles ET les garçons — recommandé pour prévention cancers col utérin, oropharynx.
À 25 ans : DTPolio + Coqueluche rappel. Méningocoque B si non vacciné.

Rattrapage possible à tout âge pour les vaccins non reçus. Vérifier le carnet de santé.`,
  },
  {
    source: 'calendrier_vaccinal_fr_2025',
    titre: 'Calendrier vaccinal FR — Adulte et rappels',
    contenu: `Vaccinations recommandées pour les adultes en France (2025) :

Rappels DTPolio (diphtérie-tétanos-polio) : à 25 ans, 45 ans, 65 ans, puis tous les 10 ans après 65 ans.
Coqueluche : au moins 1 rappel à l'âge adulte (dTcaPolio), en particulier pour les futurs parents et entourage de nourrissons (stratégie cocooning).
Grippe saisonnière : recommandée chaque automne pour les 65 ans et plus, les femmes enceintes, les personnes avec comorbidités (diabète, cardiopathie, BPCO, immunodépression), les professionnels de santé.
COVID-19 : rappel annuel recommandé pour les 65 ans et plus et les personnes à risque.
Hépatite A et B : si non vacciné et facteurs de risque (voyages, profession, comportements sexuels).
Zona (Shingrix) : recommandé à partir de 65 ans (2 doses).`,
  },
  {
    source: 'calendrier_vaccinal_fr_2025',
    titre: 'Calendrier vaccinal FR — Femme enceinte',
    contenu: `Vaccinations recommandées pendant la grossesse en France (2025) :

Grippe saisonnière : recommandée à tout stade de la grossesse (protège la mère et le nouveau-né).
Coqueluche (dTcaPolio) : recommandée à chaque grossesse entre 20 et 36 semaines d'aménorrhée pour protéger le nourrisson avant sa première vaccination — stratégie de vaccination maternelle.
COVID-19 : recommandée pendant la grossesse.

Vaccins contre-indiqués pendant la grossesse (vaccins vivants) : ROR, varicelle, zona, fièvre jaune (sauf risque épidémique majeur), BCG.

Après l'accouchement : si non immunisée, vacciner contre la rubéole, la varicelle.`,
  },
  {
    source: 'calendrier_vaccinal_fr_2025',
    titre: 'Calendrier vaccinal FR — Personnes âgées 65 ans et plus',
    contenu: `Vaccinations prioritaires pour les personnes âgées de 65 ans et plus en France (2025) :

Grippe saisonnière : 1 injection chaque automne (octobre-novembre). Vaccin quadrivalent haute dose (Fluzone HD) recommandé pour les 65+.
COVID-19 : rappel annuel automnal.
DTPolio : rappel tous les 10 ans après 65 ans.
Pneumocoque (Prevenar 20 ou Pneumovax 23) : 1 injection recommandée après 65 ans, renouvelée selon le schéma.
Zona (Shingrix) : 2 doses à 2 mois d'intervalle, recommandé à partir de 65 ans (ou 50 ans si immunodépression). Prévient les douleurs post-zostériennes.`,
  },

  // ─── Numéros d'urgence ─────────────────────────────────────────────────────
  {
    source: 'urgences_contacts',
    titre: 'Numéros d\'urgence — France',
    contenu: `Numéros d'urgence en France :

15 — SAMU (aide médicale urgente, conseil médical 24h/24)
17 — Police nationale
18 — Pompiers (secours à personne + incendie)
112 — Numéro d'urgence européen (fonctionne dans toute l'UE, depuis mobile même sans carte SIM)
3114 — Numéro national de prévention du suicide (24h/24, 7j/7 — aussi accessible pour les proches)
15 ou 3114 — Crise psychiatrique, idées suicidaires

En cas de doute sur la gravité : appeler le 15 (SAMU), qui oriente vers les secours appropriés ou envoie une équipe médicale.

Empoisonnement/intoxication : Centre antipoison (via le 15).`,
  },
  {
    source: 'urgences_contacts',
    titre: 'Numéros d\'urgence — Belgique, Suisse, USA, UK',
    contenu: `Numéros d'urgence internationaux :

Belgique : 112 (urgences générales), 100 (ambulance/pompiers), 101 (police), 0800 32 123 (suicide prevention).
Suisse : 144 (ambulance), 117 (police), 118 (pompiers), 143 (La Main Tendue — détresse psychologique).
États-Unis / Canada : 911 (police, pompiers, ambulance), 988 (Suicide & Crisis Lifeline).
Royaume-Uni : 999 (urgences), 111 (NHS — conseil médical non urgent).
Union Européenne : 112 fonctionne dans tous les pays membres.

En voyage à l'étranger : conserver ces numéros et ceux de l'ambassade française.`,
  },

  // ─── Signes d'alarme et urgences vitales ──────────────────────────────────
  {
    source: 'urgences_vitales',
    titre: 'AVC — Signes FAST et conduite à tenir',
    contenu: `Accident Vasculaire Cérébral (AVC) — signes d'alerte et conduite à tenir :

Méthode FAST (ou VITE en français) :
- Face (Visage) : asymétrie faciale, bouche déviée, difficulté à sourire
- Arms (Bras) : faiblesse ou engourdissement d'un bras, impossibilité de lever les deux bras
- Speech (Parole) : troubles de l'élocution, mots incompréhensibles, difficulté à parler ou à comprendre
- Time (Temps) : appeler le 15 IMMÉDIATEMENT

Autres signes : perte de vision soudaine d'un œil, maux de tête brutaux et intenses ("coup de tonnerre"), troubles de l'équilibre.

Conduite à tenir : NE PAS attendre, appeler le 15. Ne pas donner à manger ni à boire. Note l'heure de début des symptômes (crucial pour le traitement thrombolytique dans les 4h30). L'AVC est une urgence absolue — chaque minute compte.`,
  },
  {
    source: 'urgences_vitales',
    titre: 'Infarctus du myocarde — Signes et conduite à tenir',
    contenu: `Infarctus du myocarde (crise cardiaque) — signes d'alerte et conduite à tenir :

Signes typiques : douleur thoracique intense, prolongée (> 15-20 min), en étau ou écrasement, pouvant irradier vers le bras gauche, la mâchoire, l'épaule, le dos. Associée à sueurs, nausées, essoufflement.

Signes atypiques (fréquents chez la femme, diabétique, personne âgée) : douleur épigastrique, fatigue intense soudaine, essoufflement isolé, nausées/vomissements.

Conduite à tenir : Appeler le 15 IMMÉDIATEMENT. S'asseoir ou s'allonger. Ne pas conduire seul. Si disponible et pas d'allergie : aspirine 250-500mg à croquer (sur indication du 15). Ne pas manger ni boire en attendant les secours.

Facteurs de risque : tabac, HTA, diabète, hypercholestérolémie, obésité, sédentarité, antécédents familiaux.`,
  },
  {
    source: 'urgences_vitales',
    titre: 'Crise d\'asthme aiguë — Conduite à tenir',
    contenu: `Crise d'asthme aiguë — signes de gravité et conduite à tenir :

Crise légère à modérée : gêne respiratoire, sifflements, toux, DEP > 50% de la valeur théorique. Utiliser le bronchodilatateur de secours (Ventoline/salbutamol) : 2-4 bouffées, à répéter après 20 min si nécessaire.

Signes de crise grave (appeler le 15) : DEP < 50%, impossibilité de terminer une phrase, fréquence respiratoire > 30/min, fréquence cardiaque > 120/min, utilisation des muscles respiratoires accessoires, cyanose, confusion, somnolence.

Conduite à tenir en attendant les secours : position assise penchée en avant, continuer les bronchodilatateurs toutes les 20 min, ne pas laisser le patient seul.

Position à éviter : allonger le patient (aggrave la détresse respiratoire).`,
  },
  {
    source: 'urgences_vitales',
    titre: 'Réaction anaphylactique — Signes et conduite à tenir',
    contenu: `Réaction anaphylactique (allergie grave) — signes et conduite à tenir :

Signes : urticaire généralisée, œdème du visage (lèvres, gorge, paupières), difficulté à avaler, enrouement, difficultés respiratoires, chute de tension, perte de connaissance. Peut survenir en quelques minutes après contact avec un allergène (aliment, médicament, piqûre d'insecte).

Conduite à tenir URGENTE : Appeler le 15. Injecter l'adrénaline auto-injectable (Anapen, Jext, EpiPen) si prescrit : cuisse externe, maintenir 10 secondes. Allonger le patient avec jambes surélevées (sauf difficultés respiratoires). Seconde injection d'adrénaline possible après 5-15 min si pas d'amélioration.

L'anaphylaxie est une urgence vitale absolue — même si amélioration après adrénaline, transport hospitalier obligatoire.`,
  },
  {
    source: 'urgences_vitales',
    titre: 'Détresse respiratoire aiguë — Signes et conduite à tenir',
    contenu: `Détresse respiratoire aiguë — signes d'alerte et conduite à tenir :

Signes de gravité nécessitant le 15 : fréquence respiratoire > 30/min ou < 8/min, cyanose des lèvres ou des doigts, tirage (contraction des muscles du cou et intercostaux), balancement thoraco-abdominal, impossibilité de parler, altération de la conscience, SpO2 < 90%.

Causes fréquentes : décompensation d'asthme ou BPCO, œdème pulmonaire (insuffisance cardiaque), pneumonie sévère, embolie pulmonaire, corps étranger.

Conduite à tenir : Appeler le 15. Asseoir le patient en position semi-assise (45°) ou en tripode (penché en avant). Ne pas allonger. O2 si disponible. Ne pas laisser le patient seul.`,
  },

  // ─── Recommandations HAS ──────────────────────────────────────────────────
  {
    source: 'has_recommandations',
    titre: 'HAS — Hypertension artérielle : définition et prise en charge',
    contenu: `Hypertension artérielle (HTA) — recommandations HAS :

Définition : pression artérielle ≥ 140/90 mmHg en consultation médicale, confirmée sur 2-3 mesures à 3 consultations sur 3-6 mois. En automesure tensionnelle (AMT) : seuil ≥ 135/85 mmHg.

Objectifs tensionnels (HAS 2023) : cible < 130/80 mmHg pour la plupart des patients (< 140/80 avant). Patients âgés (> 80 ans) : cible 130-139/70-79 mmHg.

Bilan initial : ECG, bilan sanguin (créatinine, ionogramme, glycémie, cholestérol), protéinurie, fond d'œil si diabète.

Mesures hygiéno-diététiques : réduction sel (< 5g/jour), activité physique régulière (30 min/jour), sevrage tabagique, perte de poids si surpoids, limitation alcool.

Médicaments de 1re ligne : inhibiteurs ECA (perindopril, ramipril) ou ARA2, inhibiteurs calciques, diurétiques thiazidiques. Bêtabloquants : 2e ligne sauf cardiopathie associée.`,
  },
  {
    source: 'has_recommandations',
    titre: 'HAS — Diabète de type 2 : surveillance et objectifs',
    contenu: `Diabète de type 2 — recommandations HAS :

Diagnostic : glycémie à jeun ≥ 1,26 g/L (7 mmol/L) à 2 reprises, ou glycémie ≥ 2 g/L à n'importe quel moment.

Objectif HbA1c (hémoglobine glyquée) : individualisé. Cible ≤ 7% pour la plupart des patients. Moins strict (≤ 8%) pour les patients âgés fragiles, espérance de vie limitée.

Surveillance recommandée : HbA1c tous les 3-6 mois, bilan rénal annuel (créatinine + microalbuminurie), bilan lipidique annuel, fond d'œil annuel, bilan cardiovasculaire.

Traitements : Metformine en 1re ligne (si tolérée). Ajout d'un inhibiteur SGLT2 (empagliflozine, dapagliflozine) ou d'un agoniste GLP-1 (sémaglutide, liraglutide) si maladie cardiovasculaire ou rénale associée.

Complications à surveiller : néphropathie, rétinopathie, neuropathie (douleurs, pied diabétique), artériopathie.`,
  },
  {
    source: 'has_recommandations',
    titre: 'HAS — Lombalgie commune : recommandations',
    contenu: `Lombalgie commune (mal de dos) — recommandations HAS :

Lombalgie aiguë (< 4 semaines) : bénigne dans 90% des cas, guérison spontanée en 4-6 semaines. Maintenir l'activité physique habituelle autant que possible — le repos strict est déconseillé. Antalgiques de 1er palier (paracétamol, AINS) pour la douleur. Kinésithérapie non indiquée en phase aiguë sauf douleur invalidante.

Signes d'alarme nécessitant un avis médical urgent : douleur nocturne intense ne cédant pas au repos, fièvre, perte de poids inexpliquée, antécédents de cancer, douleur suite à traumatisme, déficit neurologique (troubles sphinctériens).

Lombalgie chronique (> 3 mois) : approche multimodale — reconditionnement physique, kinésithérapie, psychothérapie cognitive et comportementale. Éviter les opioïdes forts au long cours.

Imagerie (radio/IRM) : non indiquée en l'absence de signes d'alarme pour la lombalgie commune.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Dépistages recommandés en France selon l\'âge et le sexe',
    contenu: `Dépistages organisés et recommandés en France :

Cancer du sein (femmes 50-74 ans) : mammographie tous les 2 ans dans le cadre du dépistage organisé. À partir de 40 ans si risque familial — en parler au médecin traitant.

Cancer colorectal (hommes et femmes 50-74 ans) : test immunologique de recherche de sang dans les selles (test FIT/OC-Sensor) tous les 2 ans. Coloscopie si test positif.

Cancer du col de l'utérus : frottis cervico-vaginal (FCU) tous les 3 ans de 25 à 65 ans (après 2 frottis normaux à 1 an d'intervalle à 25 et 26 ans). Test HPV préféré après 30 ans.

Cancer de la prostate : pas de dépistage organisé en France. Discuter le dosage PSA avec son médecin à partir de 50 ans (45 ans si risque élevé).

Cholestérol : dosage recommandé à partir de 40-50 ans ou en cas de facteurs de risque cardiovasculaire.`,
  },

  // ─── Médicaments courants ─────────────────────────────────────────────────
  {
    source: 'medicaments_courants_fr',
    titre: 'Paracétamol (Doliprane, Efferalgan, Dafalgan) — posologie et précautions',
    contenu: `Paracétamol — informations générales :

Indications : antalgique (douleur légère à modérée) et antipyrétique (fièvre). Médicament de 1re intention pour la douleur en France.

Posologie adulte : 500 mg à 1 g par prise, toutes les 4 à 6 heures. Dose maximale : 4 g/24h (3 g/24h en cas d'insuffisance hépatique, alcoolisme chronique, dénutrition, poids < 50 kg).

Posologie enfant : 15 mg/kg par prise, toutes les 6 heures (max 60 mg/kg/24h, sans dépasser 4 g/24h).

Précautions importantes : Ne pas dépasser la dose maximale (risque hépatotoxique). Attention aux associations — nombreux médicaments contiennent du paracétamol (rhume, grippe, antalgiques combinés). Contre-indiqué en cas d'insuffisance hépatique sévère. Interactions : anticoagulants AVK (surveillance INR).

En France : Doliprane, Efferalgan, Dafalgan sont des noms de marque du paracétamol.`,
  },
  {
    source: 'medicaments_courants_fr',
    titre: 'Ibuprofène (Advil, Nurofen, Brufen) — posologie et contre-indications',
    contenu: `Ibuprofène — AINS (anti-inflammatoire non stéroïdien) :

Indications : douleur, fièvre, inflammation (arthrite, entorse, dysménorrhée). Plus efficace que le paracétamol pour les douleurs inflammatoires.

Posologie adulte : 200-400 mg par prise, toutes les 6-8 heures. Dose maximale : 1200 mg/24h en automédication, 2400 mg/24h sur prescription.

Posologie enfant (> 3 mois, > 5 kg) : 7,5-10 mg/kg par prise, 3 fois/jour.

Contre-indications formelles : grossesse (3e trimestre), insuffisance rénale sévère, insuffisance hépatique sévère, ulcère gastroduodénal évolutif, antécédents d'allergie aux AINS, varicelle chez l'enfant (risque de fasciite nécrosante).

Précautions : à prendre avec un repas (protection gastrique). Association avec IPP (oméprazole) si traitement prolongé. Ne pas associer avec aspirine, anticoagulants, corticoïdes sans avis médical.`,
  },
  {
    source: 'medicaments_courants_fr',
    titre: 'Interactions médicamenteuses courantes à connaître',
    contenu: `Interactions médicamenteuses courantes à surveiller :

AINS (ibuprofène, aspirine, diclofénac) + anticoagulants (AVK, héparine, rivaroxaban) : risque hémorragique majeur. À éviter.

AINS + antihypertenseurs (IEC, ARA2, diurétiques) : risque insuffisance rénale et perte d'efficacité antihypertensive. Surveillance.

Millepertuis (phytothérapie) : inducteur enzymatique puissant — diminue l'efficacité des contraceptifs oraux, anticoagulants, antirétroviraux, ciclosporine, digoxine.

Paracétamol + AVK (warfarine, acénocoumarol) : peut augmenter l'effet anticoagulant à doses élevées. Surveillance INR.

Antifongiques azolés (fluconazole, itraconazole) + statines (simvastatine) : risque de myopathie/rhabdomyolyse. Contre-indiqué.

Pamplemousse : inhibe le CYP3A4 — augmente les taux de nombreux médicaments (statines, inhibiteurs calciques, certains immunosuppresseurs).`,
  },

  // ─── Fièvre ───────────────────────────────────────────────────────────────
  {
    source: 'has_recommandations',
    titre: 'Fièvre chez l\'adulte — quand consulter',
    contenu: `Fièvre chez l'adulte — conduite à tenir :

Définition : température corporelle ≥ 38°C (rectale) ou ≥ 37,8°C (buccale ou axillaire + 0,5°C).

Fièvre isolée < 3 jours chez adulte jeune en bonne santé : souvent virale, surveillance possible à domicile. Traitement symptomatique : paracétamol 1 g toutes les 6h, hydratation++.

Consulter un médecin si :
- Fièvre ≥ 39,5°C ou mal tolérée
- Fièvre persistant > 3 jours
- Frissons intenses, sueurs profuses, altération de l'état général
- Signes localisés : angine, toux, douleur thoracique, brûlures urinaires
- Retour de voyage tropical récent (< 2 mois) — éliminer paludisme en urgence
- Personnes immunodéprimées, traitement par corticoïdes ou chimiothérapie

Appeler le 15 si : température > 40°C avec signes de gravité (confusion, rash pétéchial, difficultés respiratoires, choc).`,
  },
  {
    source: 'has_recommandations',
    titre: 'Fièvre chez l\'enfant — quand consulter (recommandations HAS)',
    contenu: `Fièvre chez l'enfant — recommandations HAS :

Définition : température ≥ 38°C par voie rectale.

Appeler le 15 ou aller aux urgences immédiatement si :
- Nourrisson < 3 mois avec fièvre (urgence absolue)
- Enfant 3-6 mois avec fièvre ≥ 38°C
- Fièvre avec raideur de la nuque, rash purpurique (taches qui ne s'effacent pas à la pression) — signes de méningite
- Convulsions fébriles : appeler le 15
- Fièvre avec signes de détresse respiratoire, teint gris, somnolence excessive, refus de boire

Consulter dans la journée si : fièvre ≥ 38°C chez enfant de 3-6 mois, fièvre persistant > 3 jours chez l'enfant plus grand, enfant immunodéprimé.

Traitement antipyrétique : paracétamol 15 mg/kg/prise toutes les 6h (max 60 mg/kg/24h). Ibuprofène possible à partir de 3 mois/5 kg. Ne pas alterner systématiquement paracétamol et ibuprofène — pas de bénéfice démontré.

Éviter l'aspirine chez l'enfant (risque syndrome de Reye).`,
  },

  // ─── IMC ───────────────────────────────────────────────────────────────────
  {
    source: 'oms_recommandations',
    titre: 'IMC — Interprétation selon les normes OMS',
    contenu: `Indice de Masse Corporelle (IMC) — classification OMS :

Formule : IMC = poids (kg) / taille² (m²). Exemple : 70 kg / (1,75)² = 22,9 kg/m².

Classification OMS adultes :
- IMC < 16 : maigreur sévère
- 16 ≤ IMC < 17 : maigreur modérée
- 17 ≤ IMC < 18,5 : maigreur légère
- 18,5 ≤ IMC < 25 : corpulence normale (poids santé)
- 25 ≤ IMC < 30 : surpoids
- 30 ≤ IMC < 35 : obésité modérée (classe I)
- 35 ≤ IMC < 40 : obésité sévère (classe II)
- IMC ≥ 40 : obésité massive (classe III, morbide)

Limites de l'IMC : ne distingue pas masse musculaire de masse grasse. Peut sous-estimer le risque chez les personnes âgées (sarcopénie). Tour de taille complémentaire : risque cardiovasculaire augmenté si > 80 cm chez la femme, > 94 cm chez l'homme.

Chez l'enfant : l'IMC s'évalue par rapport aux courbes de croissance de référence (centiles).`,
  },

  // ─── Pathologies courantes ────────────────────────────────────────────────
  {
    source: 'has_recommandations',
    titre: 'Angine — diagnostic et traitement',
    contenu: `Angine (pharyngite) — recommandations HAS :

Angine virale (80% des cas) : causée par des virus (rhinovirus, adénovirus, EBV). Douleur gorge, fièvre modérée, écoulement nasal possible. Traitement : antalgiques/antipyrétiques, repos, hydratation. Pas d'antibiotiques.

Angine bactérienne (streptocoque A, 20% des cas) : début brutal, forte fièvre, gorge très rouge avec enduit blanc/jaune, ganglions cervicaux douloureux, sans rhinite ni toux. Test de Diagnostic Rapide (TDR) recommandé avant tout antibiotique.

Traitement si TDR positif : amoxicilline 2g/jour en 2 prises pendant 6 jours (adulte). Enfant : 50 mg/kg/jour en 2 prises. Allergie pénicilline : azithromycine 3 jours.

Consulter en urgence si : dysphagie sévère (impossibilité d'avaler), écoulement salivaire, voix de "patate chaude", trismus — suspicion de phlegmon péri-amygdalien.

Complications non traitées : rhumatisme articulaire aigu (RAA), glomérulonéphrite post-streptococcique.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Rhinopharyngite et rhume — conduite à tenir',
    contenu: `Rhinopharyngite aiguë (rhume) — informations médicales :

Définition : infection virale des voies aériennes supérieures (rhinovirus dans 50% des cas). Très fréquente, bénigne et auto-limitée en 7-10 jours.

Symptômes : congestion nasale, rhinorrhée (aqueuse puis purulente sans signifier une surinfection bactérienne), éternuements, pharyngite légère, fièvre modérée possible.

Traitement symptomatique uniquement : sérum physiologique (lavage nasal 6-8x/jour), paracétamol si fièvre ou douleur, hydratation, repos. Les décongestionnants oraux ne sont pas recommandés (effets cardiovasculaires). Les antibiotiques ne sont JAMAIS indiqués.

Consulter si : fièvre > 39°C persistant > 3 jours, douleur faciale intense (sinusite), otalgie (otite), dyspnée, état général très altéré.

Prévention : lavage des mains fréquent (principal vecteur de transmission), mouchoirs à usage unique.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Grippe saisonnière — symptômes, traitement et prévention',
    contenu: `Grippe saisonnière — informations médicales :

Symptômes typiques : début brutal, fièvre élevée (39-40°C), frissons, céphalées, myalgies intenses, asthénie profonde, toux sèche. Contrairement au rhume : peu ou pas de rhinorrhée au début, état général très altéré.

Durée : fièvre 3-5 jours, toux et fatigue peuvent persister 2-3 semaines.

Traitement : repos impératif, paracétamol pour fièvre et douleurs, hydratation ++. Antiviraux (oseltamivir/Tamiflu) : efficaces si débutés dans les 48h, réservés aux personnes à risque (65+, immunodéprimés, comorbidités, femmes enceintes).

Complications : pneumonie grippale ou surinfection bactérienne, décompensation de maladies chroniques, myocardite. Mortalité surtout chez 65+ et immunodéprimés.

Consulter en urgence si : dyspnée, douleur thoracique, confusion, signes de déshydratation sévère, rash pétéchial.

Prévention : vaccination annuelle (recommandée 65+, comorbidités, professionnels de santé, femmes enceintes, entourage nourrissons).`,
  },
  {
    source: 'has_recommandations',
    titre: 'Infection urinaire — cystite et pyélonéphrite',
    contenu: `Infections urinaires — recommandations HAS :

Cystite aiguë simple (femme, sans facteur de risque) : brûlures mictionnelles, pollakiurie, impériosité, urines troubles/malodorantes, sans fièvre ni douleur lombaire. Traitement : antibiotique monodose (fosfomycine 3g) ou 3 jours (pivmecillinam). Pas d'ECBU nécessaire en 1re intention.

Cystite compliquée (homme, femme enceinte, diabétique, immunodéprimé, anomalie urologique) : ECBU obligatoire avant traitement.

Pyélonéphrite aiguë : fièvre > 38,5°C, frissons, douleurs lombaires unilatérales, signe de Giordano positif, nausées/vomissements ± signes urinaires. ECBU obligatoire. Traitement : fluoroquinolone ou céphalosporine 3e génération, 7 jours. Hospitalisation si forme sévère.

Consulter en urgence si : fièvre élevée avec frissons + douleurs lombaires (suspicion pyélonéphrite), rétention urinaire, état général altéré.

Prévention cystite : hydratation abondante, miction post-coïtale, canneberge (efficacité modeste mais sans risque).`,
  },
  {
    source: 'has_recommandations',
    titre: 'Gastro-entérite aiguë — conduite à tenir',
    contenu: `Gastro-entérite aiguë (GEA) — informations médicales :

Cause : virale dans 80% des cas (norovirus, rotavirus). Bactérienne (Salmonella, Campylobacter) possible après repas à risque ou voyage.

Symptômes : diarrhée aqueuse, nausées, vomissements, crampes abdominales, fièvre modérée. Durée habituelle : 2-5 jours.

Traitement : réhydratation orale ++ (solution de réhydratation orale type Hydralin/Picolite, eau + sucre + sel). Alimentation progressive (riz, carottes, banane, pain grillé). Lopéramide (Imodium) possible chez l'adulte pour ralentir le transit (contre-indiqué si fièvre ou sang dans les selles). Pas d'antibiotiques en 1re intention.

Signes de déshydratation à surveiller : soif intense, bouche sèche, yeux cernés, oligurie, pli cutané persistant. Chez le nourrisson : fontanelle déprimée, pleurs sans larmes, teint gris.

Consulter en urgence si : nourrisson < 3 mois, déshydratation sévère, sang dans les selles (plus de quelques traces), fièvre > 39°C, diarrhée > 7 jours, retour de voyage tropical.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Otite moyenne aiguë — diagnostic et traitement',
    contenu: `Otite moyenne aiguë (OMA) — recommandations HAS :

Définition : inflammation aiguë de l'oreille moyenne. Très fréquente chez l'enfant (pic 6-18 mois).

Symptômes : otalgie (douleur d'oreille), fièvre, irritabilité chez le nourrisson, parfois otorrhée purulente (perforation spontanée = soulagement douloureux). Diagnostic par otoscopie.

Traitement antibiotique : recommandé si < 2 ans, otorrhée, otalgie intense, fièvre élevée ou OMA confirmée. Amoxicilline 80-90 mg/kg/jour en 2-3 prises pendant 5 jours (10 jours si < 2 ans). Allergie : cefpodoxime ou azithromycine.

Abstention thérapeutique possible (surveillance 48-72h) chez les enfants > 2 ans avec symptômes modérés — une guérison spontanée est possible.

Traitement symptomatique : antalgiques/antipyrétiques (paracétamol), sérum physiologique nasal.

Complications (rares) : mastoïdite, méningite, paralysie faciale — nécessitent une prise en charge urgente.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Sinusite aiguë — diagnostic et traitement',
    contenu: `Sinusite aiguë maxillaire — recommandations HAS :

Définition : inflammation des sinus paranasaux, le plus souvent compliquant une rhinopharyngite virale.

Sinusite virale (très fréquente) : symptômes de rhume avec douleur faciale modérée, sécrétions nasales. Guérison spontanée en 10-14 jours. Pas d'antibiotiques.

Sinusite bactérienne (suspicion si) : douleur unilatérale pulsatile au niveau joue/front, aggravée par l'antéflexion et la percussion sinusienne, fièvre > 38°C, rhinorrhée purulente unilatérale, persistance > 10 jours sans amélioration ou aggravation après amélioration initiale.

Traitement : amoxicilline-acide clavulanique (Augmentin) 2g/jour pendant 7 jours. Antibiothérapie réservée aux formes bactériennes certaines ou sévères.

Traitement symptomatique : antalgiques, lavages nasaux au sérum physiologique, décongestionants nasaux locaux (max 5 jours).

Consulter en urgence si : fièvre élevée, œdème palpébral, diplopie, céphalées sévères, raideur nuque — signes de complications orbitaires ou méningées.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Conjonctivite — types et traitement',
    contenu: `Conjonctivite — informations médicales :

Conjonctivite virale (la plus fréquente) : rougeur oculaire bilatérale, larmoiement clair, sensation de corps étranger, souvent associée à une rhinopharyngite. Très contagieuse (adénovirus). Traitement : collyres lavants (sérum physiologique), pas d'antibiotiques. Guérison spontanée en 7-14 jours.

Conjonctivite bactérienne : sécrétions purulentes jaunes/vertes, paupières collées au réveil, souvent unilatérale au début puis bilatérale. Traitement : collyre antibiotique (tobramycine, acide fusidique) pendant 5-7 jours.

Conjonctivite allergique : bilatérale, prurit intense, larmoiement clair, associée à rhinite allergique saisonnière. Traitement : antihistaminiques oraux ou collyres anti-allergiques, éviction de l'allergène.

Consulter en urgence si : baisse visuelle, douleur oculaire intense, photophobie, rougeur péri-cornéenne, pupille irrégulière — suspicion glaucome ou uvéite.

Hygiène : lavage des mains fréquent, ne pas partager linges/serviettes, ne pas se frotter les yeux.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Lombalgie aiguë et sciatique — diagnostic et traitement',
    contenu: `Lombalgie et sciatique — recommandations HAS :

Lombalgie commune aiguë : douleur lombaire basse sans irradiation, d'apparition souvent brutale (effort, mauvaise position). Traitement : maintien de l'activité physique (repos strict déconseillé), AINS (ibuprofène 400mg x3/jour avec repas) ou paracétamol, myorelaxants si contracture importante.

Sciatique (hernie discale) : douleur lombaire irradiant le long du trajet du nerf sciatique (fesse, face postérieure cuisse, mollet, pied). Traitement médical en 1re intention : antalgiques, AINS, corticoïdes oraux courts (Médrol) si douleur intense.

Signes d'alarme nécessitant IRM urgente : syndrome de la queue de cheval (troubles sphinctériens, selle périnéale), déficit moteur sévère, douleur nocturne intense, fièvre, perte de poids.

Imagerie (radio, IRM) : non indiquée en routine dans les 6 premières semaines sans signe d'alarme.

Chirurgie discale : envisagée si échec traitement médical > 6 semaines, déficit neurologique, retentissement fonctionnel majeur.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Migraine — diagnostic et traitement',
    contenu: `Migraine — recommandations HAS/SFEMC :

Critères diagnostiques (IHS) : au moins 5 crises avec céphalées durant 4-72h, caractère unilatéral et/ou pulsatile, intensité modérée à sévère, aggravée par activité physique, associée à nausées/vomissements et/ou photo-phonophobie.

Migraine avec aura : précédée de symptômes neurologiques fugaces (scotome scintillant, phosphènes, trouble de la vision, paresthésies d'un membre). Durée aura : 20-60 min.

Traitement de la crise : triptans (sumatriptan, almotriptan) = traitement de référence pour crises modérées/sévères. AINS (ibuprofène, naproxène) pour crises légères. Métoclopramide (Primpéran) contre les nausées. Prendre le traitement dès le début de la crise.

Traitement de fond (> 3 crises invalidantes/mois) : propranolol, amitriptyline, valproate, topiramate, ou anticorps anti-CGRP (nouveaux traitements).

Consulter en urgence si : "céphalée en coup de tonnerre" (début brutal, intensité maximale immédiate), fièvre + raideur nuque, déficit neurologique persistant, première crise > 50 ans.`,
  },

  // ─── Santé mentale ────────────────────────────────────────────────────────
  {
    source: 'has_recommandations',
    titre: 'Dépression — symptômes, diagnostic et prise en charge',
    contenu: `Dépression — recommandations HAS :

Définition : épisode dépressif caractérisé si ≥ 5 symptômes parmi : humeur dépressive, perte d'intérêt/plaisir (anhédonie), troubles du sommeil, fatigue, troubles de la concentration, sentiment de dévalorisation/culpabilité, troubles de l'appétit, agitation/ralentissement psychomoteur, idées suicidaires. Durée ≥ 2 semaines. Retentissement fonctionnel.

Sévérité : légère (2-4 symptômes), modérée (5-6), sévère (7+ ou idées suicidaires).

Prise en charge :
- Légère : psychothérapie (TCC) en 1re intention, soutien psychologique, activité physique.
- Modérée à sévère : antidépresseurs (ISRS : escitalopram, sertraline — 1re ligne) + psychothérapie. Délai d'action : 2-4 semaines.
- Sévère avec risque suicidaire : hospitalisation possible.

Antidépresseurs courants : escitalopram, sertraline, venlafaxine. Durée minimum : 6 mois après rémission pour éviter la rechute.

Appeler le 3114 (numéro national prévention suicide) en cas d'idées suicidaires.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Anxiété et troubles anxieux — diagnostic et traitement',
    contenu: `Troubles anxieux — informations médicales :

Trouble anxieux généralisé (TAG) : anxiété excessive et incontrôlable concernant de nombreux domaines (travail, santé, famille), pendant > 6 mois. Associée à fatigue, tension musculaire, troubles du sommeil, irritabilité, difficultés de concentration.

Attaque de panique : accès brutal de peur intense avec symptômes physiques (palpitations, dyspnée, transpiration, tremblements, sensation d'étouffement, douleur thoracique, nausées, vertiges, paresthésies, dépersonnalisation, peur de mourir ou devenir fou). Durée : 10-30 min. Bénigne mais très impressionnante.

Prise en charge : psychothérapie cognitive et comportementale (TCC) = traitement de 1re intention. Médicaments : ISRS/IRSN pour le TAG. Benzodiazépines : usage limité (dépendance) et court terme uniquement.

Techniques de relaxation : respiration abdominale, cohérence cardiaque (5 respirations/min), méditation de pleine conscience, activité physique régulière.

Consulter si : anxiété invalidante au quotidien, attaques de panique répétées, évitement social, dépression associée.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Insomnie — causes et traitement',
    contenu: `Insomnie chronique — recommandations HAS :

Définition : difficultés d'endormissement (> 30 min), réveils nocturnes fréquents, réveil précoce, sommeil non réparateur, avec retentissement diurne (fatigue, somnolence, difficultés de concentration, irritabilité). Fréquence ≥ 3 nuits/semaine pendant ≥ 3 mois.

Causes fréquentes : anxiété, dépression, douleurs chroniques, apnées du sommeil, syndrome des jambes sans repos, mauvaise hygiène de sommeil, médicaments (corticoïdes, bêtabloquants, stimulants).

Traitement 1re ligne : Thérapie cognitive et comportementale de l'insomnie (TCC-I) — plus efficace que les médicaments sur le long terme. Principes : restriction du temps au lit, horaires réguliers, contrôle des stimuli, relaxation.

Hygiène du sommeil : horaires réguliers, chambre fraîche et sombre, pas d'écran 1h avant, éviter caféine après 14h, alcool, exercice intense le soir.

Médicaments : réservés au court terme (< 4 semaines). Mélatonine (Circadin) : efficace pour resynchronisation. Hypnotiques (zolpidem, zopiclone) : efficaces mais risque dépendance. Benzodiazépines : déconseillées au long cours.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Burnout et épuisement professionnel — signes et prise en charge',
    contenu: `Épuisement professionnel (burnout) — informations médicales :

Définition (OMS) : syndrome résultant d'un stress chronique au travail mal géré, caractérisé par 3 dimensions : épuisement émotionnel et physique, cynisme/dépersonnalisation (détachement, déshumanisation), sentiment de perte d'efficacité professionnelle.

Symptômes : fatigue intense persistante malgré le repos, troubles du sommeil, douleurs physiques (maux de tête, dos), difficultés de concentration et de mémoire, irritabilité, anxiété, cynisme, perte de sens, erreurs inhabituelles, pleurs fréquents.

Le burnout n'est pas un diagnostic psychiatrique au sens strict (CIM-10/DSM-5) mais peut évoluer vers une dépression, anxiété généralisée ou troubles post-traumatiques.

Prise en charge : arrêt de travail souvent nécessaire pour récupération. Consultation médecin traitant + psychiatre ou psychologue. Psychothérapie. Réflexion sur les facteurs de risque professionnels. Activité physique, liens sociaux.

Ne pas confondre avec la dépression (possible co-morbidité) — évaluation médicale indispensable.`,
  },

  // ─── Pathologies chroniques ───────────────────────────────────────────────
  {
    source: 'has_recommandations',
    titre: 'Asthme — diagnostic, classification et traitement de fond',
    contenu: `Asthme — recommandations HAS/GINA :

Définition : maladie inflammatoire chronique des voies aériennes, avec obstruction bronchique réversible. Symptômes : sifflements (wheezing), essoufflement, oppression thoracique, toux (surtout nocturne/matinale).

Diagnostic : spirométrie avec VEMS/CV < 0,7 et réversibilité après bronchodilatateur ≥ 12% et 200 ml.

Classification selon contrôle :
- Asthme bien contrôlé : symptômes < 2x/semaine, pas de réveil nocturne, pas de limitation activité.
- Partiellement contrôlé : 1-2 critères ci-dessus.
- Non contrôlé : ≥ 3 critères.

Traitement de fond (paliers GINA) :
- Palier 1-2 : CSI faible dose (béclométasone, fluticasone) ± LABA (formotérol, salmétérol).
- Palier 3-4 : CSI dose moyenne/forte + LABA.
- Palier 5 : biothérapies (omalizumab anti-IgE, mépolizumab anti-IL5) pour asthme sévère.

Traitement de crise : salbutamol (Ventoline) inhalé, 2-4 bouffées. Utilisation > 2x/semaine = asthme non contrôlé.

Facteurs déclenchants : allergènes (acariens, pollens, animaux), effort, AINS, tabac, air froid.`,
  },
  {
    source: 'has_recommandations',
    titre: 'BPCO — bronchopneumopathie chronique obstructive',
    contenu: `BPCO — recommandations HAS/GOLD :

Définition : maladie respiratoire chronique caractérisée par une limitation permanente et progressive des débits aériens, liée dans 80% des cas au tabagisme.

Symptômes : toux chronique matinale, expectoration, dyspnée d'effort progressive (stade I) à dyspnée au moindre effort (stade IV). "Pink puffer" (emphysèmateux) vs "Blue bloater" (bronchitique).

Diagnostic : spirométrie avec VEMS/CV < 0,7 après bronchodilatateur (non réversible contrairement à l'asthme).

Stades GOLD : I (VEMS ≥ 80%), II (50-80%), III (30-50%), IV (< 30%).

Traitement : arrêt tabac = seul traitement modifiant l'évolution. Bronchodilatateurs longue durée d'action (LABA : formotérol, LAMA : tiotropium). CSI si exacerbations fréquentes. Réhabilitation respiratoire. Oxygénothérapie longue durée si SaO2 ≤ 88% à l'état stable.

Vaccination : grippe annuelle + pneumocoque obligatoires.

Exacerbation : aggravation aiguë des symptômes (dyspnée, toux, expectoration). Peut nécessiter hospitalisation.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Insuffisance cardiaque — symptômes et prise en charge',
    contenu: `Insuffisance cardiaque (IC) — informations médicales :

Définition : incapacité du cœur à assurer un débit sanguin suffisant aux besoins de l'organisme. Principale cause d'hospitalisation après 65 ans en France.

Symptômes : dyspnée d'effort (puis au repos), orthopnée (dyspnée en décubitus), dyspnée paroxystique nocturne, œdèmes des membres inférieurs, fatigue, prise de poids rapide (rétention hydrosodée), toux nocturne.

Score NYHA :
- Classe I : asymptomatique.
- Classe II : symptômes à l'effort important.
- Classe III : symptômes à l'effort modéré.
- Classe IV : symptômes au repos.

Traitement médicamenteux IC à FEVG réduite (< 40%) :
- IEC (ramipril, périndopril) ou valsartan/sacubitril.
- Bêtabloquants (bisoprolol, carvédilol).
- Anti-aldostérones (spironolactone, éplérénone).
- Inhibiteurs SGLT2 (dapagliflozine, empagliflozine) — nouvelle classe.
- Diurétiques (furosémide) si rétention.

Signes d'alarme nécessitant consultation urgente : dyspnée de repos ou aggravation rapide, prise de poids > 2 kg en 3 jours, œdèmes croissants.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Hypothyroïdie — diagnostic et traitement',
    contenu: `Hypothyroïdie — informations médicales :

Définition : insuffisance de production des hormones thyroïdiennes (T3, T4). Cause la plus fréquente en France : thyroïdite de Hashimoto (auto-immune).

Symptômes : fatigue, prise de poids, frilosité, constipation, bradycardie, peau sèche, cheveux cassants, ongles cassants, voix rauque, ralentissement psychomoteur, dépression, crampes musculaires, syndrome du canal carpien.

Biologie : TSH élevée (> 4 mUI/L), T4 libre basse. TSH seule suffit pour le dépistage.

Hypothyroïdie infraclinique : TSH élevée avec T4 normale. Traiter si TSH > 10 mUI/L, symptômes, grossesse ou désir de grossesse.

Traitement : lévothyroxine (L-thyroxine, Euthyrox, Levothyrox) à prendre le matin à jeun, 30 min avant le petit déjeuner. Dose initiale 25-50 µg/jour, ajustée selon TSH cible (0,5-2,5 mUI/L). Augmenter progressivement chez les coronariens et personnes âgées.

Suivi : TSH tous les 6 mois en phase d'équilibration, puis annuellement.

Grossesse : adapter la dose (besoins augmentés de 30-50%), TSH cible < 2,5 mUI/L au 1er trimestre.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Cholestérol et dyslipidémies — objectifs et traitement',
    contenu: `Dyslipidémies (cholestérol) — recommandations HAS/ESC :

Valeurs de référence :
- LDL-cholestérol (mauvais) : < 1,6 g/L chez personne sans facteur de risque, < 1,3 g/L si 1 facteur, < 1 g/L si 2 facteurs ou diabète, < 0,7 g/L si maladie cardiovasculaire (très haut risque).
- HDL-cholestérol (bon) : > 0,4 g/L (homme), > 0,5 g/L (femme).
- Triglycérides : < 1,5 g/L.
- Cholestérol total : < 2 g/L.

Mesures hygiéno-diététiques : réduction graisses saturées (viandes grasses, charcuterie, fromages, beurre), augmentation graisses insaturées (huile olive/colza, poisson gras, noix), fibres (légumineuses, céréales complètes, légumes), activité physique.

Statines (traitement médicamenteux de référence) : atorvastatine, rosuvastatine. Effets indésirables : myalgies (surveiller CPK), rhabdomyolyse rare. Contre-indication : grossesse.

Surveillance : bilan lipidique à jeun à 3 mois après début traitement, puis annuellement.`,
  },

  // ─── Nutrition ────────────────────────────────────────────────────────────
  {
    source: 'oms_recommandations',
    titre: 'Alimentation équilibrée — recommandations OMS et ANSES',
    contenu: `Alimentation équilibrée — recommandations OMS/ANSES (Programme National Nutrition Santé) :

Fruits et légumes : au moins 5 portions par jour (1 portion = 80g). Crus et cuits. Riches en vitamines, minéraux, fibres, antioxydants.

Féculents et céréales complètes : pain complet, riz complet, pâtes semi-complètes, quinoa, légumineuses. Base énergétique, fibres, vitamines B. Préférer complets (index glycémique plus bas).

Protéines : 1-1,5 g/kg/jour. Viande/poisson/œufs : 1-2 fois par jour. Poisson gras (saumon, maquereau, sardine) 2x/semaine (oméga-3). Légumineuses (lentilles, pois chiches) : riches en protéines végétales, fibres.

Produits laitiers : 2 par jour (adulte), apport calcium et vitamine D. Limiter fromages gras.

Matières grasses : privilégier huile d'olive et de colza (AGM et oméga-3). Limiter beurre, crème, graisses saturées.

Sucres ajoutés : < 10% des apports énergétiques. Limiter sodas, confiseries, pâtisseries.

Sel : < 5g/jour. Réduire produits transformés, charcuterie, fromages salés.

Eau : 1,5 L/jour minimum, plus par temps chaud ou activité physique.`,
  },
  {
    source: 'oms_recommandations',
    titre: 'Vitamine D — sources, déficience et supplémentation',
    contenu: `Vitamine D — informations médicales :

Rôles : absorption du calcium et du phosphore, minéralisation osseuse, immunité, fonctions musculaires, prévention rachitisme (enfant) et ostéoporose (adulte).

Synthèse cutanée : principale source (80-90%) — exposition solaire 15-30 min/jour sur visage + avant-bras (éviter heures chaudes, sans crème solaire brève exposition). Limitée en automne-hiver en France (latitude > 45°).

Apports alimentaires (sources) : poissons gras (saumon, maquereau, hareng), huile de foie de morue, jaune d'œuf, champignons shiitaké, produits laitiers enrichis.

Déficience (< 20 ng/mL) : très fréquente en France, surtout en hiver, personnes âgées, peau foncée, obèses, peu exposés au soleil. Symptômes : fatigue, douleurs musculaires, osseuses, infections répétées.

Supplémentation recommandée : nourrissons (1000 UI/jour), enfants et adolescents (400-800 UI/jour), adultes à risque (800-1200 UI/jour), personnes âgées (800-2000 UI/jour).

Dosage sanguin : 25-OH vitamine D3. Cible optimale : 30-60 ng/mL. Toxicité > 150 ng/mL (rare, surdosage de supplémentation).`,
  },
  {
    source: 'oms_recommandations',
    titre: 'Carence en fer et anémie ferriprive',
    contenu: `Carence en fer et anémie ferriprive — informations médicales :

Épidémiologie : 1re cause d'anémie dans le monde. Touche surtout femmes en âge de procréer (menstruations abondantes), femmes enceintes, nourrissons, enfants en croissance, végétariens/végétaliens, sportifs de haut niveau.

Symptômes : fatigue intense, pâleur, essoufflement à l'effort, palpitations, maux de tête, difficultés de concentration, fragilité des ongles (koïlonychie), cheveux cassants, pica (envie de manger des substances non alimentaires).

Biologie : ferritine basse (< 15 µg/L), fer sérique bas, saturation transferrine basse, NFS avec microcytose, hypochromie, Hb basse (femme < 12g/dL, homme < 13g/dL).

Traitement : fer par voie orale (sulfate/fumarate/gluconate ferreux ou bisglycinate de fer) pendant 3-6 mois. Prendre à jeun ou avec vitamine C (améliore absorption). Éviter café, thé, produits laitiers dans l'heure suivant la prise.

Sources alimentaires : fer héminique (viande rouge, abats, boudin) mieux absorbé. Fer non héminique (légumineuses, tofu, épinards) — absorption améliorée par vit C.

Rechercher une cause : règles abondantes, saignement digestif (gastroscopie si homme ou femme ménopausée).`,
  },
  {
    source: 'oms_recommandations',
    titre: 'Activité physique — recommandations OMS',
    contenu: `Activité physique — recommandations OMS (2020) :

Adultes (18-64 ans) : 150-300 min d'activité d'intensité modérée par semaine (marche rapide, vélo, natation) OU 75-150 min d'activité intense (course, sport collectif). Renforcement musculaire ≥ 2 fois/semaine. Réduire la sédentarité.

Personnes âgées (65+) : mêmes recommandations + exercices d'équilibre et de coordination ≥ 3 fois/semaine (prévention des chutes). La sédentarité est un facteur de risque cardiovasculaire majeur.

Enfants et adolescents (5-17 ans) : 60 min d'activité modérée à intense par jour, dont renforcement musculaire et osseux ≥ 3 fois/semaine.

Bénéfices : réduction risque cardiovasculaire (-35%), diabète type 2 (-40%), cancers côlon/sein (-20%), dépression (-30%), mortalité toutes causes (-33%), amélioration sommeil, cognition, qualité de vie.

Activité modérée : 5-6/10 sur l'échelle d'effort, peut parler mais légèrement essoufflé (marche rapide, vélo tranquille, aquagym).

Activité intense : 7-8/10 sur l'échelle d'effort, difficile de tenir une conversation (course, natation rapide, sports collectifs intenses).`,
  },
  {
    source: 'oms_recommandations',
    titre: 'Magnésium — rôles, sources et carence',
    contenu: `Magnésium — informations nutritionnelles :

Rôles : cofacteur de > 300 réactions enzymatiques. Régulation musculaire et nerveuse, production d'énergie (ATP), synthèse protéique, glycémie, pression artérielle, santé osseuse.

Apports recommandés : 300-420 mg/jour (adulte). Besoins augmentés : stress, activité physique intense, alcool, diabète, grossesse.

Sources alimentaires : oléagineux (amandes 270 mg/100g, noix de cajou, graines de courge), légumineuses (haricots, lentilles), céréales complètes, chocolat noir (> 70%), légumes verts (épinards, brocoli), eau minérale magnésienne (Hépar : 119 mg/L, Contrex : 86 mg/L).

Déficience (fréquente) : symptômes non spécifiques — crampes musculaires, paupières qui tressautent, fatigue, irritabilité, anxiété, troubles du sommeil, palpitations.

Supplémentation : magnésium bisglycinate ou glycérophosphate de magnésium (meilleure tolérance digestive que oxyde de magnésium). 200-400 mg/jour. Prendre le soir (favorise relaxation).

Les diurétiques, IPP, alcool et régimes hypocaloriques augmentent les pertes en magnésium.`,
  },

  // ─── Médecines alternatives — onglets spécifiques ────────────────────────
  {
    source: 'medecine_chinoise',
    titre: 'Médecine traditionnelle chinoise — principes fondamentaux',
    contenu: `Médecine traditionnelle chinoise (MTC) — principes fondamentaux :

Concepts de base : la MTC repose sur la théorie du Qi (énergie vitale), du Yin/Yang (dualité équilibrée), et des 5 éléments (Bois, Feu, Terre, Métal, Eau). La maladie résulte d'un déséquilibre de ces forces.

Organes-fonctions : en MTC, les organes ne correspondent pas exactement à l'anatomie occidentale. Le Cœur governe l'esprit ; le Foie régule la circulation du Qi ; la Rate-Pancréas transforme les aliments.

Méridiens : 12 méridiens principaux + 8 extraordinaires véhiculent le Qi. 365 points d'acupuncture répartis sur ces méridiens.

Principales pratiques :
- Acupuncture : insertion d'aiguilles sur des points précis. Données cliniques modérées pour douleurs chroniques (lombalgies, migraines, arthrose), nausées (chimiothérapie, grossesse).
- Moxibustion : chaleur appliquée sur les points par combustion d'armoise.
- Phytothérapie chinoise : formules complexes de plantes — attention aux interactions médicamenteuses et contaminations possibles.
- Qi Gong et Tai Chi : pratiques de mouvement et respiration — bénéfices démontrés sur l'équilibre et la qualité de vie des personnes âgées.
- Massage Tuina : manipulation thérapeutique.

Niveau de preuve : variable selon les pratiques — acupuncture pour douleurs chroniques reconnue (EMA), autres pratiques à données limitées.`,
  },
  {
    source: 'medecine_ayurvedique',
    titre: 'Médecine ayurvédique — principes et pratiques',
    contenu: `Médecine ayurvédique — informations médicales :

Origine : système médical traditionnel indien vieux de 3000+ ans. "Ayurveda" = "science de la vie" en sanskrit.

Concepts fondamentaux :
- Doshas : 3 énergies fondamentales — Vata (mouvement, vent/éther), Pitta (transformation, feu/eau), Kapha (cohésion, terre/eau). Chaque individu a une constitution (Prakriti) unique.
- Agni : feu digestif, clé de la santé selon l'Ayurveda.
- Ama : toxines résultant d'une digestion incomplète.

Pratiques :
- Phytothérapie : ashwagandha (adaptogène, études préliminaires sur stress), triphala (digestion), curcuma (anti-inflammatoire — données prometteuses mais biodisponibilité faible), brahmi (mémoire), neem.
- Panchakarma : cures de purification (virechana, vamana, basti) — effectuées sous supervision.
- Diététique : alimentation adaptée à son dosha, épices (gingembre, cumin, coriandre).
- Yoga et méditation.

Niveau de preuve : limité. Certaines plantes ont des études préliminaires positives. Risques : contamination aux métaux lourds de certains produits ayurvédiques, interactions médicamenteuses.

Ne jamais substituer à un traitement médical conventionnel pour maladies graves.`,
  },
  {
    source: 'medecine_homeopathie',
    titre: 'Homéopathie — principes, niveau de preuve et positionnement scientifique',
    contenu: `Homéopathie — transparence scientifique obligatoire :

Principes : fondée par Samuel Hahnemann (1796). Repose sur 2 lois :
1. "Similia similibus curantur" : une substance provoquant des symptômes chez un sujet sain guérirait ces mêmes symptômes chez un malade.
2. La dilution : plus une substance est diluée (dynamisation), plus elle serait active. Dilutions courantes : 5CH (1/10^10), 15CH (1/10^30), 30CH — bien au-delà du nombre d'Avogadro (plus aucune molécule active présente à partir de 12CH).

Niveau de preuve scientifique : TRÈS FAIBLE.
- Méta-analyses rigoureuses (Cochrane, Lancet 2005) : pas d'efficacité supérieure au placebo.
- HAS France (2019) : "service médical insuffisant" → déremboursement total depuis janvier 2021.
- Position scientifique internationale : majorité de la communauté scientifique et médicale considère l'homéopathie comme une médecine sans base scientifique plausible.

L'effet perçu par les patients est principalement attribué à l'effet placebo et à l'attention personnalisée du praticien homéopathe.

L'homéopathie peut être utilisée comme complément au bien-être personnel, mais NE DOIT PAS remplacer un traitement médical conventionnel pour toute maladie sérieuse.`,
  },
  {
    source: 'medecine_naturopathie',
    titre: 'Naturopathie — approches, niveau de preuve et limites',
    contenu: `Naturopathie — informations médicales :

Définition : médecine alternative fondée sur l'idée que le corps possède une capacité innée d'autoguérison. Utilise des approches naturelles : alimentation, plantes, exercice, jeûne, techniques corps-esprit.

Principales pratiques et leur niveau de preuve :

Bien documentées scientifiquement :
- Alimentation équilibrée (PNNS) : preuves solides.
- Activité physique régulière : preuves solides.
- Gestion du stress (méditation, relaxation, cohérence cardiaque) : preuves modérées.

Preuves limitées ou insuffisantes :
- Phytothérapie : variable selon les plantes (millepertuis pour dépression légère = bonne preuve ; nombreuses autres plantes = données insuffisantes). Interactions médicamenteuses possibles.
- Aromathérapie : quelques données pour lavande (anxiété) et tea tree (infections cutanées légères). Huiles essentielles contre-indiquées chez femme enceinte, nourrissons, épileptiques.
- Jeûne thérapeutique : données préliminaires prometteuses mais insuffisantes.

Non validées :
- Iridologie (diagnostic par iris) : aucune preuve.
- Réflexologie plantaire comme outil diagnostique : aucune preuve.

La naturopathie peut compléter la médecine conventionnelle pour le bien-être, mais ne constitue pas un traitement de substitution pour les maladies chroniques sérieuses.`,
  },
  {
    source: 'nutrition_therapeutique',
    titre: 'Nutrition thérapeutique — régime anti-inflammatoire et micronutrition',
    contenu: `Nutrition et inflammation — approche micronutritionnelle :

Régime méditerranéen (le mieux documenté) : huile d'olive extra-vierge (polyphénols, oléocanthal anti-inflammatoire), poissons gras 2-3x/semaine (EPA/DHA), légumineuses, céréales complètes, fruits et légumes variés, noix et graines, herbes aromatiques. Bénéfices démontrés : cardioprotecteur, neuroprotecteur, anti-diabétique.

Oméga-3 (EPA/DHA) : effets anti-inflammatoires documentés. Sources : saumon, maquereau, hareng, sardine, anchois, huile de lin (ALA), graines de chia. Supplémentation 1-2 g/jour d'EPA+DHA si faible consommation de poisson.

Micronutriments anti-oxydants : vitamine C (kiwi, poivron, agrumes), vitamine E (huile de tournesol, amandes), zinc (huîtres, viande, légumineuses), sélénium (noix du Brésil, poissons, œufs), polyphénols (baies, thé vert, curcuma, resvératrol).

Probiotiques et microbiote : Lactobacillus et Bifidobacterium peuvent améliorer l'immunité intestinale, le syndrome du côlon irritable, certaines diarrhées. Sources : yaourt nature, kéfir, kimchi, choucroute, miso.

Micronutrition : approche complémentaire à valider avec un médecin ou diététicien spécialisé. Pas de substitution aux traitements médicaux.`,
  },

  // ─── Gastro-entérologie ───────────────────────────────────────────────────
  {
    source: 'has_recommandations',
    titre: 'Reflux gastro-œsophagien (RGO) — traitement',
    contenu: `Reflux gastro-œsophagien (RGO) — informations médicales :

Définition : remontée du contenu gastrique acide dans l'œsophage par incompétence du sphincter inférieur de l'œsophage.

Symptômes typiques : pyrosis (brûlures rétrosternales ascendantes), régurgitations acides, surtout postprandiaux et en décubitus. Symptômes atypiques : toux chronique nocturne, enrouement, sensation de boule dans la gorge.

Mesures hygiéno-diététiques : surélever la tête du lit (15 cm), éviter coucher dans les 3h suivant le repas, réduire café, thé fort, alcool, tabac, chocolat, menthe, plats épicés, aliments gras, repas copieux.

Traitement médicamenteux : IPP (inhibiteurs de la pompe à protons) : oméprazole, pantoprazole, esoméprazole 20-40 mg/jour pendant 4-8 semaines. Traitement d'entretien si rechute.

Anti-acides (Gaviscon, Maalox) : soulagement rapide mais temporaire des symptômes.

Consulter si : dysphagie (difficulté à avaler), odynophagie (douleur à la déglutition), perte de poids, anémie, symptômes résistants aux IPP, > 50 ans au début des symptômes → gastroscopie recommandée pour éliminer œsophagite/cancer.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Syndrome du côlon irritable (SCI) — diagnostic et prise en charge',
    contenu: `Syndrome du côlon irritable (SCI) — recommandations HAS :

Définition : trouble fonctionnel intestinal chronique sans lésion organique. Touche 10-15% de la population, prédominance féminine.

Critères de Rome IV : douleurs abdominales récurrentes ≥ 1 jour/semaine depuis ≥ 3 mois, associées à ≥ 2 critères : lien avec la défécation, changement de fréquence des selles, changement de consistance des selles.

Formes : SCI-D (diarrhéique), SCI-C (constipé), SCI-M (mixte), SCI-U (non classifié).

Facteurs déclenchants : stress, alimentation (FODMAP — oligosaccharides, disaccharides, monosaccharides, polyols fermentescibles), dysbiose intestinale.

Régime pauvre en FODMAP (efficace dans 50-75% des cas) : réduire lactose, fructose en excès (pomme, poire, mangue), fructanes (blé, ail, oignon), polyols (sorbitol, mannitol). À suivre avec un diététicien.

Traitement médicamenteux selon le type : antispasmodiques (phloroglucinol, mébévérine), lopéramide (SCI-D), mucilage/laxatifs osmotiques (SCI-C), antidépresseurs à faible dose (amitriptyline) si douleurs sévères.

Probiotiques : données encourageantes pour certaines souches (Bifidobacterium longum, Lactobacillus plantarum).`,
  },

  // ─── Dermatologie ────────────────────────────────────────────────────────
  {
    source: 'has_recommandations',
    titre: 'Eczéma (dermatite atopique) — traitement',
    contenu: `Dermatite atopique (eczéma) — recommandations HAS :

Définition : maladie inflammatoire chronique de la peau, multifactorielle (barrière cutanée déficiente + terrain atopique). Très fréquente chez l'enfant (15-20%), peut persister ou débuter à l'âge adulte.

Symptômes : plaques érythémateuses, suintantes lors des poussées, puis squameuses, avec prurit intense. Localisations préférentielles : plis (coudes, genoux), visage (enfant), mains, cou.

Traitement des poussées :
- Dermocorticoïdes (DCI) : traitement de référence. Classes 1-2 (faible à modérée) pour visage/plis, classes 3-4 pour corps/membres. Application 1 fois/jour sur plaques. Ne pas craindre avec utilisation correcte (durée limitée).
- Inhibiteurs de calcineurine (tacrolimus, Protopic) : alternative pour visage et plis.
- Dupilumab (Dupixent) : biothérapie pour formes modérées à sévères résistantes.

Traitement de fond (entre les poussées) :
- Émollients quotidiens ++ (Dexeryl, Cérat de Galien, Lipikar) après douche eau tiède.
- Identifier et éviter les facteurs déclenchants (acariens, certains savons, vêtements synthétiques, stress).

Antihistaminiques : peu efficaces sur le prurit de la DA (prurit non histaminique).`,
  },
  {
    source: 'has_recommandations',
    titre: 'Acné — traitement selon la sévérité',
    contenu: `Acné — recommandations HAS :

Définition : maladie chronique du follicule pilosébacé liée à une hypersécrétion sébacée, hyperkératinisation, colonisation par Cutibacterium acnes (ex-Propionibacterium) et inflammation. Touche 80% des adolescents.

Types de lésions : comédons ouverts (points noirs) et fermés (microkystes), papules (rouge), pustules (pus), nodules (> 5mm, risque cicatriciel), kystes.

Traitement selon la sévérité :

Acné légère (comédons, quelques papules/pustules) :
- Trétinoïne ou adapalène 0,1% (rétinoïde topique) en application le soir.
- Peroxyde de benzoyle 2,5-5% (antibactérien).
- Éviter l'exposition solaire sous rétinoïdes.

Acné modérée (nombreuses papules/pustules) :
- Antibiotique topique (clindamycine) + rétinoïde, ou peroxyde de benzoyle + adapalène.
- Si insuffisant : antibiotique oral (doxycycline 100mg pendant 3 mois maximum).

Acné sévère (nodules, kystes, cicatrices) :
- Isotrétinoïne orale (Accutane/Roaccutane) : traitement de référence. Tératogène (contraception obligatoire chez la femme), suivi hépatique et lipidique.

Soins quotidiens : nettoyage doux 2x/jour (non décapant), éviter cosmétiques comédogènes, ne pas exprimer les lésions.`,
  },

  // ─── Médicaments supplémentaires ─────────────────────────────────────────
  {
    source: 'medicaments_courants_fr',
    titre: 'Amoxicilline — indications, posologie et précautions',
    contenu: `Amoxicilline — antibiotique de la famille des pénicillines :

Indications courantes : angine bactérienne (streptocoque A), otite moyenne aiguë bactérienne, sinusite bactérienne, pneumonie communautaire, infections urinaires (selon antibiogramme), infection cutanée (érysipèle), maladie de Lyme (stade précoce).

Posologie adulte : 1 g 2-3 fois/jour (selon indication). Angine : 2g/jour en 2 prises x6j. Sinusite : amoxicilline-acide clavulanique (Augmentin) 2g/jour x7j.

Posologie enfant : 50-90 mg/kg/jour en 2-3 prises. Otite : 80-90 mg/kg/jour x5j (> 2 ans) ou 10j (< 2 ans).

Allergie à la pénicilline : concerne 5-10% des patients déclarés, mais véritable allergie IgE-médiée rare (< 1%). Alternatives : azithromycine, céphalosporines (si allergie non sévère), clindamycine. Toujours mentionner au médecin.

Effets indésirables : diarrhée (fréquente), rash cutané (distinguer rash bénin maculopapuleux d'une allergie vraie), candidose.

Règles d'usage des antibiotiques : prendre la totalité du traitement. Ne pas partager. Ne pas prendre d'antibiotiques sur une infection virale (rhume, grippe) — résistance bactérienne.`,
  },
  {
    source: 'medicaments_courants_fr',
    titre: 'Oméprazole (IPP) — indications et précautions',
    contenu: `Oméprazole et inhibiteurs de la pompe à protons (IPP) — informations médicales :

Classe : inhibiteurs de la pompe à protons (IPP). Réduisent la sécrétion acide gastrique.

Médicaments de la classe : oméprazole (Mopral), pantoprazole (Eupantol, Inipomp), esoméprazole (Inexium), lansoprazole, rabéprazole.

Indications : reflux gastro-œsophagien (RGO), œsophagite, ulcère gastroduodénal (traitement et prévention sous AINS), éradication H. pylori (en association), Zollinger-Ellison.

Posologie : 20-40 mg/jour, le matin à jeun 30 min avant le petit déjeuner (absorption optimale). Durée : 4-8 semaines selon indication.

Protection gastrique sous AINS : recommandée si ≥ 65 ans, antécédent ulcéreux, traitement anticoagulant associé.

Risques liés à l'usage prolongé : carence en magnésium et vitamine B12, hyponatrémie, pneumonies communautaires, infections C. difficile, fractures ostéoporotiques (usage > 1 an à hautes doses). Ne pas utiliser au long cours sans indication médicale justifiée.

Interaction médicamenteuse : oméprazole réduit l'efficacité du clopidogrel (antiaggrégant) — préférer pantoprazole.`,
  },
  {
    source: 'medicaments_courants_fr',
    titre: 'Metformine — traitement du diabète de type 2',
    contenu: `Metformine (Glucophage) — traitement de référence du diabète de type 2 :

Mécanisme : réduit la production hépatique de glucose (néoglucogenèse), améliore la sensibilité à l'insuline musculaire.

Avantages : pas d'hypoglycémie en monothérapie, neutre sur le poids (voire légère perte), bénéfice cardiovasculaire démontré, faible coût.

Posologie : débuter à 500 mg ou 850 mg/jour au repas (éviter l'estomac vide), augmenter progressivement jusqu'à 2-3 g/jour en 2-3 prises. Prise pendant le repas pour réduire les effets digestifs.

Effets indésirables : nausées, diarrhée, douleurs abdominales (transitoires au début, dose-dépendants). Amélioration si prise en milieu de repas et augmentation progressive.

Contre-indications : insuffisance rénale sévère (DFG < 30 mL/min), insuffisance hépatique sévère, insuffisance cardiaque décompensée, alcoolisme chronique. Suspension 48h avant injection de produit de contraste iodé si DFG < 60.

Carence en vitamine B12 : possible à long terme, surveiller taux B12 tous les 2-3 ans.`,
  },
  {
    source: 'medicaments_courants_fr',
    titre: 'Corticoïdes — indications, effets indésirables et précautions',
    contenu: `Corticoïdes (glucocorticoïdes) — informations médicales :

Médicaments courants : prednisone (Cortancyl), prednisolone (Solupred), méthylprednisolone (Médrol), dexaméthasone, bétaméthasone.

Indications : anti-inflammatoire et immunosuppresseur puissant — asthme aigu, allergies sévères, maladies auto-immunes (polyarthrite rhumatoïde, lupus), BPCO décompensée, sciatique hyperalgique, méningite bactérienne, transplantation.

Effets indésirables (surtout en traitement prolongé > 3 semaines) :
- Métaboliques : hyperglycémie, dyslipidémie, prise de poids (redistribution des graisses).
- Os : ostéoporose (supplémenter calcium 1g + vit D 800 UI/jour si traitement prolongé).
- Cardiovasculaire : hypertension artérielle, rétention hydrosodée.
- Immunité : infections opportunistes (ne pas négliger une fièvre sous corticoïdes).
- Psychiatriques : insomnie, agitation, humeur euphorique ou dépressive.
- Cutané : vergetures, ecchymoses, acné.
- Oculaire : cataracte, glaucome.

Règle d'arrêt : ne jamais arrêter brutalement un traitement > 3 semaines (risque d'insuffisance surrénalienne) — décroissance progressive obligatoire.`,
  },

  // ─── Grossesse et pédiatrie ───────────────────────────────────────────────
  {
    source: 'has_recommandations',
    titre: 'Suivi de grossesse — examens et calendrier',
    contenu: `Suivi de grossesse — recommandations HAS (France) :

7 consultations obligatoires prises en charge à 100% :
- 1re consultation (avant 10 SA) : déclaration grossesse, bilan sanguin complet (NFS, groupe sanguin, sérologies, glycémie).
- Consultations mensuelles ensuite : tension, poids, hauteur utérine, rythme cardiaque fœtal, bandelette urinaire.

Échographies recommandées (3 minimum) :
- 1re écho (11-13 SA) : datation, clarté nucale (dépistage trisomie 21), chorionicité si grossesse multiple.
- 2e écho morphologique (22 SA) : anatomie fœtale complète.
- 3e écho (32 SA) : croissance, position, liquide amniotique.

Supplémentations recommandées :
- Acide folique (B9) : 400 µg/jour dès le désir de grossesse jusqu'à 12 SA (prévention spina bifida).
- Iode : recommandé dans certaines régions.

Signes d'alarme nécessitant consultation urgente : saignements vaginaux, douleurs abdominales intenses, contractions avant 37 SA, rupture de la poche des eaux, mouvements fœtaux absents > 12h après 28 SA, céphalées intenses + vision trouble + œdèmes des mains/visage (pré-éclampsie).

Pathologies spécifiques : diabète gestationnel (HGPO à 24-28 SA si facteurs de risque), hypertension gravidique.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Pédiatrie — développement de l\'enfant et examens obligatoires',
    contenu: `Développement de l'enfant et examens obligatoires — France :

Examens obligatoires (20 au total) : 9 examens de 0 à 6 ans pris en charge à 100%. Examens à J8, 1 mois, 2 mois, 4 mois, 5 mois, 9 mois, 12 mois, 2 ans, 3 ans, 4 ans, 5 ans, puis annuels jusqu'à 18 ans (examens de prévention).

Repères de développement moteur :
- 3 mois : tenue de tête, suit un objet du regard.
- 6 mois : se retourne, tient assis avec soutien.
- 9 mois : assis seul, commence à se mettre debout, pince pouce-index.
- 12 mois : marche avec soutien ou seul.
- 18 mois : marche seul, monte les escaliers avec aide.
- 24 mois : court, saute sur place, 50+ mots.

Repères de développement du langage : premiers mots à 10-15 mois, 2 mots associés à 18-24 mois, phrases de 3 mots à 3 ans.

Consulter si : perte d'acquis (régression), pas de sourire social à 2 mois, pas de mots à 18 mois, pas de phrases à 30 mois, pas de contact visuel, comportements répétitifs (signes autisme).

Alimentation nourrisson : allaitement maternel exclusif recommandé jusqu'à 6 mois (OMS). Diversification alimentaire à partir de 4-6 mois révolus (jamais avant 4 mois). Lait de suite 2e âge jusqu'à 12 mois, puis lait de croissance jusqu'à 3 ans.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Varicelle — symptômes, traitement et complications',
    contenu: `Varicelle — informations médicales :

Épidémiologie : primo-infection au virus varicelle-zona (VZV). Très contagieuse (voie aérienne + contact). Pic épidémique mars-mai. 90% des cas avant 15 ans. Immunité définitive après l'infection.

Symptômes : fièvre modérée, puis éruption cutanée caractéristique débutant par macules roses, évoluant vers vésicules (aspect en "gouttes de rosée"), puis croûtes, en plusieurs poussées successives sur tout le corps. Prurit intense. Contagieux 2 jours avant l'éruption jusqu'à la croûte de toutes les lésions (5-7 jours).

Traitement symptomatique : paracétamol (pas d'ibuprofène — risque de fasciite nécrosante), antihistaminiques anti-prurigineux (hydroxyzine), bains antiseptiques, couper ongles courts. Ne pas gratter (cicatrices, surinfection).

Traitement antiviral (aciclovir) : réservé aux formes sévères, immunodéprimés, adultes (risque complications), nouveau-nés, femmes enceintes.

Complications : surinfection cutanée bactérienne (streptocoque, staphylocoque), pneumonie varicelleuse (adulte, fumeur), encéphalite, zona ultérieur.

Vaccin : recommandé pour les professionnels de santé et adultes non immunisés (surtout avant grossesse). Non au calendrier vaccinal obligatoire en France mais recommandé.`,
  },
  {
    source: 'has_recommandations',
    titre: 'Bronchiolite du nourrisson — signes de gravité et prise en charge',
    contenu: `Bronchiolite aiguë du nourrisson — recommandations HAS :

Définition : infection virale des bronchioles (VRS dans 50-80% des cas). Principale cause d'hospitalisation du nourrisson. Pic : novembre à février.

Symptômes : rhinite initiale puis toux, sifflement expiratoire (wheezing), difficultés respiratoires. Fièvre modérée ou absente.

Signes de gravité nécessitant appel du 15 ou urgences :
- Nourrisson < 6 semaines.
- Saturation O2 < 94% en air ambiant.
- Fréquence respiratoire > 60/min, battements des ailes du nez, creusement sous les côtes (tirage).
- Apnées (pauses respiratoires).
- Teint gris, cyanose péribuccale.
- Refus alimentaire > 50% ou signes de déshydratation.
- Altération de l'état général, somnolence anormale.

Traitement : désobstruction rhinopharyngée (DRP) au sérum physiologique avant chaque tétée (INDISPENSABLE). Fractionner les repas. Surélever légèrement la tête. Éviter tabac.

Kinésithérapie respiratoire : plus recommandée en routine depuis recommandations HAS 2019 (pas de bénéfice démontré en ambulatoire). Bronchodilatateurs (salbutamol) : non recommandés chez le nourrisson.

Prévention : palivizumab (Synagis) pour grands prématurés et cardiopathies. Nirsevimab (Beyfortus) depuis 2023 recommandé pour tous les nourrissons de leur 1re saison hivernale.`,
  },
]
