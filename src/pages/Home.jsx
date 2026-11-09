import { useEffect } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import MobileHome from './MobileHome'
import HeroSection from '../components/HeroSection'
import TrustTicker from '../components/home/TrustTicker'
import StatsBar from '../components/StatsBar'
import ProblemSection from '../components/ProblemSection'
import SolutionSection from '../components/SolutionSection'
import AboutVisionMission from '../components/home/AboutVisionMission'
import HowItWorksJourney from '../components/home/HowItWorksJourney'
import ServicesMarquee from '../components/home/ServicesMarquee'
import ServiceCategoriesPreview from '../components/ServiceCategoriesPreview'
import SuppliesPreview from '../components/SuppliesPreview'
import PromoBanner from '../components/home/PromoBanner'
import CustomerSegments from '../components/home/CustomerSegments'
import VerificationAndEscrow from '../components/home/VerificationAndEscrow'
import AboutCoreValues from '../components/home/AboutCoreValues'
import FAQ from '../components/home/FAQ'
import CTABanner from '../components/CTABanner'
import { useHomeText } from '../i18n/homeText'
import { TourTips } from '../components/Tutorial'

export default function Home() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const H = useHomeText()

  useEffect(() => {
    document.title = H.pageTitle
  }, [H])

  if (isMobile) {
    return <MobileHome />
  }

  return (
    <>
      {/* Pointers (owner, 2 Nov 2026): start here, Chat Buddy */}
      <TourTips tips={[
        { id: 'web-home-explore', target: '.hero .hero-buttons .btn-primary', place: 'below' },
        { id: 'web-chat-fab', target: '#chatbuddy-fab', place: 'above' },
      ]} />
      <HeroSection />
      <TrustTicker />
      <ProblemSection />
      <SolutionSection />
      <AboutVisionMission />
      <HowItWorksJourney />
      <ServicesMarquee />
      <ServiceCategoriesPreview />
      <SuppliesPreview />
      <PromoBanner />
      <CustomerSegments />
      <VerificationAndEscrow />
      <AboutCoreValues />
      <FAQ />
      <CTABanner
        title={H.cta.title}
        titleHighlight={H.cta.hi}
        description={H.cta.text}
        buttonText={H.cta.btn}
      />
      <StatsBar />
    </>
  )
}
