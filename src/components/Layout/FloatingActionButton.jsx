import React, { useState } from 'react'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { useLocale } from '../../contexts/LocaleContext'

const FloatingActionButton = ({ onQuickFilter, onLocationCenter, onAddFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useLocale()
  const { quickFilters } = useUserPreferences()

  const actions = [
    {
      id: 'location',
      icon: '📍',
      label: 'Center Location',
      onClick: onLocationCenter,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'filter',
      icon: '🔍',
      label: 'Quick Filter',
      onClick: onQuickFilter,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 'favorite',
      icon: '❤️',
      label: 'Add Favorite',
      onClick: onAddFavorite,
      color: 'bg-red-500 hover:bg-red-600'
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-30">
      {/* Action Buttons */}
      <div className={`flex flex-col space-y-3 mb-3 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`
              w-12 h-12 rounded-full text-white shadow-lg transition-all duration-200
              transform hover:scale-110 ${action.color}
              ${isExpanded ? 'delay-' + (index * 50) : ''}
            `}
            title={action.label}
          >
            <span className="text-lg">{action.icon}</span>
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg
          transition-all duration-300 transform hover:scale-110
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
      >
        <span className="text-xl">+</span>
      </button>
    </div>
  )
}

export default FloatingActionButton