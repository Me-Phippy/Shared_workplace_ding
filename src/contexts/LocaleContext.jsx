import React, { createContext, useContext, useState, useEffect } from 'react'

const LocaleContext = createContext()

const translations = {
  'de-CH': {
    // Navigation
    'nav.restaurants': 'Restaurants',
    'nav.map': 'Karte',
    'nav.list': 'Liste',
    'nav.favorites': 'Favoriten',
    'nav.settings': 'Einstellungen',
    
    // Restaurant types
    'type.restaurant': 'Restaurant',
    'type.takeaway': 'Takeaway',
    'type.cafe': 'Café',
    
    // Status
    'status.open': 'Geöffnet',
    'status.closed': 'Geschlossen',
    'status.online': 'Live',
    'status.offline': 'Offline',
    
    // Actions
    'action.viewMenu': 'Speisekarte anzeigen',
    'action.addFavorite': 'Zu Favoriten hinzufügen',
    'action.removeFavorite': 'Aus Favoriten entfernen',
    'action.share': 'Teilen',
    'action.directions': 'Route',
    'action.call': 'Anrufen',
    
    // Filters
    'filter.all': 'Alle',
    'filter.cuisine': 'Küche',
    'filter.type': 'Typ',
    'filter.delivery': 'Lieferung',
    'filter.takeaway': 'Abholung',
    'filter.priceRange': 'Preisklasse',
    
    // Cuisines
    'cuisine.italian': 'Italienisch',
    'cuisine.japanese': 'Japanisch',
    'cuisine.american': 'Amerikanisch',
    'cuisine.thai': 'Thailändisch',
    'cuisine.turkish': 'Türkisch',
    'cuisine.international': 'International',
    
    // Price ranges
    'price.cheap': 'Günstig',
    'price.moderate': 'Mittel',
    'price.expensive': 'Gehoben',
    'price.luxury': 'Luxus',
    
    // Settings
    'settings.theme': 'Design',
    'settings.fontSize': 'Schriftgrösse',
    'settings.language': 'Sprache',
    'settings.layout': 'Layout',
    'settings.notifications': 'Benachrichtigungen',
    'settings.location': 'Standort',
    
    // Common
    'common.loading': 'Lädt...',
    'common.error': 'Fehler',
    'common.retry': 'Erneut versuchen',
    'common.close': 'Schliessen',
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.search': 'Suchen',
    'common.rating': 'Bewertung',
    'common.phone': 'Telefon',
    'common.hours': 'Öffnungszeiten'
  },
  'en': {
    // Navigation
    'nav.restaurants': 'Restaurants',
    'nav.map': 'Map',
    'nav.list': 'List',
    'nav.favorites': 'Favorites',
    'nav.settings': 'Settings',
    
    // Restaurant types
    'type.restaurant': 'Restaurant',
    'type.takeaway': 'Takeaway',
    'type.cafe': 'Café',
    
    // Status
    'status.open': 'Open',
    'status.closed': 'Closed',
    'status.online': 'Live',
    'status.offline': 'Offline',
    
    // Actions
    'action.viewMenu': 'View Menu',
    'action.addFavorite': 'Add to Favorites',
    'action.removeFavorite': 'Remove from Favorites',
    'action.share': 'Share',
    'action.directions': 'Directions',
    'action.call': 'Call',
    
    // Filters
    'filter.all': 'All',
    'filter.cuisine': 'Cuisine',
    'filter.type': 'Type',
    'filter.delivery': 'Delivery',
    'filter.takeaway': 'Takeaway',
    'filter.priceRange': 'Price Range',
    
    // Cuisines
    'cuisine.italian': 'Italian',
    'cuisine.japanese': 'Japanese',
    'cuisine.american': 'American',
    'cuisine.thai': 'Thai',
    'cuisine.turkish': 'Turkish',
    'cuisine.international': 'International',
    
    // Price ranges
    'price.cheap': 'Budget',
    'price.moderate': 'Moderate',
    'price.expensive': 'Upscale',
    'price.luxury': 'Luxury',
    
    // Settings
    'settings.theme': 'Theme',
    'settings.fontSize': 'Font Size',
    'settings.language': 'Language',
    'settings.layout': 'Layout',
    'settings.notifications': 'Notifications',
    'settings.location': 'Location',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.search': 'Search',
    'common.rating': 'Rating',
    'common.phone': 'Phone',
    'common.hours': 'Hours'
  }
}

const currencies = {
  'CHF': { symbol: 'CHF', position: 'after', decimals: 2 },
  'EUR': { symbol: '€', position: 'after', decimals: 2 },
  'USD': { symbol: '$', position: 'before', decimals: 2 }
}

const dateFormats = {
  'DD.MM.YYYY': { format: 'DD.MM.YYYY', separator: '.' },
  'MM/DD/YYYY': { format: 'MM/DD/YYYY', separator: '/' },
  'YYYY-MM-DD': { format: 'YYYY-MM-DD', separator: '-' }
}

export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('de-CH')
  const [currency, setCurrency] = useState('CHF')
  const [dateFormat, setDateFormat] = useState('DD.MM.YYYY')
  const [timeFormat, setTimeFormat] = useState('24h')

  const t = (key, params = {}) => {
    let translation = translations[locale]?.[key] || translations['en']?.[key] || key
    
    // Replace parameters in translation
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`{{${param}}}`, value)
    })
    
    return translation
  }

  const formatCurrency = (amount) => {
    const currencyConfig = currencies[currency]
    const formatted = amount.toFixed(currencyConfig.decimals)
    
    if (currencyConfig.position === 'before') {
      return `${currencyConfig.symbol}${formatted}`
    } else {
      return `${formatted} ${currencyConfig.symbol}`
    }
  }

  const formatDate = (date) => {
    const d = new Date(date)
    const format = dateFormats[dateFormat]
    
    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear()
    
    return format.format
      .replace('DD', day)
      .replace('MM', month)
      .replace('YYYY', year)
  }

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':')
    const hour24 = parseInt(hours)
    
    if (timeFormat === '12h') {
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
      const ampm = hour24 >= 12 ? 'PM' : 'AM'
      return `${hour12}:${minutes} ${ampm}`
    } else {
      return `${hours}:${minutes}`
    }
  }

  const value = {
    locale,
    setLocale,
    currency,
    setCurrency,
    dateFormat,
    setDateFormat,
    timeFormat,
    setTimeFormat,
    t,
    formatCurrency,
    formatDate,
    formatTime,
    availableLocales: Object.keys(translations),
    availableCurrencies: Object.keys(currencies),
    availableDateFormats: Object.keys(dateFormats)
  }

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}