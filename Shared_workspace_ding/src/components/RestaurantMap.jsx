import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RestaurantMap = ({ restaurants, selectedRestaurant, setSelectedRestaurant }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Center on Zürich
      mapInstanceRef.current = L.map(mapRef.current).setView([47.3769, 8.5417], 13)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update markers when restaurants change
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // Add new markers
    restaurants.forEach(restaurant => {
      const { lat, lng, name, type, cuisine, rating, priceRange, isOpen } = restaurant
      
      // Choose marker color based on restaurant type and status
      let markerColor = '#10B981' // green for open
      if (!isOpen) markerColor = '#6B7280' // gray for closed

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            background-color: ${markerColor};
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            color: white;
            font-weight: bold;
          ">
            ${getTypeIcon(type)}
          </div>
        `,        iconSize: [36, 36],
        iconAnchor: [18, 18]
      })

      const marker = L.marker([lat, lng], { icon: customIcon })
        .bindPopup(`
          <div class="p-3 min-w-48">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-base">${name}</h3>
              <span class="text-xs px-2 py-1 rounded-full ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                ${isOpen ? 'Offen' : 'Geschlossen'}
              </span>
            </div>
            <div class="text-sm text-gray-600 mb-2">${cuisine} • ${priceRange} • ${rating} ⭐</div>
            <div class="flex gap-1 text-xs mb-3">
              ${restaurant.delivery ? '<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">🚚</span>' : ''}
              ${restaurant.takeaway ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded">🥡</span>' : ''}
            </div>
            <button class="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors menu-btn text-sm" 
                    data-restaurant-id="${restaurant.id}">
              Speisekarte anzeigen
            </button>
          </div>
        `)
        .addTo(mapInstanceRef.current)

      // Add click event to marker
      marker.on('click', () => {
        setSelectedRestaurant(restaurant)
      })

      markersRef.current.push(marker)
    })

    // Add click event listener for popup buttons
    setTimeout(() => {
      document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          const restaurantId = parseInt(e.target.dataset.restaurantId)
          const restaurant = restaurants.find(r => r.id === restaurantId)
          if (restaurant) {
            setSelectedRestaurant(restaurant)
          }
        })
      })
    }, 100)

  }, [restaurants, setSelectedRestaurant])

  const getTypeIcon = (type) => {
    switch (type) {
      case 'restaurant': return '🍽️'
      case 'takeaway': return '🥡'
      case 'cafe': return '☕'
      default: return '🏪'
    }
  }
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-3 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">🗺️ Karte</h2>
        <p className="text-sm text-gray-600">
          {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''} • Klicke auf einen Marker für Details
        </p>
      </div>
      <div 
        ref={mapRef} 
        className="h-96 w-full"
        style={{ minHeight: '500px' }}
      />
    </div>
  )
}

export default RestaurantMap
