// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'handyman',
//   password: process.env.DB_PASSWORD || 'root',
//   port: parseInt(process.env.DB_PORT || '5432', 10),
// });

// app.use(cors());
// app.use(express.json());

// // Get all categories with their services
// app.get('/service-categories', async (req, res) => {
//   try {
//     const categoriesResult = await pool.query(
//       'SELECT category_id, name FROM service_categories'
//     );
//     const categoriesWithServices = await Promise.all(
//       categoriesResult.rows.map(async (category) => {
//         const servicesResult = await pool.query(
//           'SELECT service_id, name FROM services WHERE category_id = $1',
//           [category.category_id]
//         );

//         return {
//           ...category,
//           services: servicesResult.rows.map(service => service.name)
//         };
//       })
//     );
//     res.json(categoriesWithServices);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.get('/service-categories/:category_id', async (req, res) => {
//   const { category_id } = req.params;
//   try {
//     const categoryResult = await pool.query(
//       'SELECT service_id, name, description, description_2 FROM services WHERE service_id = $1',
//       [category_id]
//     );
//     if (categoryResult.rowCount === 0) {
//       return res.status(404).send('Category not found');
//     }
//     res.json({
//       ...categoryResult.rows[0]
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(PORT, () => {
//   console.log('categories');
// });

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'postgres',
  password: 'root',
  database: 'handyman',
  port: 5432 // Default PostgreSQL port
};

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool(dbConfig);

// Get all service categories
app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM service_categories');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Get services by category ID
app.get('/api/services/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM services WHERE category_id = $1', 
      [categoryId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
});

// Get a specific service by service ID
app.get('/api/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { rows } = await pool.query(
      'SELECT s.*, sc.name as category_name FROM services s ' +
      'JOIN service_categories sc ON s.category_id = sc.category_id ' +
      'WHERE s.service_id = $1', 
      [serviceId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
});

// Search services
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    const { rows } = await pool.query(
      'SELECT s.*, sc.name as category_name FROM services s ' +
      'JOIN service_categories sc ON s.category_id = sc.category_id ' +
      'WHERE s.name ILIKE $1 OR s.description ILIKE $1', 
      [`%${query}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error searching services:', error);
    res.status(500).json({ message: 'Error searching services', error: error.message });
  }
});

app.get('/api/category/:service_id', async (req, res) => {
  try {
    const { service_id } = req.params;
    if (!service_id || service_id === 'undefined') {
      return res.status(400).json({ message: 'Invalid service ID' });
    }
    if (!service_id) {
      return res.status(400).json({ message: 'Service ID is required' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM services WHERE service_id = $1', 
      [service_id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching category details:', error);
    res.status(500).json({ message: 'Error fetching category details', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await pool.end();
    console.log('Database pool closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing database pool:', error);
    process.exit(1);
  }
});