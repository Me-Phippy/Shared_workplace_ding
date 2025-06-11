import React, { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { useLocale } from '../../contexts/LocaleContext'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const { t } = useLocale()
  const { favorites, recentSearches, quickFilters } = useUserPreferences()

  const tabs = [
    { id: 'filters', icon: '🔍', label: t('nav.filters') },
    { id: 'favorites', icon: '❤️', label: t('nav.favorites') },
    { id: 'recent', icon: '🕒', label: 'Recent' },
    { id: 'settings', icon: '⚙️', label: t('nav.settings') }
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:shadow-none lg:border-r
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 px-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg mb-1">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'filters' && <FiltersTab />}
            {activeTab === 'favorites' && <FavoritesTab favorites={favorites} />}
            {activeTab === 'recent' && <RecentTab searches={recentSearches} />}
            {activeTab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </>
  )
}

const FiltersTab = () => {
  const { t } = useLocale()
  const { quickFilters, updateQuickFilters } = useUserPreferences()

  const cuisineOptions = [
    'italienisch', 'japanisch', 'amerikanisch', 'thailändisch', 'türkisch', 'international'
  ]

  const typeOptions = ['restaurant', 'takeaway', 'cafe']

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">{t('filter.cuisine')}</h3>
        <div className="space-y-2">
          {cuisineOptions.map(cuisine => (
            <label key={cuisine} className="flex items-center">
              <input
                type="checkbox"
                checked={quickFilters.includes(cuisine)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateQuickFilters([...quickFilters, cuisine])
                  } else {
                    updateQuickFilters(quickFilters.filter(f => f !== cuisine))
                  }
                }}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {t(`cuisine.${cuisine}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">{t('filter.type')}</h3>
        <div className="space-y-2">
          {typeOptions.map(type => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {t(`type.${type}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Services</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-700">{t('filter.delivery')}</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
            <span className="ml-2 text-sm text-gray-700">{t('filter.takeaway')}</span>
          </label>
        </div>
      </div>
    </div>
  )
}

const FavoritesTab = ({ favorites }) => {
  const { t } = useLocale()
  const { removeFromFavorites } = useUserPreferences()

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">{t('nav.favorites')}</h3>
      {favorites.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-2 block">❤️</span>
          <p className="text-sm">No favorites yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map(restaurant => (
            <div key={restaurant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{restaurant.name}</h4>
                <p className="text-sm text-gray-600 capitalize">{restaurant.cuisine}</p>
              </div>
              <button
                onClick={() => removeFromFavorites(restaurant.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const RecentTab = ({ searches }) => {
  const { clearRecentSearches } = useUserPreferences()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Recent Searches</h3>
        {searches.length > 0 && (
          <button
            onClick={clearRecentSearches}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Clear All
          </button>
        )}
      </div>
      {searches.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-2 block">🕒</span>
          <p className="text-sm">No recent searches</p>
        </div>
      ) : (
        <div className="space-y-2">
          {searches.map((search, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
              {search.term}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const SettingsTab = () => {
  const { t } = useLocale()
  const { 
    theme, fontSize, layout, language, currency, dateFormat, timeFormat,
    themes, fontSizes, layouts, dispatch
  } = useTheme()
  const { locale, setLocale, setCurrency, setDateFormat, setTimeFormat } = useLocale()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">{t('settings.theme')}</h3>
        <select
          value={theme}
          onChange={(e) => dispatch({ type: 'SET_THEME', payload: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(themes).map(([key, theme]) => (
            <option key={key} value={key}>{theme.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">{t('settings.fontSize')}</h3>
        <select
          value={fontSize}
          onChange={(e) => dispatch({ type: 'SET_FONT_SIZE', payload: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(fontSizes).map(([key, size]) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)} ({size.base})
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">{t('settings.layout')}</h3>
        <select
          value={layout}
          onChange={(e) => dispatch({ type: 'SET_LAYOUT', payload: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(layouts).map(([key, layout]) => (
            <option key={key} value={key}>{layout.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">{t('settings.language')}</h3>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="de-CH">Deutsch (Schweiz)</option>
          <option value="en">English</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Currency</h3>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="CHF">Swiss Franc (CHF)</option>
          <option value="EUR">Euro (€)</option>
          <option value="USD">US Dollar ($)</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Date Format</h3>
        <select
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="DD.MM.YYYY">DD.MM.YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Time Format</h3>
        <select
          value={timeFormat}
          onChange={(e) => setTimeFormat(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="24h">24 Hour</option>
          <option value="12h">12 Hour (AM/PM)</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={!language.reducedMotion}
            onChange={() => dispatch({ type: 'TOGGLE_REDUCED_MOTION' })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Animations</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={language.notifications}
            onChange={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">{t('settings.notifications')}</span>
        </label>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={language.autoLocation}
            onChange={() => dispatch({ type: 'TOGGLE_AUTO_LOCATION' })}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Auto-detect Location</span>
        </label>
      </div>
    </div>
  )
}

export default Sidebar