const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'FlixGenie backend is running' });
});

// AI movie recommendation endpoint
app.post('/api/recommend', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a movie recommendation assistant. Suggest movies based on user preferences, mood, or description. Keep responses concise and return movie titles clearly.',
        },
        { role: 'user', content: prompt },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ result: reply });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    res.status(500).json({ error: 'Failed to get AI recommendation' });
  }
});

// TMDB proxy endpoint (optional — keeps key server-side too)
app.get('/api/tmdb/*splat', async (req, res) => {
  try {
    const tmdbPath = req.params.splat.join('/');
    const queryParams = new URLSearchParams(req.query).toString();
    const url = `https://api.themoviedb.org/3/${tmdbPath}?api_key=${process.env.TMDB_API_KEY}&${queryParams}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('TMDB Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch TMDB data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});