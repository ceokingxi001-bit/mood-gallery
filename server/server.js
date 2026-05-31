require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;

// PayPal credentials
const PAYPAL_CLIENT_ID = 'AWB_azJYoaLt7hPdrQXFyP404Axj8Tabo8ps3g19Wfs9JRcy_7fP_99-lHwOvNaT3_WE20J2_v_X3oIH';
const PAYPAL_SECRET = 'EJdTi92oPOnh6DXzLPoQPAVXmu7ZtghO7IQKfnZaAe4L1bgw85NntdL02uT895CMies7dYSL_RBo2not';
const PAYPAL_BASE_URL = 'https://api-m.paypal.com'; // Use live for production

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Store verified payments
const PAYMENTS_FILE = path.join(__dirname, 'verified_payments.json');

// Initialize payments file
if (!fs.existsSync(PAYMENTS_FILE)) {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([], null, 2));
}

// Get PayPal access token
async function getAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    
    const data = await response.json();
    return data.access_token;
}

// Verify payment with PayPal
async function verifyPayment(orderId, accessToken) {
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    
    return await response.json();
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Mood Gallery API', timestamp: new Date().toISOString() });
});

// Verify payment endpoint
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { orderId } = req.body;
        
        if (!orderId) {
            return res.status(400).json({ success: false, error: 'Order ID is required' });
        }
        
        console.log('Verifying payment for order:', orderId);
        
        // Get access token
        const accessToken = await getAccessToken();
        
        // Verify payment
        const order = await verifyPayment(orderId, accessToken);
        
        console.log('PayPal order status:', order.status);
        
        // Check if payment is completed
        if (order.status === 'COMPLETED' || 
            (order.purchase_units && order.purchase_units[0].amount.value === '1.99' && order.status === 'APPROVED')) {
            
            // Save verified payment
            const payments = JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf8'));
            
            // Check if already verified
            const existingPayment = payments.find(p => p.orderId === orderId);
            if (!existingPayment) {
                payments.push({
                    orderId: orderId,
                    amount: order.purchase_units ? order.purchase_units[0].amount.value : '1.99',
                    email: order.payer ? order.payer.email_address : 'unknown',
                    timestamp: new Date().toISOString(),
                    verified: true
                });
                fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2));
            }
            
            console.log('Payment verified successfully!');
            
            res.json({ 
                success: true, 
                verified: true,
                message: 'Payment verified successfully'
            });
        } else {
            res.json({ 
                success: false, 
                verified: false,
                status: order.status,
                message: 'Payment not completed'
            });
        }
        
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ success: false, error: 'Failed to verify payment' });
    }
});

// Get all verified payments (for admin)
app.get('/api/payments', (req, res) => {
    try {
        const payments = JSON.parse(fs.readFileSync(PAYMENTS_FILE, 'utf8'));
        res.json({ success: true, count: payments.length, payments });
    } catch (error) {
        res.json({ success: true, count: 0, payments: [] });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Mood Gallery API Server running on port ${PORT}`);
    console.log(`Access: http://localhost:${PORT}`);
    console.log(`\nTo test payment verification:`);
    console.log(`POST http://localhost:${PORT}/api/verify-payment`);
    console.log(`Body: { "orderId": "YOUR_ORDER_ID" }`);
});
