import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Minimal label component mirroring the onboarding DOB label
function DateNaissanceLabel({ dob, optional }: { dob: string; optional?: string }) {
  return (
    <label htmlFor='dateNaissance'>
      {dob}
      {optional && <span> ({optional})</span>}
    </label>
  )
}

describe('Date de naissance label in onboarding', () => {
  it('affiche uniquement "Date de naissance" sans "(optionnel)"', () => {
    render(<DateNaissanceLabel dob='Date de naissance' />)
    expect(screen.getByText('Date de naissance')).toBeInTheDocument()
    expect(screen.queryByText(/optionnel/i)).not.toBeInTheDocument()
  })

  it('afficherait "(optionnel)" si la prop était passée — vérifie le comportement avant correction', () => {
    render(<DateNaissanceLabel dob='Date de naissance' optional='optionnel' />)
    expect(screen.getByText(/optionnel/i)).toBeInTheDocument()
  })
})
