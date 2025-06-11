import React, { createContext, useContext, useState, useEffect } from 'react'

const UserPreferencesContext = createContext()

export function UserPreferencesProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [defaultLocation, setDefaultLocation] = useState({ lat: 47.3769, lng: 8.5417 })
  const [searchRadius, setSearchRadius] = useState(5) // km
  const [quickFilters, setQuickFilters] = useState(['italienisch', 'delivery'])

  // Load preferences from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('restaurantFinder_favorites')
    const savedSearches = localStorage.getItem('restaurantFinder_recentSearches')
    const savedLocation = localStorage.getItem('restaurantFinder_defaultLocation')
    const savedRadius = localStorage.getItem('restaurantFinder_searchRadius')
    const savedFilters = localStorage.getItem('restaurantFinder_quickFilters')

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Failed to load favorites:', error)
      }
    }

    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches))
      } catch (error) {
        console.error('Failed to load recent searches:', error)
      }
    }

    if (savedLocation) {
      try {
        setDefaultLocation(JSON.parse(savedLocation))
      } catch (error) {
        console.error('Failed to load default location:', error)
      }
    }

    if (savedRadius) {
      setSearchRadius(parseInt(savedRadius))
    }

    if (savedFilters) {
      try {
        setQuickFilters(JSON.parse(savedFilters))
      } catch (error) {
        console.error('Failed to load quick filters:', error)
      }
    }
  }, [])

  // Save to localStorage when preferences change
  useEffect(() => {
    localStorage.setItem('restaurantFinder_favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('restaurantFinder_recentSearches', JSON.stringify(recentSearches))
  }, [recentSearches])

  useEffect(() => {
    localStorage.setItem('restaurantFinder_defaultLocation', JSON.stringify(defaultLocation))
  }, [defaultLocation])

  useEffect(() => {
    localStorage.setItem('restaurantFinder_searchRadius', searchRadius.toString())
  }, [searchRadius])

  useEffect(() => {
    localStorage.setItem('restaurantFinder_quickFilters', JSON.stringify(quickFilters))
  }, [quickFilters])

  const addToFavorites = (restaurant) => {
    setFavorites(prev => {
      if (prev.find(fav => fav.id === restaurant.id)) {
        return prev // Already in favorites
      }
      return [...prev, { ...restaurant, addedAt: new Date().toISOString() }]
    })
  }

  const removeFromFavorites = (restaurantId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== restaurantId))
  }

  const isFavorite = (restaurantId) => {
    return favorites.some(fav => fav.id === restaurantId)
  }

  const addToRecentSearches = (searchTerm) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(search => search.term !== searchTerm)
      const newSearch = { term: searchTerm, timestamp: new Date().toISOString() }
      return [newSearch, ...filtered].slice(0, 10) // Keep only last 10 searches
    })
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  const updateQuickFilters = (filters) => {
    setQuickFilters(filters)
  }

  const value = {
    favorites,
    recentSearches,
    defaultLocation,
    searchRadius,
    quickFilters,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToRecentSearches,
    clearRecentSearches,
    setDefaultLocation,
    setSearchRadius,
    updateQuickFilters
  }

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext)
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider')
  }
  return context
}