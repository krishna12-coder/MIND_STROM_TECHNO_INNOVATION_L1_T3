const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let posts = [];

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all blog posts
app.get('/posts', (req, res) => {
    res.json(posts);
});

// Add a new blog post
app.post('/posts', (req, res) => {
    const newPost = req.body;
    posts.push(newPost);
    res.status(201).json(newPost);
});

// Delete a blog post
app.delete('/posts/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < posts.length) {
        posts.splice(index, 1);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Update a blog post (e.g., mark as read/unread)
app.put('/posts/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < posts.length) {
        posts[index] = { ...posts[index], ...req.body };
        res.json(posts[index]);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
