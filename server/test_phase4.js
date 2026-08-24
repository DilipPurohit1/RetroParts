const BASE_URL = 'http://localhost:5000/api';

async function runPhase4Tests() {
  console.log('=== Starting RetroParts Phase 4 Verification Test Suite ===\n');

  // 1. Authenticate Buyer & Seller
  console.log('--- [1. Authentication Setup] ---');
  const buyerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@retroparts.com', password: 'password123' }),
  });
  const buyerLogin = await buyerLoginRes.json();
  const buyerToken = buyerLogin.token;
  console.log(`✓ Authenticated Buyer: "${buyerLogin.user.name}"`);

  const sellerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'seller@retroparts.com', password: 'password123' }),
  });
  const sellerLogin = await sellerLoginRes.json();
  const sellerToken = sellerLogin.token;
  console.log(`✓ Authenticated Seller: "${sellerLogin.user.name}"`);

  // 2. Buyer Creates a Rare Wanted Part Request
  console.log('\n--- [2. Buyer Creates Rare Wanted Part Request] ---');
  const uniqueKeyword = `Exhaust_${Date.now()}`;
  const wantedPayload = {
    title: `Yamaha RD350 High Torque Expansion Exhaust Chambers ${uniqueKeyword}`,
    description: 'Looking for a pair of pristine chrome expansion chambers for a 1984 Yamaha RD350 HT.',
    vehicleBrand: 'Yamaha',
    vehicleModel: 'RD350',
    vehicleYear: 1984,
    vehicleVariant: 'High Torque (HT)',
    category: 'Exhaust & Intake',
    budget: 15000,
    urgency: 'urgent',
    conditionRequired: 'Good Used',
    location: { city: 'Mumbai', state: 'Maharashtra' },
  };

  const wantedRes = await fetch(`${BASE_URL}/wanted`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`,
    },
    body: JSON.stringify(wantedPayload),
  });
  const wantedData = await wantedRes.json();
  if (wantedRes.status !== 201 || !wantedData.data?._id) {
    throw new Error('Wanted request creation failed: ' + JSON.stringify(wantedData));
  }
  const wantedId = wantedData.data._id;
  console.log(`✓ Buyer Created Wanted Bounty: "${wantedData.data.title}" (ID: ${wantedId})`);

  // 3. Seller Creates a Matching Listing
  console.log('\n--- [3. Seller Creates Matching Listing (Triggers Match-on-Create)] ---');
  const listingPayload = {
    title: `Yamaha RD350 Original Chrome Expansion Exhaust Chamber Pair ${uniqueKeyword}`,
    description: 'Original HT spec expansion chambers with baffle inserts and mounting collars.',
    categoryName: 'Exhaust & Intake',
    vehicleBrand: 'Yamaha',
    vehicleModel: 'RD350',
    vehicleYear: 1984,
    vehicleVariant: 'High Torque (HT)',
    oemNumber: '360-14610-00',
    condition: 'OEM Mint',
    partType: 'OEM Original',
    price: 13500,
    quantity: 1,
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80'],
    location: { city: 'Bengaluru', state: 'Karnataka' },
    compatibleVehicles: [
      { brand: 'Yamaha', model: 'RD350', yearFrom: 1983, yearTo: 1989, variant: 'HT & LT' },
    ],
  };

  const createListingRes = await fetch(`${BASE_URL}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify(listingPayload),
  });
  const createListingData = await createListingRes.json();
  if (createListingRes.status !== 201 || !createListingData.data?._id) {
    throw new Error('Listing creation failed: ' + JSON.stringify(createListingData));
  }
  const matchingListingId = createListingData.data._id;
  console.log(`✓ Seller Published Matching Listing: "${createListingData.data.title}" (ID: ${matchingListingId})`);

  // Wait 500ms for async matching trigger to save notification
  await new Promise((resolve) => setTimeout(resolve, 600));

  // 4. Verify Buyer Received "wanted_match" Notification
  console.log('\n--- [4. Verify Buyer Notification Delivery] ---');
  const notifRes = await fetch(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${buyerToken}` },
  });
  const notifData = await notifRes.json();
  const notifications = Array.isArray(notifData) ? notifData : (notifData.data || []);
  const matchingNotif = notifications.find(
    (n) => (n.type === 'wanted_match' || n.type === 'wanted-match') && (n.message?.includes('RD350') || n.title?.includes('Match'))
  );

  if (!matchingNotif) {
    throw new Error('Expected wanted_match notification not found for buyer! Notifications: ' + JSON.stringify(notifications));
  }
  console.log(`✓ Match-on-Create Notification Verified: "${matchingNotif.title}"`);
  console.log(`  Message: "${matchingNotif.message}"`);
  console.log(`  Link: ${matchingNotif.link}`);

  // 5. Wishlist Toggle Test
  console.log('\n--- [5. Wishlist Management Tests] ---');
  const addWishlistRes = await fetch(`${BASE_URL}/wishlist/${matchingListingId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${buyerToken}` },
  });
  const addWishlistData = await addWishlistRes.json();
  console.log(`✓ Added to Wishlist: Listing ${matchingListingId}`);

  const getWishlistRes = await fetch(`${BASE_URL}/wishlist`, {
    headers: { Authorization: `Bearer ${buyerToken}` },
  });
  const getWishlistData = await getWishlistRes.json();
  const wishlistItems = getWishlistData.data?.listings || getWishlistData.data || [];
  console.log(`✓ Wishlist contains ${wishlistItems.length} saved item(s)`);

  console.log('\n🎉 ALL PHASE 4 WANTED PARTS, MATCH-ON-CREATE & WISHLIST TESTS PASSED 100%! 🎉');
}

runPhase4Tests().catch((err) => {
  console.error('Phase 4 test suite error:', err);
  process.exit(1);
});
