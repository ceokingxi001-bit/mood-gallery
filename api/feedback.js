const fs = require('fs');

const FEEDBACK_FILE = '/tmp/feedbacks.json';

function readFeedbacks() {
  try {
    if (fs.existsSync(FEEDBACK_FILE)) {
      return JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading feedbacks:', err);
  }
  return [];
}

function writeFeedbacks(feedbacks) {
  try {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing feedbacks:', err);
    return false;
  }
}

module.exports = (req, res) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { type, email, rating, message } = req.body;

  // Basic validation
  if (!type || !message) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const feedback = {
    id: Date.now().toString(),
    type,
    email: email || 'Anonymous',
    rating: rating || 0,
    message,
    ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'Unknown',
    createdAt: new Date().toISOString()
  };

  const feedbacks = readFeedbacks();
  feedbacks.unshift(feedback);

  if (!writeFeedbacks(feedbacks)) {
    return res.status(500).json({ success: false, error: 'Failed to save feedback' });
  }

  console.log('Feedback received:', feedback.type, '-', feedback.message.substring(0, 50));

  return res.status(200).json({ success: true });
};
