const Post = require('../models/Post')

const checkExpiration = async (req, res, next) => {
    try {
        const now = new Date()
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1)) // Get the date 1 month ago

        // Update posts created more than 1 month ago to have the status 'Expired'
        await Post.updateMany(
            { createdAt: { $lt: oneMonthAgo }, status: 'Live' }, // Check if post is older than 1 month
            { $set: { status: 'Expired' } } // Update status to 'Expired'
        );

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        res.status(500).json({ message: 'Error updating expired posts', error: err.message })
    }
}

module.exports = checkExpiration
