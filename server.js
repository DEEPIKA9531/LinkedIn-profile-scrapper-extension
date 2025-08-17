const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Profile = require('./models/Profile');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'LinkedIn Profile Scraper API is running!' });
});

// POST endpoint to create a new profile
app.post('/api/profiles', async (req, res) => {
  try {
    const { name, url, about, bio, location, followerCount, connectionCount } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }

    const profile = await Profile.create({
      name,
      url,
      about: about || '',
      bio: bio || '',
      location: location || '',
      followerCount: followerCount || 0,
      connectionCount: connectionCount || 0
    });

    res.status(201).json({
      message: 'Profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to retrieve all profiles
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await Profile.findAll();
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sync database and start server
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced successfully');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Unable to sync database:', err);
});
