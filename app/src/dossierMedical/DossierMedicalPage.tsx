import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'wasp/client/auth'
import { useQuery } from 'wasp/client/operations'
import { Download } from 'lucide-react'
import i18n from '../client/i18n'
import { isUserPremium } from '../payment/freemium'
import {
  getDossierMedical, getEnfants,
  ajouterEnfant, supprimerEnfant,
  updateProfilUtilisateur, modifierEnfant,
  ajouterAllergie, modifierAllergie, supprimerAllergie,
  ajouterTraitement, modifierTraitement, supprimerTraitement,
  ajouterAntecedent, modifierAntecedent, supprimerAntecedent,
  ajouterAntecedentFamilial, modifierAntecedentFamilial, supprimerAntecedentFamilial,
  ajouterVaccination, modifierVaccination, supprimerVaccination,
} from 'wasp/client/operations'

// ─── Types locaux ──────────────────────────────────────────────────────────────

type Allergie = {
  id: string; nom: string; type: string; severite: string; notes: string | null; enfantId: string | null
}
type Traitement = {
  id: string; nom: string; dose: string | null; frequence: string | null
  depuis: Date | null; notes: string | null; enfantId: string | null
}
type Antecedent = {
  id: string; categorie: string; description: string; annee: number | null; notes: string | null; enfantId: string | null
}
type AntecedentFamilial = {
  id: string; relation: string; maladie: string; notes: string | null
}
type Vaccination = {
  id: string; vaccin: string; dateDernierDose: Date; prochainRappel: Date | null; notes: string | null; enfantId: string | null
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────

function dateVersInput(d: Date | null | undefined): string {
  if (!d) return ''
  return new Date(d).toISOString().split('T')[0]
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function DossierMedicalPage() {
  const { data: user } = useAuth()
  const { data: enfants, refetch: refetchEnfants } = useQuery(getEnfants)
  const [enfantId, setEnfantId] = useState<string | null>(null)
  const [ajoutEnfantVisible, setAjoutEnfantVisible] = useState(false)
  const [prenomNouvelEnfant, setPrenomNouvelEnfant] = useState('')
  const [ajoutEnCours, setAjoutEnCours] = useState(false)
  const { t } = useTranslation('dossier')
  const { t: tc } = useTranslation('common')

  const { data: dossier, refetch } = useQuery(getDossierMedical, { enfantId })

  // Vérifie si l'utilisateur est premium pour l'accès à l'export PDF
  const premium = user ? isUserPremium(user as { subscriptionStatus?: string | null; subscriptionPlan?: string | null }) : false

  /**
   * Génère et télécharge un PDF structuré du dossier médical.
   * Fonctionnalité premium uniquement.
   * Contient : profil patient, allergies, traitements, antécédents, vaccinations.
   */
  async function exporterDossierPDF() {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    let y = 20

    // ── En-tête ──────────────────────────────────────────────────────────────
    doc.setFontSize(18)
    doc.setTextColor(29, 78, 216)
    doc.text('Lifaia \u2014 Dossier M\u00e9dical', 20, y)
    y += 8
    doc.setFontSize(10)
    doc.setTextColor(107, 114, 128)
    doc.text(`Export\u00e9 le ${new Date().toLocaleDateString('fr-FR')}`, 20, y)
    y += 10
    doc.setTextColor(0, 0, 0)

    // ── Disclaimer légal ─────────────────────────────────────────────────────
    doc.setFontSize(9)
    doc.setTextColor(180, 100, 0)
    doc.text(
      'Document informatif uniquement \u2014 ne remplace pas un avis m\u00e9dical professionnel',
      20, y
    )
    y += 10
    doc.setTextColor(0, 0, 0)

    // Utilitaires
    function titreSection(label: string) {
      if (y > 260) { doc.addPage(); y = 20 }
      y += 2
      doc.setFontSize(13)
      doc.setTextColor(29, 78, 216)
      doc.text(label, 20, y)
      y += 7
      doc.setFontSize(10)
      doc.setTextColor(0, 0, 0)
    }

    function ligneProfil(label: string, valeur: string) {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setFont('helvetica', 'bold')
      doc.text(`${label} :`, 24, y)
      doc.setFont('helvetica', 'normal')
      doc.text(valeur, 70, y)
      y += 6
    }

    function ligneItem(texte: string) {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.text(`\u2022 ${texte}`, 24, y)
      y += 6
    }

    function aucunElement() {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setTextColor(150, 150, 150)
      doc.text('Aucun \u00e9l\u00e9ment enregistr\u00e9.', 24, y)
      doc.setTextColor(0, 0, 0)
      y += 6
    }

    // ── Profil du patient ────────────────────────────────────────────────────
    const estEnfant = !!enfantSelectionne
    titreSection(estEnfant ? `Profil de ${enfantSelectionne!.prenom}` : 'Profil du patient')

    if (estEnfant) {
      const e = enfantSelectionne!
      ligneProfil('Pr\u00e9nom', e.prenom)
      if (e.sexe) ligneProfil('Sexe', e.sexe)
      if (e.dateNaissance) {
        const age = Math.floor((Date.now() - new Date(e.dateNaissance).getTime()) / (365.25 * 24 * 3600 * 1000))
        ligneProfil('Date de naissance', `${new Date(e.dateNaissance).toLocaleDateString('fr-FR')} (${age} ans)`)
      }
      if (e.tailleCm) ligneProfil('Taille', `${e.tailleCm} cm`)
      if (e.poidsKg) {
        const imc = e.tailleCm ? (e.poidsKg / Math.pow(e.tailleCm / 100, 2)).toFixed(1) : null
        ligneProfil('Poids', `${e.poidsKg} kg${imc ? ` (IMC : ${imc})` : ''}`)
      }
      if (e.groupeSanguin) ligneProfil('Groupe sanguin', e.groupeSanguin)
      if (e.medecinRef) ligneProfil('M\u00e9decin r\u00e9f\u00e9rent', e.medecinRef)
    } else {
      const u = user as any
      if (u?.email) ligneProfil('Email', u.email)
      if (u?.sexe) ligneProfil('Sexe', u.sexe)
      if (u?.dateNaissance) {
        const age = Math.floor((Date.now() - new Date(u.dateNaissance).getTime()) / (365.25 * 24 * 3600 * 1000))
        ligneProfil('Date de naissance', `${new Date(u.dateNaissance).toLocaleDateString('fr-FR')} (${age} ans)`)
      }
      if (u?.tailleCm) ligneProfil('Taille', `${u.tailleCm} cm`)
      if (u?.poidsKg) {
        const imc = u.tailleCm ? (u.poidsKg / Math.pow(u.tailleCm / 100, 2)).toFixed(1) : null
        ligneProfil('Poids', `${u.poidsKg} kg${imc ? ` (IMC : ${imc})` : ''}`)
      }
      if (u?.groupeSanguin) ligneProfil('Groupe sanguin', u.groupeSanguin)
      if (u?.medecinTraitant) ligneProfil('M\u00e9decin traitant', u.medecinTraitant)
      if (u?.pays) ligneProfil('Pays', u.pays)
    }
    y += 4

    // ── Allergies ─────────────────────────────────────────────────────────────
    titreSection('Allergies')
    const allergies = dossier?.allergies ?? []
    if (allergies.length === 0) {
      aucunElement()
    } else {
      for (const a of allergies) {
        ligneItem(`${a.nom} (${a.type}, ${a.severite})${a.notes ? ' \u2014 ' + a.notes : ''}`)
      }
    }
    y += 4

    // ── Traitements en cours ──────────────────────────────────────────────────
    titreSection('Traitements en cours')
    const traitements = dossier?.traitements ?? []
    if (traitements.length === 0) {
      aucunElement()
    } else {
      for (const tr of traitements) {
        const details = [tr.dose, tr.frequence].filter(Boolean).join(', ')
        ligneItem(`${tr.nom}${details ? ' \u2014 ' + details : ''}`)
      }
    }
    y += 4

    // ── Antécédents personnels ────────────────────────────────────────────────
    titreSection('Ant\u00e9c\u00e9dents personnels')
    const antecedents = dossier?.antecedents ?? []
    if (antecedents.length === 0) {
      aucunElement()
    } else {
      for (const a of antecedents) {
        ligneItem(`${a.description} (${a.categorie}${a.annee ? ', ' + a.annee : ''})`)
      }
    }
    y += 4

    // ── Antécédents familiaux ─────────────────────────────────────────────────
    titreSection('Ant\u00e9c\u00e9dents familiaux')
    const antecedentsFamiliaux = dossier?.antecedentsFamiliaux ?? []
    if (antecedentsFamiliaux.length === 0) {
      aucunElement()
    } else {
      for (const af of antecedentsFamiliaux) {
        ligneItem(`${af.maladie} (${af.relation})`)
      }
    }
    y += 4

    // ── Vaccinations ──────────────────────────────────────────────────────────
    titreSection('Vaccinations')
    const vaccinations = dossier?.vaccinations ?? []
    if (vaccinations.length === 0) {
      aucunElement()
    } else {
      for (const v of vaccinations) {
        const dateStr = new Date(v.dateDernierDose).toLocaleDateString('fr-FR')
        const rappelStr = v.prochainRappel
          ? ` \u2014 prochain rappel : ${new Date(v.prochainRappel).toLocaleDateString('fr-FR')}`
          : ''
        ligneItem(`${v.vaccin} \u2014 derni\u00e8re dose : ${dateStr}${rappelStr}`)
      }
    }

    // Téléchargement
    const nomFichier = `mydoctoria-dossier-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(nomFichier)
  }

  const enfantSelectionne = enfantId ? enfants?.find((e) => e.id === enfantId) ?? null : null

  async function handleAjouterEnfant(e: React.FormEvent) {
    e.preventDefault()
    if (!prenomNouvelEnfant.trim()) return
    setAjoutEnCours(true)
    try {
      const nouvelEnfant = await ajouterEnfant({ prenom: prenomNouvelEnfant.trim() })
      await refetchEnfants()
      setEnfantId(nouvelEnfant.id)
      setPrenomNouvelEnfant('')
      setAjoutEnfantVisible(false)
    } finally {
      setAjoutEnCours(false)
    }
  }

  async function handleSupprimerEnfant(id: string, prenom: string) {
    if (!confirm(tc('delete_confirm', { name: prenom }))) return
    await supprimerEnfant({ id })
    if (enfantId === id) setEnfantId(null)
    refetchEnfants()
  }

  return (
    <div className='mx-auto max-w-3xl px-4 py-10 space-y-6'>
      {/* En-tête avec bouton export PDF (premium uniquement) */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{t('title')}</h1>
        {premium && (
          <button
            onClick={exporterDossierPDF}
            className='flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-cyan-400 hover:text-cyan-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-cyan-500 dark:hover:text-cyan-400'
          >
            <Download className='h-4 w-4' />
            {t('export_pdf')}
          </button>
        )}
      </div>

      {/* Sélecteur de patient + bouton ajouter */}
      <div className='flex flex-wrap items-center gap-2'>
        <button
          onClick={() => { setEnfantId(null); setAjoutEnfantVisible(false) }}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            enfantId === null && !ajoutEnfantVisible
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {tc('me')}
        </button>
        {(enfants ?? []).map((e) => (
          <div key={e.id} className='flex items-center gap-1'>
            <button
              onClick={() => { setEnfantId(e.id); setAjoutEnfantVisible(false) }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                enfantId === e.id
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {e.prenom}
            </button>
            <button
              onClick={() => handleSupprimerEnfant(e.id, e.prenom)}
              className='rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30'
              title={tc('delete_confirm', { name: e.prenom })}
            >
              <svg className='h-3 w-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
        ))}
        {/* Bouton + ajouter une personne */}
        {!ajoutEnfantVisible && (
          <button
            onClick={() => setAjoutEnfantVisible(true)}
            className='flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-500 hover:border-cyan-400 hover:text-cyan-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-cyan-500 dark:hover:text-cyan-400'
          >
            <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
            </svg>
            {tc('add_person')}
          </button>
        )}
        {/* Formulaire inline d'ajout */}
        {ajoutEnfantVisible && (
          <form onSubmit={handleAjouterEnfant} className='flex items-center gap-2'>
            <input
              type='text'
              value={prenomNouvelEnfant}
              onChange={(e) => setPrenomNouvelEnfant(e.target.value)}
              placeholder={tc('firstname')}
              maxLength={50}
              autoFocus
              className='rounded-full border border-cyan-400 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-cyan-500 dark:bg-gray-700 dark:text-white'
            />
            <button
              type='submit'
              disabled={ajoutEnCours || !prenomNouvelEnfant.trim()}
              className='rounded-full bg-cyan-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50'
            >
              {ajoutEnCours ? '...' : tc('add')}
            </button>
            <button
              type='button'
              onClick={() => { setAjoutEnfantVisible(false); setPrenomNouvelEnfant('') }}
              className='rounded-full p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            >
              <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </form>
        )}
      </div>

      {/* Profil biologique — utilisateur ou enfant sélectionné */}
      {enfantId === null ? (
        <SectionProfilUtilisateur user={user} />
      ) : (
        enfantSelectionne && (
          <SectionProfilEnfant enfant={enfantSelectionne} onRefetch={refetchEnfants} />
        )
      )}

      {/* Sections */}
      <SectionAllergies
        items={dossier?.allergies ?? []}
        enfantId={enfantId}
        onRefetch={refetch}
      />
      <SectionTraitements
        items={dossier?.traitements ?? []}
        enfantId={enfantId}
        onRefetch={refetch}
      />
      <SectionAntecedents
        items={dossier?.antecedents ?? []}
        enfantId={enfantId}
        onRefetch={refetch}
      />
      {/* Antécédents familiaux : uniquement pour l'utilisateur principal */}
      {enfantId === null && (
        <SectionAntecedentsFamiliaux
          items={dossier?.antecedentsFamiliaux ?? []}
          onRefetch={refetch}
        />
      )}
      <SectionVaccinations
        items={dossier?.vaccinations ?? []}
        enfantId={enfantId}
        onRefetch={refetch}
      />
    </div>
  )
}

// ─── Section profil biologique (utilisateur) ─────────────────────────────────

const GROUPES_SANGUINS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const
type Sexe = 'homme' | 'femme' | 'autre'

function dateVersInputDate(d: Date | string | null | undefined): string {
  if (!d) return ''
  return new Date(d).toISOString().split('T')[0]
}

function SectionProfilUtilisateur({ user }: { user: any }) {
  const { t } = useTranslation('dossier')
  const { t: tc } = useTranslation('common')
  const [enEdition, setEnEdition] = useState(false)
  const [sexe, setSexe] = useState<Sexe | ''>((user?.sexe as Sexe) ?? '')
  const [dateNaissance, setDateNaissance] = useState(dateVersInputDate(user?.dateNaissance))
  const [tailleCm, setTailleCm] = useState(user?.tailleCm?.toString() ?? '')
  const [poidsKg, setPoidsKg] = useState(user?.poidsKg?.toString() ?? '')
  const [groupeSanguin, setGroupeSanguin] = useState(user?.groupeSanguin ?? '')
  const [medecinTraitant, setMedecinTraitant] = useState(user?.medecinTraitant ?? '')
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  async function handleSauvegarder(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await updateProfilUtilisateur({
        sexe: sexe || undefined,
        dateNaissance: dateNaissance || undefined,
        tailleCm: tailleCm ? parseInt(tailleCm, 10) : null,
        poidsKg: poidsKg ? parseFloat(poidsKg) : null,
        groupeSanguin: (groupeSanguin || null) as any,
        medecinTraitant: medecinTraitant || null,
      })
      setEnEdition(false)
    } catch (err: unknown) {
      setErreur(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setEnCours(false)
    }
  }

  const age = user?.dateNaissance
    ? (() => {
        const d = new Date(user.dateNaissance)
        const auj = new Date()
        let a = auj.getFullYear() - d.getFullYear()
        const m = auj.getMonth() - d.getMonth()
        if (m < 0 || (m === 0 && auj.getDate() < d.getDate())) a--
        return a
      })()
    : null

  return (
    <div className='rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
      <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700'>
        <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>{t('my_profile')}</h2>
        {!enEdition && (
          <button
            onClick={() => setEnEdition(true)}
            className='text-xs font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400'
          >
            {tc('edit')}
          </button>
        )}
      </div>
      {!enEdition ? (
        <div className='grid grid-cols-2 gap-x-8 gap-y-3 px-6 py-4 sm:grid-cols-3'>
          <InfoLigneProfil label={tc('sex')} valeur={user?.sexe ?? '—'} />
          <InfoLigneProfil label={t('age')} valeur={age !== null ? tc('age_years', { age }) : '—'} />
          <InfoLigneProfil label={tc('height_cm')} valeur={user?.tailleCm ? `${user.tailleCm} cm` : '—'} />
          <InfoLigneProfil label={tc('weight_kg')} valeur={user?.poidsKg ? `${user.poidsKg} kg` : '—'} />
          <InfoLigneProfil label={tc('blood_group')} valeur={user?.groupeSanguin ?? '—'} />
          <InfoLigneProfil label={tc('treating_doctor')} valeur={user?.medecinTraitant ?? '—'} />
        </div>
      ) : (
        <form onSubmit={handleSauvegarder} className='px-6 py-4 space-y-4'>
          {/* Sexe */}
          <div>
            <p className='mb-2 text-xs font-medium text-gray-700 dark:text-gray-300'>{t('sex_bio')}</p>
            <div className='flex gap-2'>
              {(['homme', 'femme', 'autre'] as Sexe[]).map((s) => (
                <button
                  key={s}
                  type='button'
                  onClick={() => setSexe(s)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                    sexe === s
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400'
                  }`}
                >
                  {tc(`sex_${s === 'homme' ? 'male' : s === 'femme' ? 'female' : 'other'}`)}
                </button>
              ))}
            </div>
          </div>
          {/* Date de naissance + Taille + Poids */}
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
            <div>
              <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{tc('dob')}</label>
              <input type='date' value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} max={new Date().toISOString().split('T')[0]} className={inputClass} />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{tc('height_cm')}</label>
              <input type='number' value={tailleCm} onChange={(e) => setTailleCm(e.target.value)} placeholder='170' min={50} max={250} className={inputClass} />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{tc('weight_kg')}</label>
              <input type='number' value={poidsKg} onChange={(e) => setPoidsKg(e.target.value)} placeholder='70' min={2} max={500} step='0.1' className={inputClass} />
            </div>
          </div>
          {/* Groupe sanguin */}
          <div>
            <p className='mb-2 text-xs font-medium text-gray-700 dark:text-gray-300'>{tc('blood_group')}</p>
            <div className='flex flex-wrap gap-2'>
              {GROUPES_SANGUINS.map((g) => (
                <button
                  key={g}
                  type='button'
                  onClick={() => setGroupeSanguin(groupeSanguin === g ? '' : g)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    groupeSanguin === g
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          {/* Médecin traitant */}
          <div>
            <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{tc('treating_doctor')}</label>
            <input type='text' value={medecinTraitant} onChange={(e) => setMedecinTraitant(e.target.value)} placeholder='Dr Dupont' maxLength={100} className={inputClass} />
          </div>
          {erreur && <p className='text-sm text-red-600 dark:text-red-400'>{erreur}</p>}
          <div className='flex gap-3'>
            <button type='button' onClick={() => { setEnEdition(false); setErreur(null) }} className='flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'>
              {tc('cancel')}
            </button>
            <button type='submit' disabled={enCours} className='flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60'>
              {enCours ? tc('saving') : tc('save')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// ─── Section profil biologique (enfant) ──────────────────────────────────────

function SectionProfilEnfant({
  enfant,
  onRefetch,
}: {
  enfant: { id: string; prenom: string; sexe: string | null; dateNaissance: Date | null; tailleCm: number | null; poidsKg: number | null; groupeSanguin: string | null; medecinRef: string | null }
  onRefetch: () => void
}) {
  const { t } = useTranslation('dossier')
  const { t: tc } = useTranslation('common')
  const [enEdition, setEnEdition] = useState(false)
  const [sexe, setSexe] = useState<Sexe | ''>((enfant.sexe as Sexe) ?? '')
  const [dateNaissance, setDateNaissance] = useState(dateVersInputDate(enfant.dateNaissance))
  const [tailleCm, setTailleCm] = useState(enfant.tailleCm?.toString() ?? '')
  const [poidsKg, setPoidsKg] = useState(enfant.poidsKg?.toString() ?? '')
  const [groupeSanguin, setGroupeSanguin] = useState(enfant.groupeSanguin ?? '')
  const [medecinRef, setMedecinRef] = useState(enfant.medecinRef ?? '')
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  async function handleSauvegarder(e: React.FormEvent) {
    e.preventDefault()
    setErreur(null)
    setEnCours(true)
    try {
      await modifierEnfant({
        id: enfant.id,
        prenom: enfant.prenom,
        sexe: (sexe || null) as Sexe | null,
        dateNaissance: dateNaissance || null,
        tailleCm: tailleCm ? parseInt(tailleCm, 10) : null,
        poidsKg: poidsKg ? parseFloat(poidsKg) : null,
        groupeSanguin: (groupeSanguin || null) as any,
        medecinRef: medecinRef || null,
      })
      onRefetch()
      setEnEdition(false)
    } catch (err: unknown) {
      setErreur(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setEnCours(false)
    }
  }

  const age = enfant.dateNaissance
    ? (() => {
        const d = new Date(enfant.dateNaissance)
        const auj = new Date()
        let a = auj.getFullYear() - d.getFullYear()
        const m = auj.getMonth() - d.getMonth()
        if (m < 0 || (m === 0 && auj.getDate() < d.getDate())) a--
        return a
      })()
    : null

  return (
    <div className='rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
      <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700'>
        <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>{t('profile_of', { name: enfant.prenom })}</h2>
        {!enEdition && (
          <button
            onClick={() => setEnEdition(true)}
            className='text-xs font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400'
          >
            {tc('edit')}
          </button>
        )}
      </div>
      {!enEdition ? (
        <div className='grid grid-cols-2 gap-x-8 gap-y-3 px-6 py-4 sm:grid-cols-3'>
          <InfoLigneProfil label={tc('sex')} valeur={enfant.sexe ?? '—'} />
          <InfoLigneProfil label={t('age')} valeur={age !== null ? tc('age_years', { age }) : '—'} />
          <InfoLigneProfil label={tc('height_cm')} valeur={enfant.tailleCm ? `${enfant.tailleCm} cm` : '—'} />
          <InfoLigneProfil label={tc('weight_kg')} valeur={enfant.poidsKg ? `${enfant.poidsKg} kg` : '—'} />
          <InfoLigneProfil label={tc('blood_group')} valeur={enfant.groupeSanguin ?? '—'} />
          <InfoLigneProfil label={t('pediatrician')} valeur={enfant.medecinRef ?? '—'} />
        </div>
      ) : (
        <form onSubmit={handleSauvegarder} className='px-6 py-4 space-y-4'>
          {/* Sexe */}
          <div>
            <p className='mb-2 text-xs font-medium text-gray-700 dark:text-gray-300'>{t('sex_bio')}</p>
            <div className='flex gap-2'>
              {(['homme', 'femme', 'autre'] as Sexe[]).map((s) => (
                <button
                  key={s}
                  type='button'
                  onClick={() => setSexe(s)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                    sexe === s
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400'
                  }`}
                >
                  {tc(`sex_${s === 'homme' ? 'male' : s === 'femme' ? 'female' : 'other'}`)}
                </button>
              ))}
            </div>
          </div>
          {/* Date de naissance + Taille + Poids */}
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
            <div>
              <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{tc('dob')}</label>
              <input type='date' value={dateNaissance} onChange={(e) => setDateNaissance(e.target.value)} max={new Date().toISOString().split('T')[0]} className={inputClass} />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{tc('height_cm')}</label>
              <input type='number' value={tailleCm} onChange={(e) => setTailleCm(e.target.value)} placeholder='120' min={30} max={250} className={inputClass} />
            </div>
            <div>
              <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{tc('weight_kg')}</label>
              <input type='number' value={poidsKg} onChange={(e) => setPoidsKg(e.target.value)} placeholder='30' min={1} max={200} step='0.1' className={inputClass} />
            </div>
          </div>
          {/* Groupe sanguin */}
          <div>
            <p className='mb-2 text-xs font-medium text-gray-700 dark:text-gray-300'>{tc('blood_group')}</p>
            <div className='flex flex-wrap gap-2'>
              {GROUPES_SANGUINS.map((g) => (
                <button
                  key={g}
                  type='button'
                  onClick={() => setGroupeSanguin(groupeSanguin === g ? '' : g)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    groupeSanguin === g
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-600 dark:text-gray-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          {/* Pédiatre */}
          <div>
            <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('pediatrician')}</label>
            <input type='text' value={medecinRef} onChange={(e) => setMedecinRef(e.target.value)} placeholder='Dr Martin' maxLength={100} className={inputClass} />
          </div>
          {erreur && <p className='text-sm text-red-600 dark:text-red-400'>{erreur}</p>}
          <div className='flex gap-3'>
            <button type='button' onClick={() => { setEnEdition(false); setErreur(null) }} className='flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'>
              {tc('cancel')}
            </button>
            <button type='submit' disabled={enCours} className='flex-1 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-60'>
              {enCours ? tc('saving') : tc('save')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function InfoLigneProfil({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div>
      <p className='text-xs text-gray-500 dark:text-gray-400'>{label}</p>
      <p className='text-sm capitalize text-gray-900 dark:text-white'>{valeur}</p>
    </div>
  )
}

// ─── Composant de section générique ──────────────────────────────────────────

function Section({
  titre,
  count,
  children,
}: {
  titre: string
  count: number
  children: React.ReactNode
}) {
  const [ouvert, setOuvert] = useState(true)

  return (
    <div className='rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
      <button
        onClick={() => setOuvert(!ouvert)}
        className='flex w-full items-center justify-between px-6 py-4 text-left'
      >
        <div className='flex items-center gap-3'>
          <h2 className='text-sm font-semibold text-gray-900 dark:text-white'>{titre}</h2>
          {count > 0 && (
            <span className='rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300'>
              {count}
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${ouvert ? 'rotate-180' : ''}`}
          fill='none' viewBox='0 0 24 24' stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </button>
      {ouvert && (
        <div className='border-t border-gray-200 px-6 py-4 dark:border-gray-700'>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Section Allergies ────────────────────────────────────────────────────────

const TYPES_ALLERGIE = ['medicament', 'aliment', 'environnement', 'autre']
const SEVERITES = ['legere', 'moderee', 'severe', 'anaphylaxie']

// Labels traduits — construits dans les composants qui les utilisent
const COULEURS_SEVERITE: Record<string, string> = {
  legere: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  moderee: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  severe: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  anaphylaxie: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

function SectionAllergies({
  items, enfantId, onRefetch,
}: {
  items: Allergie[]; enfantId: string | null; onRefetch: () => void
}) {
  const { t } = useTranslation('dossier')
  const { t: tc } = useTranslation('common')
  const LABELS_TYPE: Record<string, string> = {
    medicament: t('type_medicament'), aliment: t('type_aliment'), environnement: t('type_environnement'), autre: t('type_autre'),
  }
  const LABELS_SEVERITE: Record<string, string> = {
    legere: t('severity_legere'), moderee: t('severity_moderee'), severe: t('severity_severe'), anaphylaxie: t('severity_anaphylaxie'),
  }
  const [ajout, setAjout] = useState(false)
  const [edition, setEdition] = useState<Allergie | null>(null)

  return (
    <Section titre={t('allergies')} count={items.length}>
      <div className='space-y-3'>
        {items.map((a) => (
          <div key={a.id} className='flex items-start justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700/50'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium text-gray-900 dark:text-white'>{a.nom}</span>
                <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-600 dark:text-gray-400'>
                  {LABELS_TYPE[a.type] ?? a.type}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${COULEURS_SEVERITE[a.severite] ?? ''}`}>
                  {LABELS_SEVERITE[a.severite] ?? a.severite}
                </span>
              </div>
              {a.notes && <p className='text-xs text-gray-500 dark:text-gray-400'>{a.notes}</p>}
            </div>
            <BoutonsEdition
              onEdit={() => setEdition(a)}
              onDelete={async () => {
                await supprimerAllergie({ id: a.id })
                onRefetch()
              }}
            />
          </div>
        ))}
        {items.length === 0 && !ajout && (
          <p className='text-sm text-gray-400 dark:text-gray-500'>{t('none_allergies')}</p>
        )}
        {(ajout || edition) && (
          <FormulaireAllergie
            initial={edition ?? undefined}
            enfantId={enfantId}
            onSave={async (data) => {
              if (edition) {
                await modifierAllergie({ id: edition.id, ...data })
              } else {
                await ajouterAllergie({ ...data, enfantId })
              }
              onRefetch()
              setAjout(false)
              setEdition(null)
            }}
            onCancel={() => { setAjout(false); setEdition(null) }}
          />
        )}
        {!ajout && !edition && (
          <BoutonAjouter onClick={() => setAjout(true)} label={t('add_allergy')} />
        )}
      </div>
    </Section>
  )
}

function FormulaireAllergie({
  initial, enfantId: _enfantId, onSave, onCancel,
}: {
  initial?: Allergie
  enfantId: string | null
  onSave: (data: { nom: string; type: string; severite: string; notes?: string | null }) => Promise<void>
  onCancel: () => void
}) {
  const { t } = useTranslation('dossier')
  const LABELS_TYPE: Record<string, string> = {
    medicament: t('type_medicament'), aliment: t('type_aliment'), environnement: t('type_environnement'), autre: t('type_autre'),
  }
  const LABELS_SEVERITE: Record<string, string> = {
    legere: t('severity_legere'), moderee: t('severity_moderee'), severe: t('severity_severe'), anaphylaxie: t('severity_anaphylaxie'),
  }
  const [nom, setNom] = useState(initial?.nom ?? '')
  const [type, setType] = useState(initial?.type ?? 'aliment')
  const [severite, setSeverite] = useState(initial?.severite ?? 'legere')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [enCours, setEnCours] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnCours(true)
    try {
      await onSave({ nom, type, severite, notes: notes || null })
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3 rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-900/20'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('allergen')}</label>
          <input
            type='text'
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            placeholder={t('allergen_placeholder')}
            className={inputClass}
          />
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('type')}</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            {TYPES_ALLERGIE.map((tp) => <option key={tp} value={tp}>{LABELS_TYPE[tp]}</option>)}
          </select>
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('severity')}</label>
          <select value={severite} onChange={(e) => setSeverite(e.target.value)} className={inputClass}>
            {SEVERITES.map((s) => <option key={s} value={s}>{LABELS_SEVERITE[s]}</option>)}
          </select>
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('notes', { ns: 'common' })}</label>
          <input
            type='text'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('symptoms_placeholder')}
            className={inputClass}
          />
        </div>
      </div>
      <BoutonsSauvegarderAnnuler enCours={enCours} onCancel={onCancel} />
    </form>
  )
}

// ─── Section Traitements ──────────────────────────────────────────────────────

function SectionTraitements({
  items, enfantId, onRefetch,
}: {
  items: Traitement[]; enfantId: string | null; onRefetch: () => void
}) {
  const { t } = useTranslation('dossier')
  const { t: tc } = useTranslation('common')
  const [ajout, setAjout] = useState(false)
  const [edition, setEdition] = useState<Traitement | null>(null)

  return (
    <Section titre={t('treatments')} count={items.length}>
      <div className='space-y-3'>
        {items.map((traitement) => (
          <div key={traitement.id} className='flex items-start justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700/50'>
            <div className='space-y-1'>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>{traitement.nom}</span>
              <div className='flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400'>
                {traitement.dose && <span>{t('dose_label')} {traitement.dose}</span>}
                {traitement.frequence && <span>{t('frequency_label')} {traitement.frequence}</span>}
                {traitement.depuis && <span>{t('since_label')} {new Date(traitement.depuis).toLocaleDateString(i18n.language)}</span>}
              </div>
              {traitement.notes && <p className='text-xs text-gray-500 dark:text-gray-400'>{traitement.notes}</p>}
            </div>
            <BoutonsEdition
              onEdit={() => setEdition(traitement)}
              onDelete={async () => {
                await supprimerTraitement({ id: traitement.id })
                onRefetch()
              }}
            />
          </div>
        ))}
        {items.length === 0 && !ajout && (
          <p className='text-sm text-gray-400 dark:text-gray-500'>{t('none_treatments')}</p>
        )}
        {(ajout || edition) && (
          <FormulaireTraitement
            initial={edition ?? undefined}
            onSave={async (data) => {
              if (edition) {
                await modifierTraitement({ id: edition.id, ...data })
              } else {
                await ajouterTraitement({ ...data, enfantId })
              }
              onRefetch()
              setAjout(false)
              setEdition(null)
            }}
            onCancel={() => { setAjout(false); setEdition(null) }}
          />
        )}
        {!ajout && !edition && (
          <BoutonAjouter onClick={() => setAjout(true)} label={t('add_treatment')} />
        )}
      </div>
    </Section>
  )
}

function FormulaireTraitement({
  initial, onSave, onCancel,
}: {
  initial?: Traitement
  onSave: (data: { nom: string; dose?: string | null; frequence?: string | null; depuis?: string | null; notes?: string | null }) => Promise<void>
  onCancel: () => void
}) {
  const { t } = useTranslation('dossier')
  const [nom, setNom] = useState(initial?.nom ?? '')
  const [dose, setDose] = useState(initial?.dose ?? '')
  const [frequence, setFrequence] = useState(initial?.frequence ?? '')
  const [depuis, setDepuis] = useState(dateVersInput(initial?.depuis as Date | null))
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [enCours, setEnCours] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnCours(true)
    try {
      await onSave({
        nom,
        dose: dose || null,
        frequence: frequence || null,
        depuis: depuis || null,
        notes: notes || null,
      })
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3 rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-900/20'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('medication_name')}</label>
          <input type='text' value={nom} onChange={(e) => setNom(e.target.value)} required placeholder={t('medication_placeholder')} className={inputClass} />
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('dose')}</label>
          <input type='text' value={dose} onChange={(e) => setDose(e.target.value)} placeholder={t('dose_placeholder')} className={inputClass} />
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('frequency')}</label>
          <input type='text' value={frequence} onChange={(e) => setFrequence(e.target.value)} placeholder={t('frequency_placeholder')} className={inputClass} />
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('since')}</label>
          <input type='date' value={depuis} onChange={(e) => setDepuis(e.target.value)} className={inputClass} />
        </div>
        <div className='sm:col-span-2'>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('notes', { ns: 'common' })}</label>
          <input type='text' value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('indication_placeholder')} className={inputClass} />
        </div>
      </div>
      <BoutonsSauvegarderAnnuler enCours={enCours} onCancel={onCancel} />
    </form>
  )
}

// ─── Section Antécédents personnels ──────────────────────────────────────────

const CATEGORIES_ANTECEDENT = ['maladie_chronique', 'chirurgie', 'hospitalisation', 'implant_prothese', 'autre']
const RELATIONS = ['pere', 'mere', 'frere_soeur', 'grand_parent', 'oncle_tante', 'autre']

function SectionAntecedents({
  items, enfantId, onRefetch,
}: {
  items: Antecedent[]; enfantId: string | null; onRefetch: () => void
}) {
  const { t } = useTranslation('dossier')
  const LABELS_CATEGORIE: Record<string, string> = {
    maladie_chronique: t('cat_maladie_chronique'),
    chirurgie: t('cat_chirurgie'),
    hospitalisation: t('cat_hospitalisation'),
    implant_prothese: t('cat_implant_prothese'),
    autre: t('cat_autre'),
  }
  const [ajout, setAjout] = useState(false)
  const [edition, setEdition] = useState<Antecedent | null>(null)

  return (
    <Section titre={t('antecedents')} count={items.length}>
      <div className='space-y-3'>
        {items.map((a) => (
          <div key={a.id} className='flex items-start justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700/50'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <span className='rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-600 dark:text-gray-400'>
                  {LABELS_CATEGORIE[a.categorie] ?? a.categorie}
                </span>
                {a.annee && <span className='text-xs text-gray-400'>{a.annee}</span>}
              </div>
              <p className='text-sm text-gray-900 dark:text-white'>{a.description}</p>
              {a.notes && <p className='text-xs text-gray-500 dark:text-gray-400'>{a.notes}</p>}
            </div>
            <BoutonsEdition
              onEdit={() => setEdition(a)}
              onDelete={async () => {
                await supprimerAntecedent({ id: a.id })
                onRefetch()
              }}
            />
          </div>
        ))}
        {items.length === 0 && !ajout && (
          <p className='text-sm text-gray-400 dark:text-gray-500'>{t('none_antecedents')}</p>
        )}
        {(ajout || edition) && (
          <FormulaireAntecedent
            initial={edition ?? undefined}
            onSave={async (data) => {
              if (edition) {
                await modifierAntecedent({ id: edition.id, ...data })
              } else {
                await ajouterAntecedent({ ...data, enfantId })
              }
              onRefetch()
              setAjout(false)
              setEdition(null)
            }}
            onCancel={() => { setAjout(false); setEdition(null) }}
          />
        )}
        {!ajout && !edition && (
          <BoutonAjouter onClick={() => setAjout(true)} label={t('add_antecedent')} />
        )}
      </div>
    </Section>
  )
}

function FormulaireAntecedent({
  initial, onSave, onCancel,
}: {
  initial?: Antecedent
  onSave: (data: { categorie: string; description: string; annee?: number | null; notes?: string | null }) => Promise<void>
  onCancel: () => void
}) {
  const { t } = useTranslation('dossier')
  const LABELS_CATEGORIE: Record<string, string> = {
    maladie_chronique: t('cat_maladie_chronique'),
    chirurgie: t('cat_chirurgie'),
    hospitalisation: t('cat_hospitalisation'),
    implant_prothese: t('cat_implant_prothese'),
    autre: t('cat_autre'),
  }
  const [categorie, setCategorie] = useState(initial?.categorie ?? 'maladie_chronique')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [annee, setAnnee] = useState(initial?.annee?.toString() ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [enCours, setEnCours] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnCours(true)
    try {
      await onSave({
        categorie,
        description,
        annee: annee ? parseInt(annee) : null,
        notes: notes || null,
      })
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3 rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-900/20'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('category')}</label>
          <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className={inputClass}>
            {CATEGORIES_ANTECEDENT.map((c) => <option key={c} value={c}>{LABELS_CATEGORIE[c]}</option>)}
          </select>
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('year')}</label>
          <input type='number' value={annee} onChange={(e) => setAnnee(e.target.value)} placeholder={t('year_placeholder')} min='1900' max={new Date().getFullYear()} className={inputClass} />
        </div>
        <div className='sm:col-span-2'>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('description')}</label>
          <input type='text' value={description} onChange={(e) => setDescription(e.target.value)} required placeholder={t('description_placeholder')} className={inputClass} />
        </div>
        <div className='sm:col-span-2'>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('notes', { ns: 'common' })}</label>
          <input type='text' value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('sequelae_placeholder')} className={inputClass} />
        </div>
      </div>
      <BoutonsSauvegarderAnnuler enCours={enCours} onCancel={onCancel} />
    </form>
  )
}

// ─── Section Antécédents familiaux ────────────────────────────────────────────

function SectionAntecedentsFamiliaux({
  items, onRefetch,
}: {
  items: AntecedentFamilial[]; onRefetch: () => void
}) {
  const { t } = useTranslation('dossier')
  const LABELS_RELATION: Record<string, string> = {
    pere: t('rel_pere'), mere: t('rel_mere'), frere_soeur: t('rel_frere_soeur'),
    grand_parent: t('rel_grand_parent'), oncle_tante: t('rel_oncle_tante'), autre: t('rel_autre'),
  }
  const [ajout, setAjout] = useState(false)
  const [edition, setEdition] = useState<AntecedentFamilial | null>(null)

  return (
    <Section titre={t('family_history')} count={items.length}>
      <div className='space-y-3'>
        {items.map((a) => (
          <div key={a.id} className='flex items-start justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700/50'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <span className='rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300'>
                  {LABELS_RELATION[a.relation] ?? a.relation}
                </span>
                <span className='text-sm text-gray-900 dark:text-white'>{a.maladie}</span>
              </div>
              {a.notes && <p className='text-xs text-gray-500 dark:text-gray-400'>{a.notes}</p>}
            </div>
            <BoutonsEdition
              onEdit={() => setEdition(a)}
              onDelete={async () => {
                await supprimerAntecedentFamilial({ id: a.id })
                onRefetch()
              }}
            />
          </div>
        ))}
        {items.length === 0 && !ajout && (
          <p className='text-sm text-gray-400 dark:text-gray-500'>{t('none_family')}</p>
        )}
        {(ajout || edition) && (
          <FormulaireAntecedentFamilial
            initial={edition ?? undefined}
            onSave={async (data) => {
              if (edition) {
                await modifierAntecedentFamilial({ id: edition.id, ...data })
              } else {
                await ajouterAntecedentFamilial(data)
              }
              onRefetch()
              setAjout(false)
              setEdition(null)
            }}
            onCancel={() => { setAjout(false); setEdition(null) }}
          />
        )}
        {!ajout && !edition && (
          <BoutonAjouter onClick={() => setAjout(true)} label={t('add_family')} />
        )}
      </div>
    </Section>
  )
}

function FormulaireAntecedentFamilial({
  initial, onSave, onCancel,
}: {
  initial?: AntecedentFamilial
  onSave: (data: { relation: string; maladie: string; notes?: string | null }) => Promise<void>
  onCancel: () => void
}) {
  const { t } = useTranslation('dossier')
  const LABELS_RELATION: Record<string, string> = {
    pere: t('rel_pere'), mere: t('rel_mere'), frere_soeur: t('rel_frere_soeur'),
    grand_parent: t('rel_grand_parent'), oncle_tante: t('rel_oncle_tante'), autre: t('rel_autre'),
  }
  const [relation, setRelation] = useState(initial?.relation ?? 'pere')
  const [maladie, setMaladie] = useState(initial?.maladie ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [enCours, setEnCours] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnCours(true)
    try {
      await onSave({ relation, maladie, notes: notes || null })
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3 rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-900/20'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('family_member')}</label>
          <select value={relation} onChange={(e) => setRelation(e.target.value)} className={inputClass}>
            {RELATIONS.map((r) => <option key={r} value={r}>{LABELS_RELATION[r]}</option>)}
          </select>
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('disease')}</label>
          <input type='text' value={maladie} onChange={(e) => setMaladie(e.target.value)} required placeholder={t('disease_placeholder')} className={inputClass} />
        </div>
        <div className='sm:col-span-2'>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('notes', { ns: 'common' })}</label>
          <input type='text' value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('diagnosis_placeholder')} className={inputClass} />
        </div>
      </div>
      <BoutonsSauvegarderAnnuler enCours={enCours} onCancel={onCancel} />
    </form>
  )
}

// ─── Section Vaccinations ─────────────────────────────────────────────────────

function SectionVaccinations({
  items, enfantId, onRefetch,
}: {
  items: Vaccination[]; enfantId: string | null; onRefetch: () => void
}) {
  const { t } = useTranslation('dossier')
  const [ajout, setAjout] = useState(false)
  const [edition, setEdition] = useState<Vaccination | null>(null)

  return (
    <Section titre={t('vaccinations')} count={items.length}>
      <div className='space-y-3'>
        {items.map((v) => (
          <div key={v.id} className='flex items-start justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700/50'>
            <div className='space-y-1'>
              <span className='text-sm font-medium text-gray-900 dark:text-white'>{v.vaccin}</span>
              <div className='flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400'>
                <span>{t('last_dose_label')} {new Date(v.dateDernierDose).toLocaleDateString(i18n.language)}</span>
                {v.prochainRappel && (
                  <span className={
                    new Date(v.prochainRappel) < new Date()
                      ? 'font-medium text-red-500 dark:text-red-400'
                      : ''
                  }>
                    {t('next_reminder_label')} {new Date(v.prochainRappel).toLocaleDateString(i18n.language)}
                  </span>
                )}
              </div>
              {v.notes && <p className='text-xs text-gray-500 dark:text-gray-400'>{v.notes}</p>}
            </div>
            <BoutonsEdition
              onEdit={() => setEdition(v)}
              onDelete={async () => {
                await supprimerVaccination({ id: v.id })
                onRefetch()
              }}
            />
          </div>
        ))}
        {items.length === 0 && !ajout && (
          <p className='text-sm text-gray-400 dark:text-gray-500'>{t('none_vaccinations')}</p>
        )}
        {(ajout || edition) && (
          <FormulaireVaccination
            initial={edition ?? undefined}
            onSave={async (data) => {
              if (edition) {
                await modifierVaccination({ id: edition.id, ...data })
              } else {
                await ajouterVaccination({ ...data, enfantId })
              }
              onRefetch()
              setAjout(false)
              setEdition(null)
            }}
            onCancel={() => { setAjout(false); setEdition(null) }}
          />
        )}
        {!ajout && !edition && (
          <BoutonAjouter onClick={() => setAjout(true)} label={t('add_vaccination')} />
        )}
      </div>
    </Section>
  )
}

function FormulaireVaccination({
  initial, onSave, onCancel,
}: {
  initial?: Vaccination
  onSave: (data: { vaccin: string; dateDernierDose: string; prochainRappel?: string | null; notes?: string | null }) => Promise<void>
  onCancel: () => void
}) {
  const { t } = useTranslation('dossier')
  const [vaccin, setVaccin] = useState(initial?.vaccin ?? '')
  const [dateDernierDose, setDateDernierDose] = useState(dateVersInput(initial?.dateDernierDose as Date | null))
  const [prochainRappel, setProchainRappel] = useState(dateVersInput(initial?.prochainRappel as Date | null))
  const [notes, setNotes] = useState(initial?.notes ?? '')
  const [enCours, setEnCours] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnCours(true)
    try {
      await onSave({
        vaccin,
        dateDernierDose,
        prochainRappel: prochainRappel || null,
        notes: notes || null,
      })
    } finally {
      setEnCours(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3 rounded-lg border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-900/20'>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('vaccine_name')}</label>
          <input type='text' value={vaccin} onChange={(e) => setVaccin(e.target.value)} required placeholder={t('vaccine_placeholder')} className={inputClass} />
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('last_dose')}</label>
          <input type='date' value={dateDernierDose} onChange={(e) => setDateDernierDose(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('next_reminder')}</label>
          <input type='date' value={prochainRappel} onChange={(e) => setProchainRappel(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className='mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300'>{t('notes', { ns: 'common' })}</label>
          <input type='text' value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t('lot_placeholder')} className={inputClass} />
        </div>
      </div>
      <BoutonsSauvegarderAnnuler enCours={enCours} onCancel={onCancel} />
    </form>
  )
}

// ─── Petits composants réutilisables ──────────────────────────────────────────

function BoutonsEdition({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const { t } = useTranslation('common')
  return (
    <div className='ml-4 flex shrink-0 items-center gap-1'>
      <button
        onClick={onEdit}
        className='rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300'
        title={t('edit')}
      >
        <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' />
        </svg>
      </button>
      <button
        onClick={onDelete}
        className='rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400'
        title={t('delete')}
      >
        <svg className='h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
        </svg>
      </button>
    </div>
  )
}

function BoutonAjouter({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className='flex items-center gap-1.5 text-sm text-cyan-600 hover:text-cyan-800 dark:text-cyan-400 dark:hover:text-cyan-300'
    >
      <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
      </svg>
      {label}
    </button>
  )
}

function BoutonsSauvegarderAnnuler({ enCours, onCancel }: { enCours: boolean; onCancel: () => void }) {
  const { t } = useTranslation('common')
  return (
    <div className='flex gap-2'>
      <button
        type='submit'
        disabled={enCours}
        className='rounded-lg bg-cyan-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50'
      >
        {enCours ? t('saving') : t('save')}
      </button>
      <button
        type='button'
        onClick={onCancel}
        className='rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
      >
        {t('cancel')}
      </button>
    </div>
  )
}

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
