const express = require('express');
const { getTopUsers } = require('./services/userService');
const { getPostsByType } = require('./services/postService');

const app = express();
const PORT = 3000;

app.get('/users', async (req, res) => {
    try {
        const top = await getTopUsers();
        res.json({ topUsers: top });
    } catch (e) {
        res.status(500).json({ error: e.message || 'Something went wrong.' });
    }
});

app.get('/posts', async (req, res) => {
    const typeParam = req.query.type;

    if (!typeParam || (typeParam !== 'latest' && typeParam !== 'popular')) {
        return res.status(400).json({ error: 'Invalid type passed. Expected "latest" or "popular"' });
    }

    try {
        const resultPosts = await getPostsByType(typeParam);
        res.json({ posts: resultPosts });
    } catch (err) {
        res.status(500).json({ error: err.message ?? 'Unexpected server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
