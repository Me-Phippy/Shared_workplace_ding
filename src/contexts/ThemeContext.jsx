import React, { createContext, useContext, useReducer, useEffect } from 'react'

const ThemeContext = createContext()

const themes = {
  light: {
    name: 'Light',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      restaurant: '#DC2626',
      takeaway: '#059669',
      cafe: '#7C2D12'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      primary: '#60A5FA',
      secondary: '#34D399',
      accent: '#FBBF24',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textSecondary: '#9CA3AF',
      border: '#374151',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      restaurant: '#F87171',
      takeaway: '#6EE7B7',
      cafe: '#FDBA74'
    }
  },
  highContrast: {
    name: 'High Contrast',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#FFFF00',
      background: '#FFFFFF',
      surface: '#F0F0F0',
      text: '#000000',
      textSecondary: '#333333',
      border: '#000000',
      success: '#008000',
      warning: '#FF8000',
      error: '#FF0000',
      restaurant: '#800000',
      takeaway: '#008000',
      cafe: '#8B4513'
    }
  },
  foodie: {
    name: 'Foodie',
    colors: {
      primary: '#DC2626',
      secondary: '#059669',
      accent: '#D97706',
      background: '#FEF7ED',
      surface: '#FFF7ED',
      text: '#7C2D12',
      textSecondary: '#A16207',
      border: '#FED7AA',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      restaurant: '#DC2626',
      takeaway: '#059669',
      cafe: '#92400E'
    }
  }
}

const fontSizes = {
  small: { base: '14px', scale: 0.875 },
  medium: { base: '16px', scale: 1 },
  large: { base: '18px', scale: 1.125 },
  extraLarge: { base: '20px', scale: 1.25 }
}

const layouts = {
  'map-left': { name: 'Map Left', mapPosition: 'left', listPosition: 'right' },
  'map-right': { name: 'Map Right', mapPosition: 'right', listPosition: 'left' },
  'map-top': { name: 'Map Top', mapPosition: 'top', listPosition: 'bottom' },
  'fullscreen-map': { name: 'Fullscreen Map', mapPosition: 'fullscreen', listPosition: 'overlay' }
}

const initialState = {
  theme: 'light',
  fontSize: 'medium',
  layout: 'map-left',
  language: 'de-CH',
  currency: 'CHF',
  dateFormat: 'DD.MM.YYYY',
  timeFormat: '24h',
  autoLocation: true,
  notifications: true,
  reducedMotion: false,
  widgets: {
    favorites: { visible: true, position: 0 },
    recentSearches: { visible: true, position: 1 },
    quickFilters: { visible: true, position: 2 }
  }
}

function themeReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_FONT_SIZE':
      return { ...state, fontSize: action.payload }
    case 'SET_LAYOUT':
      return { ...state, layout: action.payload }
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload }
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload }
    case 'SET_DATE_FORMAT':
      return { ...state, dateFormat: action.payload }
    case 'SET_TIME_FORMAT':
      return { ...state, timeFormat: action.payload }
    case 'TOGGLE_AUTO_LOCATION':
      return { ...state, autoLocation: !state.autoLocation }
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications }
    case 'TOGGLE_REDUCED_MOTION':
      return { ...state, reducedMotion: !state.reducedMotion }
    case 'UPDATE_WIDGET':
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.id]: { ...state.widgets[action.payload.id], ...action.payload.updates }
        }
      }
    case 'LOAD_PREFERENCES':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('restaurantFinderPreferences')
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences)
        dispatch({ type: 'LOAD_PREFERENCES', payload: preferences })
      } catch (error) {
        console.error('Failed to load preferences:', error)
      }
    }
  }, [])

  // Save preferences to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('restaurantFinderPreferences', JSON.stringify(state))
  }, [state])

  // Apply CSS custom properties when theme or fontSize changes
  useEffect(() => {
    const root = document.documentElement
    const currentTheme = themes[state.theme]
    const currentFontSize = fontSizes[state.fontSize]

    // Apply theme colors
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    // Apply font size
    root.style.setProperty('--font-size-base', currentFontSize.base)
    root.style.setProperty('--font-scale', currentFontSize.scale)

    // Apply reduced motion preference
    if (state.reducedMotion) {
      root.style.setProperty('--animation-duration', '0s')
      root.style.setProperty('--transition-duration', '0s')
    } else {
      root.style.setProperty('--animation-duration', '0.3s')
      root.style.setProperty('--transition-duration', '0.2s')
    }
  }, [state.theme, state.fontSize, state.reducedMotion])

  const value = {
    ...state,
    themes,
    fontSizes,
    layouts,
    dispatch,
    currentTheme: themes[state.theme],
    currentFontSize: fontSizes[state.fontSize],
    currentLayout: layouts[state.layout]
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}