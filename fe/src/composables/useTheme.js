import { ref, watch } from 'vue'

// Global state for theme
const isDark = ref(false)
let isInitialized = false

// Initialize theme immediately when module loads
const initializeTheme = () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // Fall back to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
    isInitialized = true
  }
}

// Initialize immediately
initializeTheme()

// Watch for theme changes and update the document class
watch(isDark, (newValue) => {
  if (typeof window !== 'undefined') {
    if (newValue) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Only save to localStorage if the theme has been initialized
    if (isInitialized) {
      localStorage.setItem('theme', newValue ? 'dark' : 'light')
    }
  }
}, { immediate: true })

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const setTheme = (dark) => {
    isDark.value = dark
  }

  return {
    isDark,
    toggleTheme,
    setTheme
  }
}