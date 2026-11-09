import KalamkariIcon from './KalamkariIcon'
import { toyUrl } from '../utils/toyArt'

/**
 * A service's (or supply's) own Etikoppaka toy picture, the same as in the app (owner, 30 Oct 2026).
 * A photo path in `icon` wins; with no toy, the old line icon is drawn.
 */
export default function ToyIcon({ item, kind = 'service', size = 48, alt = '' }) {
  if (item?.icon && String(item.icon).startsWith('/')) {
    return <img loading="lazy" decoding="async" src={item.icon} alt={alt} style={{ width: size, height: size, objectFit: 'contain' }} />
  }
  const src = toyUrl(item, kind)
  if (src) {
    return <img loading="lazy" decoding="async" src={src} alt={alt} width={size} height={size} style={{ width: size, height: size, objectFit: 'contain', display: 'block' }} />
  }
  return <KalamkariIcon iconName={item?.icon} iconColor={item?.iconColor} size={size} />
}
