import React from 'react'
import { useUserPreferences } from '../../contexts/UserPreferencesContext'
import { useLocale } from '../../contexts/LocaleContext'

const QuickFiltersWidget = ({ onFilterApply, activeFilters }) => {
  const { quickFilters, updateQuickFilters } = useUserPreferences()
  const { t } = useLocale()

  const filterOptions = [
    { id: 'italienisch', label: t('cuisine.italian'), icon: '🍝' },
    { id: 'japanisch', label: t('cuisine.japanese'), icon: '🍣' },
    { id: 'amerikanisch', label: t('cuisine.american'), icon: '🍔' },
    { id: 'thailändisch', label: t('cuisine.thai'), icon: '🌶️' },
    { id: 'türkisch', label: t('cuisine.turkish'), icon: '🥙' },
    { id: 'delivery', label: t('filter.delivery'), icon: '🚚' },
    { id: 'takeaway', label: t('filter.takeaway'), icon: '🥡' }
  ]

  const toggleFilter = (filterId) => {
    const newFilters = { ...activeFilters }
    
    if (filterId === 'delivery' || filterId === 'takeaway') {
      newFilters[filterId] = !newFilters[filterId]
    } else {
      newFilters.cuisine = newFilters.cuisine === filterId ? '' : filterId
    }
    
    onFilterApply(newFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        <span className="mr-2">🔍</span>
        Quick Filters
      </h3>
      
      <div className="grid grid-cols-2 gap-2">
        {filterOptions.map(filter => {
          const isActive = filter.id === 'delivery' 
            ? activeFilters.delivery
            : filter.id === 'takeaway'
            ? activeFilters.takeaway
            : activeFilters.cuisine === filter.id

          return (
            <button
              key={filter.id}
              onClick={() => toggleFilter(filter.id)}
              className={`
                flex items-center space-x-2 p-2 rounded-lg text-sm font-medium
                transition-all duration-200 border
                ${isActive
                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }
              `}
            >
              <span>{filter.icon}</span>
              <span className="truncate">{filter.label}</span>
            </button>
          )
        })}
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <button
          onClick={() => onFilterApply({ cuisine: '', type: '', delivery: false, takeaway: false })}
          className="w-full text-sm text-gray-600 hover:text-gray-800 py-1"
        >
          Clear all filters
        </button>
      </div>
    </div>
  )
}

export default QuickFiltersWidget