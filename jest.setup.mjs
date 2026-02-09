import '@testing-library/jest-dom'

if (typeof window !== 'undefined') {
  window.matchMedia = window.matchMedia ?? (() => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
    media: '',
    onchange: null,
  }))
}
