import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage for restaurants
let restaurants = [
  {
    id: 1,
    name: "Pizzeria Bella Vista",
    lat: 47.3769,
    lng: 8.5417,
    type: "restaurant",
    cuisine: "italienisch",
    description: "Authentische italienische Küche mit frischen Zutaten",
    rating: 4.5,
    priceRange: "€€",
    phone: "+41 44 123 4567",
    hours: "11:00 - 23:00",
    isOpen: true,
    delivery: true,
    takeaway: true,
    menu: [
      { category: "Pizza", items: [
        { name: "Margherita", price: 18.50, description: "Tomatensauce, Mozzarella, frisches Basilikum" },
        { name: "Quattro Stagioni", price: 22.90, description: "Tomaten, Mozzarella, Schinken, Champignons, Artischocken, Oliven" },
        { name: "Prosciutto", price: 21.50, description: "Tomatensauce, Mozzarella, Parmaschinken, Rucola" }
      ]},
      { category: "Pasta", items: [
        { name: "Spaghetti Carbonara", price: 19.80, description: "Eier, Pancetta, Parmesan, schwarzer Pfeffer" },
        { name: "Penne Arrabbiata", price: 17.50, description: "Scharfe Tomatensauce mit Knoblauch und Chili" }
      ]},
      { category: "Getränke", items: [
        { name: "Coca Cola", price: 4.50, description: "0.33l" },
        { name: "Mineralwasser", price: 3.50, description: "0.5l" }
      ]}
    ]
  },
  {
    id: 2,
    name: "Sushi Tokyo",
    lat: 47.3667,
    lng: 8.5500,
    type: "restaurant",
    cuisine: "japanisch",
    description: "Frisches Sushi und traditionelle japanische Gerichte",
    rating: 4.7,
    priceRange: "€€€",
    phone: "+41 44 234 5678",
    hours: "17:00 - 22:30",
    isOpen: true,
    delivery: true,
    takeaway: true,
    menu: [
      { category: "Sushi", items: [
        { name: "Sake Nigiri", price: 6.50, description: "2 Stück Lachs Nigiri" },
        { name: "California Roll", price: 12.90, description: "8 Stück mit Lachs, Avocado, Gurke" },
        { name: "Rainbow Roll", price: 16.50, description: "8 Stück mit verschiedenen Fischsorten" }
      ]},
      { category: "Warme Gerichte", items: [
        { name: "Chicken Teriyaki", price: 22.50, description: "Gegrilltes Hähnchen mit Teriyaki-Sauce, Reis" },
        { name: "Ramen Tonkotsu", price: 18.90, description: "Schweinefleischbrühe mit Nudeln und Ei" }
      ]}
    ]
  },
  {
    id: 3,
    name: "Burger House",
    lat: 47.3784,
    lng: 8.5286,
    type: "takeaway",
    cuisine: "amerikanisch",
    description: "Saftige Burger und knusprige Pommes",
    rating: 4.2,
    priceRange: "€€",
    phone: "+41 44 345 6789",
    hours: "11:00 - 02:00",
    isOpen: true,
    delivery: true,
    takeaway: true,
    menu: [
      { category: "Burger", items: [
        { name: "Classic Cheeseburger", price: 14.90, description: "Rindfleisch, Cheddar, Salat, Tomate, Zwiebel" },
        { name: "BBQ Bacon Burger", price: 17.50, description: "Rindfleisch, Bacon, BBQ-Sauce, Zwiebeln" },
        { name: "Veggie Burger", price: 13.90, description: "Gemüse-Patty, Avocado, Sprossen" }
      ]},
      { category: "Beilagen", items: [
        { name: "Pommes Frites", price: 5.50, description: "Knusprige Kartoffelpommes" },
        { name: "Onion Rings", price: 6.90, description: "Panierte Zwiebelringe" }
      ]}
    ]
  },
  {
    id: 4,
    name: "Thai Garden",
    lat: 47.3741,
    lng: 8.5426,
    type: "restaurant",
    cuisine: "thailändisch",
    description: "Authentische thailändische Küche mit frischen Kräutern",
    rating: 4.4,
    priceRange: "€€",
    phone: "+41 44 456 7890",
    hours: "11:30 - 14:00, 17:30 - 22:00",
    isOpen: true,
    delivery: true,
    takeaway: true,
    menu: [
      { category: "Curry", items: [
        { name: "Green Curry", price: 19.50, description: "Grünes Curry mit Gemüse und Kokosmilch" },
        { name: "Massaman Curry", price: 21.90, description: "Mildes Curry mit Kartoffeln und Erdnüssen" }
      ]},
      { category: "Wok", items: [
        { name: "Pad Thai", price: 18.50, description: "Gebratene Reisnudeln mit Ei und Erdnüssen" },
        { name: "Tom Yum Suppe", price: 12.50, description: "Scharfe Garnelen-Suppe mit Zitronengras" }
      ]}
    ]
  },
  {
    id: 5,
    name: "Döner Sultan",
    lat: 47.3763,
    lng: 8.5485,
    type: "takeaway",
    cuisine: "türkisch",
    description: "Frischer Döner und türkische Spezialitäten",
    rating: 4.1,
    priceRange: "€",
    phone: "+41 44 567 8901",
    hours: "10:00 - 24:00",
    isOpen: true,
    delivery: true,
    takeaway: true,
    menu: [
      { category: "Döner", items: [
        { name: "Döner Kebab", price: 9.50, description: "Im Fladenbrot mit Salat und Sauce" },
        { name: "Döner Teller", price: 15.90, description: "Mit Reis, Salat und Sauce" },
        { name: "Dürüm", price: 10.50, description: "Im Wrap mit Salat und Sauce" }
      ]},
      { category: "Weitere Gerichte", items: [
        { name: "Lahmacun", price: 7.50, description: "Türkische Pizza mit Hackfleisch" },
        { name: "Pide", price: 12.90, description: "Türkisches Fladenbrot mit Käse" }
      ]}
    ]
  },
  {
    id: 6,
    name: "Café Central",
    lat: 47.3667,
    lng: 8.5444,
    type: "cafe",
    cuisine: "international",
    description: "Gemütliches Café mit hausgemachten Kuchen",
    rating: 4.3,
    priceRange: "€€",
    phone: "+41 44 678 9012",
    hours: "07:00 - 18:00",
    isOpen: true,
    delivery: false,
    takeaway: true,
    menu: [
      { category: "Getränke", items: [
        { name: "Espresso", price: 3.50, description: "Starker italienischer Kaffee" },
        { name: "Cappuccino", price: 4.80, description: "Mit aufgeschäumter Milch" },
        { name: "Chai Latte", price: 5.20, description: "Gewürztee mit Milch" }
      ]},
      { category: "Süßes", items: [
        { name: "Cheesecake", price: 6.90, description: "Hausgemachter New York Cheesecake" },
        { name: "Schokoladenkuchen", price: 5.50, description: "Saftiger Schokoladenkuchen" }
      ]},
      { category: "Snacks", items: [
        { name: "Panini", price: 8.90, description: "Gegrilltes Sandwich mit Mozzarella und Tomaten" },
        { name: "Bagel", price: 7.50, description: "Mit Lachs und Frischkäse" }
      ]}
    ]
  }
];

