require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(express.static('../'));
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

// Feedback storage file
const FEEDBACK_FILE = path.join(__dirname, 'feedbacks.json');

// Ensure feedback file exists
if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([], null, 2));
}

// API Routes

// Submit feedback
app.post('/api/feedback', (req, res) => {
    try {
        const { type, email, rating, message } = req.body;

        // Validate required fields
        if (!type || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'Type and message are required' 
            });
        }

        // Create feedback object
        const feedback = {
            id: Date.now().toString(),
            type,
            email: email || 'Anonymous',
            rating: rating || null,
            message,
            timestamp: new Date().toISOString(),
            ip: req.ip || 'Unknown'
        };

        // Read existing feedbacks
        let feedbacks = [];
        try {
            const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
            feedbacks = JSON.parse(data);
        } catch (err) {
            feedbacks = [];
        }

        // Add new feedback
        feedbacks.unshift(feedback); // Add to beginning

        // Save to file
        fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));

        console.log('New feedback received:', {
            type: feedback.type,
            rating: feedback.rating,
            timestamp: feedback.timestamp
        });

        res.json({ 
            success: true, 
            message: 'Feedback submitted successfully',
            id: feedback.id
        });

    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to submit feedback' 
        });
    }
});

// Get all feedbacks (for admin)
app.get('/api/feedbacks', (req, res) => {
    try {
        const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
        const feedbacks = JSON.parse(data);
        res.json({ 
            success: true, 
            count: feedbacks.length,
            feedbacks 
        });
    } catch (error) {
        res.json({ 
            success: true, 
            count: 0,
            feedbacks: [] 
        });
    }
});

// Get feedback statistics
app.get('/api/feedbacks/stats', (req, res) => {
    try {
        const data = fs.readFileSync(FEEDBACK_FILE, 'utf8');
        const feedbacks = JSON.parse(data);

        // Calculate statistics
        const stats = {
            total: feedbacks.length,
            byType: {},
            averageRating: null,
            ratings: []
        };

        feedbacks.forEach(f => {
            // Count by type
            stats.byType[f.type] = (stats.byType[f.type] || 0) + 1;
            // Collect ratings
            if (f.rating) {
                stats.ratings.push(parseInt(f.rating));
            }
        });

        // Calculate average rating
        if (stats.ratings.length > 0) {
            stats.averageRating = (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(1);
        }

        res.json({ success: true, stats });

    } catch (error) {
        res.json({ 
            success: true, 
            stats: { total: 0, byType: {}, averageRating: null } 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'feedback-api', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Feedback API server running on port ${PORT}`);
    console.log(`Access feedbacks at: http://localhost:${PORT}/api/feedbacks`);
});
