import React from 'react'
import { useLocale } from '../../contexts/LocaleContext'

const TabNavigation = ({ activeTab, setActiveTab, restaurantCount }) => {
  const { t } = useLocale()

  const tabs = [
    { id: 'map', icon: '🗺️', label: t('nav.map') },
    { id: 'list', icon: '📋', label: t('nav.list') },
    { id: 'favorites', icon: '❤️', label: t('nav.favorites') }
  ]

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg
                  transition-all duration-200 border-b-2
                  ${activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-600">
            {restaurantCount} {restaurantCount === 1 ? 'Restaurant' : 'Restaurants'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TabNavigation