const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../db');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const userModel = require('../models/userModel');

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID || 'dummy_id',
  key_secret: env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

const PLAN_RATES = {
  '1w': 2900,
  '1m': 8900,
  '6m': 49900,
  '12m': 99900
};

async function createOrder(req, res, next) {
  try {
    const { plan } = req.body;
    if (!PLAN_RATES[plan]) {
      throw new ApiError(400, 'Invalid plan selected.');
    }

    const amount = PLAN_RATES[plan];

    const options = {
      amount,
      currency: "INR",
      receipt: `rcpt_${req.user.id}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    // Save to DB
    await db.query(
      'INSERT INTO orders (user_id, razorpay_order_id, plan_duration, amount) VALUES ($1, $2, $3, $4)',
      [req.user.id, order.id, plan, amount]
    );

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    next(err);
  }
}

async function verifyPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Signature is valid. Update order status and user subscription
      await db.query(
        "UPDATE orders SET status = 'paid', razorpay_payment_id = $1, razorpay_signature = $2, updated_at = CURRENT_TIMESTAMP WHERE razorpay_order_id = $3",
        [razorpay_payment_id, razorpay_signature, razorpay_order_id]
      );

      // Get plan duration
      const orderRes = await db.query('SELECT user_id, plan_duration FROM orders WHERE razorpay_order_id = $1', [razorpay_order_id]);
      if (orderRes.rows.length === 0) throw new ApiError(404, 'Order not found');
      
      const { user_id, plan_duration } = orderRes.rows[0];

      // Add time to subscription
      let interval = '';
      if (plan_duration === '1w') interval = '7 days';
      if (plan_duration === '1m') interval = '1 month';
      if (plan_duration === '6m') interval = '6 months';
      if (plan_duration === '12m') interval = '1 year';

      // If subscription_expires_at is already in future, add to it. Otherwise, add to NOW.
      await db.query(`
        UPDATE users 
        SET subscription_expires_at = GREATEST(COALESCE(subscription_expires_at, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP) + interval '${interval}'
        WHERE id = $1
      `, [user_id]);

      res.json({ success: true, message: 'Payment verified successfully. Premium unlocked.' });
    } else {
      await db.query(
        "UPDATE orders SET status = 'failed', updated_at = CURRENT_TIMESTAMP WHERE razorpay_order_id = $1",
        [razorpay_order_id]
      );
      throw new ApiError(400, 'Invalid payment signature');
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  verifyPayment
};
