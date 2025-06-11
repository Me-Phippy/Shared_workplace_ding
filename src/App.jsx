import { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { LocaleProvider } from './contexts/LocaleContext'
import { UserPreferencesProvider } from './contexts/UserPreferencesContext'
import RestaurantMap from './components/RestaurantMap'
import EnhancedRestaurantList from './components/Enhanced/EnhancedRestaurantList'
import EnhancedMenuModal from './components/Enhanced/EnhancedMenuModal'
import EnhancedHeader from './components/Enhanced/EnhancedHeader'
import Sidebar from './components/Layout/Sidebar'
import TabNavigation from './components/Layout/TabNavigation'
import FloatingActionButton from './components/Layout/FloatingActionButton'
import FavoritesWidget from './components/Widgets/FavoritesWidget'
import QuickFiltersWidget from './components/Widgets/QuickFiltersWidget'
import RecentSearchesWidget from './components/Widgets/RecentSearchesWidget'
import './App.css'

function AppContent() {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [activeTab, setActiveTab] = useState('map') // 'map', 'list', 'favorites'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarTab, setSidebarTab] = useState('filters')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wsConnection, setWsConnection] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    cuisine: '',
    type: '',
    delivery: false,
    takeaway: false
  })

  // Fetch initial data
  useEffect(() => {
    fetchRestaurants()
    setupWebSocket()
    
    return () => {
      if (wsConnection) {
        wsConnection.close()
      }
    }
  }, [])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (filters.cuisine) queryParams.append('cuisine', filters.cuisine)
      if (filters.type) queryParams.append('type', filters.type)
      if (filters.delivery) queryParams.append('delivery', 'true')
      
      const response = await fetch(`http://localhost:3001/api/restaurants?${queryParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants')
      }
      const data = await response.json()
      setRestaurants(data)
      setError(null)
    } catch (err) {
      setError('Error loading restaurants: ' + err.message)
      console.error('Error fetching restaurants:', err)
    } finally {
      setLoading(false)
    }
  }

  const setupWebSocket = () => {
    try {
      const ws = new WebSocket('ws://localhost:3001')
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setWsConnection(ws)
      }
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        
        switch (message.type) {
          case 'initial_data':
            setRestaurants(message.data)
            break
            
          case 'status_update':
            setRestaurants(prev => prev.map(restaurant => 
              restaurant.id === message.data.id ? message.data : restaurant
            ))
            break
            
          case 'restaurant_added':
            setRestaurants(prev => [...prev, message.data])
            break
            
          default:
            console.log('Unknown message type:', message.type)
        }
      }
      
      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setWsConnection(null)
        setTimeout(() => {
          if (!wsConnection || wsConnection.readyState === WebSocket.CLOSED) {
            setupWebSocket()
          }
        }, 3000)
      }
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
      
    } catch (err) {
      console.error('Failed to setup WebSocket:', err)
    }
  }

  // Apply filters
  useEffect(() => {
    fetchRestaurants()
  }, [filters])

  const handleQuickFilter = () => {
    setSidebarOpen(true)
    setSidebarTab('filters')
  }

  const handleLocationCenter = () => {
    // Center map on user location or default location
    console.log('Center location')
  }

  const handleAddFavorite = () => {
    setSidebarOpen(true)
    setSidebarTab('favorites')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader 
        onSidebarToggle={() => setSidebarOpen(true)}
        connectionStatus={wsConnection ? 'connected' : 'disconnected'}
        filters={filters}
        setFilters={setFilters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-700 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <TabNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        restaurantCount={restaurants.length}
      />

      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={sidebarTab}
          setActiveTab={setSidebarTab}
        />
        
        <main className="flex-1 container mx-auto px-4 py-6">
          {activeTab === 'map' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <RestaurantMap 
                  restaurants={restaurants}
                  selectedRestaurant={selectedRestaurant}
                  setSelectedRestaurant={setSelectedRestaurant}
                />
              </div>
              <div className="space-y-6">
                <QuickFiltersWidget 
                  onFilterApply={setFilters}
                  activeFilters={filters}
                />
                <FavoritesWidget 
                  onRestaurantSelect={setSelectedRestaurant}
                />
                <RecentSearchesWidget 
                  onSearchSelect={setSearchTerm}
                />
              </div>
            </div>
          )}
          
          {activeTab === 'list' && (
            <EnhancedRestaurantList 
              restaurants={restaurants}
              selectedRestaurant={selectedRestaurant}
              setSelectedRestaurant={setSelectedRestaurant}
            />
          )}
          
          {activeTab === 'favorites' && (
            <FavoritesWidget 
              onRestaurantSelect={setSelectedRestaurant}
            />
          )}
        </main>
      </div>
      
      <FloatingActionButton 
        onQuickFilter={handleQuickFilter}
        onLocationCenter={handleLocationCenter}
        onAddFavorite={handleAddFavorite}
      />
      
      {selectedRestaurant && (
        <EnhancedMenuModal 
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <UserPreferencesProvider>
          <AppContent />
        </UserPreferencesProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}

export default App