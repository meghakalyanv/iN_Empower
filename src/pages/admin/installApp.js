// Makes /admin installable as a phone app ("iN Team" on the home screen).
let deferredPrompt = null
const listeners = new Set()
const notify = () => listeners.forEach((fn) => fn(!!deferredPrompt))

export function setupAdminApp() {
  if (typeof document === 'undefined') return
  if (!document.querySelector('link[rel="manifest"][href="/admin.webmanifest"]')) {
    const link = document.createElement('link'); link.rel = 'manifest'; link.href = '/admin.webmanifest'
    document.head.appendChild(link)
    const apple = document.createElement('link'); apple.rel = 'apple-touch-icon'; apple.href = '/admin-icon-192.png'
    document.head.appendChild(apple)
  }
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' }).catch(() => {})
  }
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; notify() })
  window.addEventListener('appinstalled', () => { deferredPrompt = null; notify() })
}

export const canInstall = () => !!deferredPrompt
export const isInstalled = () => typeof window !== 'undefined' && (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true)
export function onInstallChange(fn) { listeners.add(fn); return () => listeners.delete(fn) }
export async function installNow() {
  if (!deferredPrompt) return false
  deferredPrompt.prompt()
  const r = await deferredPrompt.userChoice.catch(() => null)
  deferredPrompt = null; notify()
  return r?.outcome === 'accepted'
}
