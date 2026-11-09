import React from 'react'
import LegalPage from '../components/LegalPage'
import { TERMS } from '../data/legalText'

export default function TermsOfService() {
  return <LegalPage doc={TERMS} />
}
