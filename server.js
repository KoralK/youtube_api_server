const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const app = express();
const port = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache TTL 10 minutes

app.get('/trending-videos', async (req, res) => {
  const cacheKey = 'trending-videos';

  // Check if data is in cache
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        maxResults: 10,
        key: API_KEY,
      },
    });

    // Store data in cache
    cache.set(cacheKey, response.data);

    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data from YouTube API');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
