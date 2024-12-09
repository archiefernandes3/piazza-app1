const express = require('express');
const Post = require('../models/Post');
const auth = require('../middlewares/auth');
const checkExpiration = require('../middlewares/checkExpiration');
const router = express.Router();

// Middleware to update expired posts
router.use(checkExpiration);

// Create a new post
router.post('/', auth, async (req, res) => {
    const { title, topic, body, status, createdAt } = req.body
    try{
       const post = new Post({
        title,
        topic,
        body,
        status,
        createdAt: new Date(),
        createdBy: req.user.id,
    });
    await post.save();
    res.status(201).json(post)
}catch(error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all posts by topic
router.get('/:topic', async (req, res) => {
    const { topic } = req.params;

    try {
        const posts = await Post.find({ topic }).populate('createdBy', 'name');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Like a post
router.put('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.status === 'Expired') {
            return res.status(400).json({ message: 'Post not found or expired' });
        }

        post.likes += 1;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Dislike a post
router.put('/:id/dislike', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.status === 'Expired') {
            return res.status(400).json({ message: 'Post not found or expired' });
        }

        post.dislikes += 1;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Comment on a post
router.post('/:id/comment', auth, async (req, res) => {
    const { message } = req.body;

    try {
        const post = await Post.findById(req.params.id);
        if (!post || post.status === 'Expired') {
            return res.status(400).json({ message: 'Post not found or expired' });
        }

        post.comments.push({
            user: req.user.id,
            message,
        });

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Fetch expired posts by topic
router.get('/expired/:topic', auth, async (req, res) => {
    const { topic } = req.params;

    try {
        const expiredPosts = await Post.find({ topic, status: 'Expired' });
        res.status(200).json(expiredPosts);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Fetch the most active post for a topic
// Fetch the most active post by topic
router.get('/most-active/:topic', async (req, res) => {
    const { topic } = req.params;

    try {
        const mostActivePost = await Post.findOne({ topic, status: 'Live' })
            .sort({ likes: -1, dislikes: -1 })  // Sort by likes and dislikes
            .limit(1);

        if (!mostActivePost) {
            return res.status(404).json({ message: 'No active posts found' });
        }

        res.status(200).json(mostActivePost);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching most active post', error: err.message });
    }
});

module.exports = router;
