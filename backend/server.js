const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://flixgenie-frontend.onrender.com"
  ]
}));

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

// AI-powered similar movies suggestion
app.post('/api/similar-movies', async (req, res) => {
  try {
    const { title, genre } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a movie recommendation assistant. Given a movie title and genre, respond with ONLY a JSON array of exactly 6 similar movie titles (real, well-known movies). No explanation, no markdown, just the raw JSON array. Example: ["Movie One", "Movie Two", "Movie Three", "Movie Four", "Movie Five", "Movie Six"]',
        },
        {
          role: 'user',
          content: `Suggest 6 movies similar to "${title}" (genre: ${genre || 'unknown'}). Do not include "${title}" itself in the list.`,
        },
      ],
    });

    const raw = completion.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const titles = JSON.parse(cleaned);

    res.json({ titles });
  } catch (error) {
    console.error('Similar Movies Error:', error.message);
    res.status(500).json({ error: 'Failed to get similar movies' });
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


// Fetch public domain feature films directly from Archive.org (always valid, always legal)
app.get('/api/archive/movies', async (req, res) => {
  try {
    const url = `https://archive.org/advancedsearch.php?q=collection%3Afeature_films+AND+mediatype%3Amovies&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=year&fl%5B%5D=description&sort%5B%5D=downloads+desc&rows=60&output=json`;

    const response = await fetch(url);
    const data = await response.json();

    const movies = (data.response?.docs || [])
      .filter((doc) => doc.identifier && doc.title)
      .map((doc) => ({
        Title: doc.title,
        Year: doc.year || "N/A",
        Plot: doc.description
          ? String(doc.description).slice(0, 200)
          : "A classic public domain film, free to watch.",
        Poster: `https://archive.org/services/img/${doc.identifier}`,
        imdbID: doc.identifier,
        archiveId: doc.identifier,
        imdbRating: "N/A",
        Runtime: "N/A",
        Rated: "N/A",
        Genre: "Classic",
        Director: "N/A",
        Actors: "N/A",
        Awards: "N/A",
      }));

    res.json({ results: movies });
  } catch (error) {
    console.error('Archive.org Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch archive movies' });
  }
});
// YouTube: search trailer by movie title
app.get('/api/youtube/trailer', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const query = encodeURIComponent(`${title} official trailer`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      res.json({ videoId });
    } else {
      res.json({ videoId: null });
    }
  } catch (error) {
    console.error('YouTube Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch trailer' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});