import { useState, useEffect } from 'react'
import RestaurantMap from './components/RestaurantMap'
import RestaurantList from './components/RestaurantList'
import MenuModal from './components/MenuModal'
import Header from './components/Header'
import './App.css'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [viewMode, setViewMode] = useState('map') // 'map' or 'list'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wsConnection, setWsConnection] = useState(null)
  const [filters, setFilters] = useState({
    cuisine: '',
    type: '',
    delivery: false
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
      setError('Fehler beim Laden der Restaurants: ' + err.message)
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
        // Try to reconnect after 3 seconds
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Restaurants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode}
        connectionStatus={wsConnection ? 'connected' : 'disconnected'}
        filters={filters}
        setFilters={setFilters}
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

      <main className="container mx-auto px-4 py-6">
        {viewMode === 'map' ? (
          <RestaurantMap 
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            setSelectedRestaurant={setSelectedRestaurant}
          />
        ) : (
          <RestaurantList 
            restaurants={restaurants}
            selectedRestaurant={selectedRestaurant}
            setSelectedRestaurant={setSelectedRestaurant}
          />
        )}
        
        {selectedRestaurant && (
          <MenuModal 
            restaurant={selectedRestaurant}
            onClose={() => setSelectedRestaurant(null)}
          />
        )}
      </main>
    </div>
  )
}

export default App
