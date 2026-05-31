type RevealCallback = () => void

const callbacks = new Map<Element, RevealCallback>()

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: '0px 0px -6% 0px',
}

let observer: IntersectionObserver | null = null

function getObserver(): IntersectionObserver | null {
  if (typeof window === 'undefined') return null
  if (!observer) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const cb = callbacks.get(entry.target)
        if (!cb) continue
        cb()
        callbacks.delete(entry.target)
        observer!.unobserve(entry.target)
      }
    }, OBSERVER_OPTIONS)
  }
  return observer
}

/** Observe an element once — shares a single IntersectionObserver across all Reveal instances. */
export function observeRevealOnce(el: Element, cb: RevealCallback): () => void {
  const obs = getObserver()
  if (!obs) return () => {}

  callbacks.set(el, cb)
  obs.observe(el)

  return () => {
    callbacks.delete(el)
    obs.unobserve(el)
  }
}
