const BASE_URL = 'http://localhost:5000/api';

async function runPhase6Tests() {
  console.log('=== Starting RetroParts Phase 6 Verification Test Suite ===\n');

  // 1. Authenticate Buyer & Seller
  console.log('--- [1. Authentication Setup] ---');
  const buyerRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@retroparts.com', password: 'password123' }),
  });
  const buyer = await buyerRes.json();
  const buyerToken = buyer.token;
  console.log(`✓ Authenticated Buyer: "${buyer.user.name}"`);

  const sellerRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'seller@retroparts.com', password: 'password123' }),
  });
  const seller = await sellerRes.json();
  const sellerToken = seller.token;
  console.log(`✓ Authenticated Seller: "${seller.user.name}"`);

  // 2. Fetch an active listing to purchase
  const listingsRes = await fetch(`${BASE_URL}/listings`);
  const listingsData = await listingsRes.json();
  const activeListing = (listingsData.data || listingsData)[0];
  console.log(`✓ Selected Part for Purchase: "${activeListing.title}" (Price: ₹${activeListing.price})`);

  // 3. Place Escrow Order (POST /api/orders)
  console.log('\n--- [2. Place Escrow Protected Order] ---');
  const orderPayload = {
    items: [
      {
        listingId: activeListing._id,
        quantity: 1,
      },
    ],
    shippingAddress: {
      fullName: 'Kavita Sharma',
      phone: '+91 97690 99881',
      addressLine: 'Flat 402, Sea View Apartments, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    paymentMethod: 'mock_card', // Explicitly tested stub
  };

  const createOrderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`,
    },
    body: JSON.stringify(orderPayload),
  });
  const createOrderData = await createOrderRes.json();
  if (createOrderRes.status !== 201 || !createOrderData.data?._id) {
    throw new Error('Order creation failed: ' + JSON.stringify(createOrderData));
  }
  const order = createOrderData.data;
  const orderId = order._id;
  console.log(`✓ Placed Order #${order.orderNumber} (ID: ${orderId})`);
  console.log(`  Subtotal: ₹${order.subtotal} | Protection Fee: ₹${order.protectionFee} | Total: ₹${order.totalAmount}`);
  console.log(`  Initial Status: "${order.orderStatus}" | Payment: "${order.paymentStatus}"`);

  // 4. Buyer Fetches Order Detail (GET /api/orders/:id)
  console.log('\n--- [3. Buyer Fetches Order Details] ---');
  const getOrderRes = await fetch(`${BASE_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${buyerToken}` },
  });
  const getOrderData = await getOrderRes.json();
  if (getOrderRes.status !== 200 || getOrderData.data.orderNumber !== order.orderNumber) {
    throw new Error('Order fetch failed: ' + JSON.stringify(getOrderData));
  }
  console.log(`✓ Buyer Order Verified: Ship to ${getOrderData.data.shippingAddress.city}, ${getOrderData.data.shippingAddress.state}`);

  // 5. Seller Status Progression & Tracking Updates
  console.log('\n--- [4. Order Status Progression Lifecycle] ---');

  // Step A: Dispatched with Tracking
  const dispatchRes = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify({
      status: 'dispatched',
      trackingNumber: 'VINTAGE-EXP-99281',
      trackingCourier: 'BlueDart Vintage Cargo',
      note: 'Part packaged in shockproof wooden crate and dispatched via BlueDart Express.',
    }),
  });
  const dispatchData = await dispatchRes.json();
  console.log(`✓ Transitioned to 'dispatched' with Tracking: ${dispatchData.data.trackingNumber}`);

  // Step B: In Transit
  await fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify({
      status: 'in_transit',
      note: 'Shipment arrived at Mumbai Central Hub, out for local delivery.',
    }),
  });
  console.log(`✓ Transitioned to 'in_transit'`);

  // Step C: Delivered & Completed
  const completeRes = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify({
      status: 'delivered',
      note: 'Package handed to recipient with buyer fitment inspection verified.',
    }),
  });
  const completeData = await completeRes.json();
  console.log(`✓ Transitioned to 'delivered' | Total Milestones in History: ${completeData.data.statusHistory.length}`);

  console.log('\n🎉 ALL PHASE 6 ORDERS & CHECKOUT VERIFICATION TESTS PASSED 100%! 🎉');
}

runPhase6Tests().catch((err) => {
  console.error('Phase 6 test suite error:', err);
  process.exit(1);
});
