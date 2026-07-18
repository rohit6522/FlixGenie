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
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
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
      model: 'llama-3.3-70b-versatile',
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
    console.error('Groq Error:', error.message);
    res.status(500).json({ error: 'Failed to get AI recommendation' });
  }
});

// OMDb: search movies by title
app.get('/api/omdb/search', async (req, res) => {
  try {
    const { title } = req.query;
    const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('OMDb Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch movie data' });
  }
});

// OMDb: fetch multiple movies by a list of titles (for "Popular", "Top Rated" rows)
app.post('/api/omdb/bulk', async (req, res) => {
  try {
    const { titles } = req.body;
    if (!titles || !Array.isArray(titles)) {
      return res.status(400).json({ error: 'titles array is required' });
    }

    const results = await Promise.all(
      titles.map(async (title) => {
        const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.Response === 'True' ? data : null;
      })
    );

    res.json({ results: results.filter(Boolean) });
  } catch (error) {
    console.error('OMDb Bulk Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch bulk movie data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});