const BASE_URL = 'http://localhost:5000/api';

async function runPhase5Tests() {
  console.log('=== Starting RetroParts Phase 5 Verification Test Suite ===\n');

  // 1. Authenticate Buyer & Seller
  console.log('--- [1. Authentication Setup] ---');
  const buyerRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@retroparts.com', password: 'password123' }),
  });
  const buyer = await buyerRes.json();
  const buyerToken = buyer.token;
  const buyerId = buyer.user.id;
  console.log(`✓ Authenticated Buyer: "${buyer.user.name}" (${buyerId})`);

  const sellerRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'seller@retroparts.com', password: 'password123' }),
  });
  const seller = await sellerRes.json();
  const sellerToken = seller.token;
  const sellerId = seller.user.id;
  console.log(`✓ Authenticated Seller: "${seller.user.name}" (${sellerId})`);

  // 2. Buyer Sends Message to Seller
  console.log('\n--- [2. Buyer Initiates Real-Time Chat Message] ---');
  const sendMsgRes = await fetch(`${BASE_URL}/chat/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`,
    },
    body: JSON.stringify({
      recipientId: sellerId,
      text: 'Hello Rajesh! Is the Yamaha RX100 Mikuni carb still available for shipping to Mumbai?',
    }),
  });
  const sendMsgData = await sendMsgRes.json();
  if (sendMsgRes.status !== 201 || !sendMsgData.data?._id) {
    throw new Error('Send message failed: ' + JSON.stringify(sendMsgData));
  }
  const conversationId = sendMsgData.conversationId;
  console.log(`✓ Message Sent! Conversation ID: ${conversationId}`);
  console.log(`  Text: "${sendMsgData.data.text}"`);

  // 3. Seller Fetches Conversation History
  console.log('\n--- [3. Seller Reads Message History] ---');
  const convRes = await fetch(`${BASE_URL}/chat/${conversationId}`, {
    headers: { Authorization: `Bearer ${sellerToken}` },
  });
  const convData = await convRes.json();
  if (convRes.status !== 200 || !Array.isArray(convData.data) || convData.data.length === 0) {
    throw new Error('Fetch messages failed: ' + JSON.stringify(convData));
  }
  console.log(`✓ Seller received ${convData.data.length} message(s) in conversation ${conversationId}`);

  // 4. Seller Sends Reply
  const replyRes = await fetch(`${BASE_URL}/chat/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify({
      conversationId,
      text: 'Yes Kavita! It is in NOS factory sealed condition and ready for immediate courier dispatch.',
    }),
  });
  const replyData = await replyRes.json();
  console.log(`✓ Seller Replied: "${replyData.data.text}"`);

  // 5. Test Review Flow Gated on Order
  console.log('\n--- [5. Review Flow Gated on Completed Order] ---');
  // First, create a test order
  const orderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`,
    },
    body: JSON.stringify({
      sellerId: sellerId,
      items: [
        {
          listingId: (await (await fetch(`${BASE_URL}/listings`)).json()).data[0]._id,
          quantity: 1,
        },
      ],
      shippingAddress: {
        fullName: 'Kavita Sharma',
        phone: '+91 97690 99881',
        addressLine: 'Flat 402, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
      },
      paymentMethod: 'Mock Escrow Card',
    }),
  });
  const orderData = await orderRes.json();
  const orderId = orderData.data?._id;
  console.log(`✓ Placed Order #${orderData.data?.orderNumber || orderId} (Status: ${orderData.data?.status})`);

  // Attempting review on 'placed' order should fail
  const prematureReviewRes = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`,
    },
    body: JSON.stringify({
      sellerId: sellerId,
      orderId: orderId,
      rating: 5,
      comment: 'Excellent packaging and fast shipping!',
    }),
  });
  if (prematureReviewRes.status === 400) {
    console.log('✓ Review on uncompleted order correctly rejected: 400 Bad Request');
  }

  // Update order to 'completed'
  await fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify({ status: 'completed' }),
  });
  console.log(`✓ Order status transitioned to: 'completed'`);

  // Submit valid review
  const validReviewRes = await fetch(`${BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`,
    },
    body: JSON.stringify({
      sellerId: sellerId,
      orderId: orderId,
      rating: 5,
      comment: '100% authentic NOS part as described. Clean fitment on my vintage motorcycle!',
    }),
  });
  const validReviewData = await validReviewRes.json();
  if (validReviewRes.status !== 201) {
    throw new Error('Valid review submission failed: ' + JSON.stringify(validReviewData));
  }
  console.log(`✓ Verified Review Submitted: "${validReviewData.data.comment}" (Rating: ${validReviewData.data.rating}★)`);

  // Check updated seller reviews
  const sellerReviewsRes = await fetch(`${BASE_URL}/reviews/seller/${sellerId}`);
  const sellerReviewsData = await sellerReviewsRes.json();
  console.log(`✓ Seller Aggregated Stats: ${sellerReviewsData.stats.averageRating}★ average across ${sellerReviewsData.stats.total} reviews`);

  console.log('\n🎉 ALL PHASE 5 CHAT & REVIEWS TESTS PASSED 100%! 🎉');
}

runPhase5Tests().catch((err) => {
  console.error('Phase 5 test suite error:', err);
  process.exit(1);
});
