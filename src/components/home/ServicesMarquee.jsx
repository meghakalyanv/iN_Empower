import KalamkariIcon from '../KalamkariIcon'
import { useHomeText } from '../../i18n/homeText'

const ICONS = [
  ['Contact', '#213361'], ['Building', '#E87A5D'], ['Car', '#D4A373'], ['Rocket', '#8B2127'],
  ['Landmark', '#2F5233'], ['Scale', '#8B5A2B'], ['ScrollText', '#E87A5D'], ['GraduationCap', '#213361'],
  ['CarFront', '#D4A373'], ['ChefHat', '#8B5A2B'], ['Mountain', '#8B2127'], ['Box', '#2F5233'],
  ['Truck', '#8B5A2B'], ['Utensils', '#2F5233'],
]
// The same order as the names: each one's Etikoppaka toy (owner, 30 Oct 2026)
const TOYS = ['groups/identity', 'groups/revenue', 'groups/rto', 'groups/startup', 'groups/municipal', 'groups/court', 'groups/mro',
  'groups/education', 'groups/drivers', 'services/professional-chef-services', 'supplies/granite', 'supplies/sand', 'groups/logistics', 'supplies/catering']

export default function ServicesMarquee() {
  const H = useHomeText()
  const services = H.marquee.map((name, i) => ({ name, icon: ICONS[i][0], iconColor: ICONS[i][1] }))
  const marqueeItems = [...services, ...services]

  return (
    <div className="services-marquee">
      <div className="services-marquee__track">
        {marqueeItems.map((svc, i) => (
          <div className="services-marquee__item" key={i}>
            <div className="services-marquee__icon" style={{ display: 'flex', alignItems: 'center' }}>
              {TOYS[i % TOYS.length]
                ? <img src={`/images/toys/${TOYS[i % TOYS.length]}.png`} alt="" width={44} height={44} style={{ width: 44, height: 44, objectFit: 'contain' }} />
                : <KalamkariIcon iconName={svc.icon} iconColor={svc.iconColor} size={40} />}
            </div>
            <span className="services-marquee__name">{svc.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