// WebSocket connection handling
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);
  
  // Send current restaurant data to new client
  ws.send(JSON.stringify({
    type: 'initial_data',
    data: restaurants
  }));

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Broadcast function to all connected clients
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Helper function to get price range symbol
function getPriceRangeText(priceRange) {
  switch (priceRange) {
    case '€': return 'Günstig'
    case '€€': return 'Mittel'
    case '€€€': return 'Gehoben'
    case '€€€€': return 'Luxus'
    default: return 'Unbekannt'
  }
}

// API Routes

// Get all restaurants
app.get('/api/restaurants', (req, res) => {
  const { cuisine, type, delivery } = req.query
  
  let filteredRestaurants = restaurants
  
  if (cuisine) {
    filteredRestaurants = filteredRestaurants.filter(r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase()))
  }
  
  if (type) {
    filteredRestaurants = filteredRestaurants.filter(r => r.type === type)
  }
  
  if (delivery === 'true') {
    filteredRestaurants = filteredRestaurants.filter(r => r.delivery === true)
  }
  
  res.json(filteredRestaurants);
});

// Get specific restaurant
app.get('/api/restaurants/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const restaurant = restaurants.find(r => r.id === id);
  
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  
  res.json(restaurant);
});

// Get restaurant menu
app.get('/api/restaurants/:id/menu', (req, res) => {
  const id = parseInt(req.params.id);
  const restaurant = restaurants.find(r => r.id === id);
  
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  
  res.json({
    restaurantName: restaurant.name,
    menu: restaurant.menu
  });
});

// Update restaurant status (open/closed)
app.patch('/api/restaurants/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { isOpen } = req.body;
  
  const restaurant = restaurants.find(r => r.id === id);
  
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  
  if (typeof isOpen !== 'boolean') {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  
  // Update the restaurant
  restaurant.isOpen = isOpen;
  restaurant.lastUpdated = new Date().toISOString();
  
  // Broadcast update to all connected clients
  broadcast({
    type: 'status_update',
    data: restaurant
  });
  
  res.json(restaurant);
});

// Add new restaurant (for future enhancement)
app.post('/api/restaurants', (req, res) => {
  const { name, lat, lng, type, cuisine, description, phone, hours } = req.body;
  
  if (!name || !lat || !lng || !type || !cuisine) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newRestaurant = {
    id: Math.max(...restaurants.map(r => r.id)) + 1,
    name,
    lat,
    lng,
    type,
    cuisine,
    description: description || '',
    rating: 0,
    priceRange: '€€',
    phone: phone || '',
    hours: hours || '',
    isOpen: true,
    delivery: false,
    takeaway: false,
    menu: [],
    createdAt: new Date().toISOString()
  };
  
  restaurants.push(newRestaurant);
  
  // Broadcast new restaurant to all clients
  broadcast({
    type: 'restaurant_added',
    data: newRestaurant
  });
  
  res.status(201).json(newRestaurant);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connectedClients: clients.size
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready for connections`);
  console.log(`🍕 ${restaurants.length} restaurants loaded`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
