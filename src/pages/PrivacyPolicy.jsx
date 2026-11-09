import React from 'react'
import LegalPage from '../components/LegalPage'
import { PRIVACY } from '../data/legalText'

export default function PrivacyPolicy() {
  return <LegalPage doc={PRIVACY} />
}
