const BASE_URL = 'http://localhost:5000/api';

async function runPhase2Tests() {
  console.log('=== Starting RetroParts Phase 2 Verification Test Suite ===\n');

  // 1. Vehicle Reference Taxonomy
  console.log('--- [1. Vehicle Taxonomy Tests] ---');
  const brandsRes = await fetch(`${BASE_URL}/vehicles/brands`);
  const brandsJson = await brandsRes.json();
  const brands = Array.isArray(brandsJson) ? brandsJson : (brandsJson.data || []);
  if (brandsRes.status !== 200 || brands.length === 0) {
    throw new Error('Vehicle brands fetch failed: ' + JSON.stringify(brandsJson));
  }
  console.log(`✓ Vehicle Brands loaded (${brands.length} makes):`, brands.slice(0, 5).join(', '), '...');

  const yamahaRes = await fetch(`${BASE_URL}/vehicles/models?brand=Yamaha`);
  const yamahaJson = await yamahaRes.json();
  const yamahaModels = Array.isArray(yamahaJson) ? yamahaJson : (yamahaJson.data || []);
  console.log(`✓ Yamaha Models loaded:`, yamahaModels.map((m) => m.model).join(', '));

  // 2. Category Taxonomy
  console.log('\n--- [2. Category Taxonomy Tests] ---');
  const catsRes = await fetch(`${BASE_URL}/categories`);
  const catsJson = await catsRes.json();
  const cats = Array.isArray(catsJson) ? catsJson : (catsJson.data || []);
  if (catsRes.status !== 200 || cats.length === 0) {
    throw new Error('Categories fetch failed: ' + JSON.stringify(catsJson));
  }
  console.log(`✓ Fixed Automotive Categories (${cats.length} categories):`, cats.map((c) => c.name).join(', '));

  // 3. Login as Seller for Listing CRUD
  console.log('\n--- [3. Seller Authentication for Listing CRUD] ---');
  const sellerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'seller@retroparts.com',
      password: 'password123',
    }),
  });
  const sellerLogin = await sellerLoginRes.json();
  if (sellerLoginRes.status !== 200 || !sellerLogin.token) {
    throw new Error('Seller login failed: ' + JSON.stringify(sellerLogin));
  }
  const sellerToken = sellerLogin.token;
  console.log(`✓ Authenticated as seller: "${sellerLogin.user.name}"`);

  // 4. Create Listing (POST /api/listings)
  console.log('\n--- [4. Create Listing CRUD Test] ---');
  const newPartPayload = {
    title: 'Yamaha RX100 Original Mikuni Slide Carburetor Japan NOS Test',
    description: 'Genuine Made in Japan Mikuni VM20 20mm round slide carburetor in original box with preservative grease.',
    categoryName: 'Engine',
    vehicleBrand: 'Yamaha',
    vehicleModel: 'RX100',
    vehicleYear: 1989,
    vehicleVariant: 'Standard',
    oemNumber: '17G-14101-00-JP',
    condition: 'NOS (New Old Stock)',
    partType: 'OEM Original',
    price: 8500,
    originalPrice: 10500,
    quantity: 2,
    negotiable: false,
    rarity: 'Extremely Rare / Holy Grail',
    images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80'],
    location: {
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560025',
    },
    compatibleVehicles: [
      {
        brand: 'Yamaha',
        model: 'RX100',
        yearFrom: 1985,
        yearTo: 1996,
        variant: 'Standard',
      },
    ],
  };

  const createRes = await fetch(`${BASE_URL}/listings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify(newPartPayload),
  });
  const createData = await createRes.json();
  if (createRes.status !== 201 || !createData.data?._id) {
    throw new Error('Listing creation failed: ' + JSON.stringify(createData));
  }
  const listingId = createData.data._id;
  console.log(`✓ Created Listing: "${createData.data.title}" (ID: ${listingId})`);

  // 5. Read Listing (GET /api/listings/:id)
  console.log('\n--- [5. Read Listing Test] ---');
  const getRes = await fetch(`${BASE_URL}/listings/${listingId}`);
  const getData = await getRes.json();
  if (getRes.status !== 200 || getData.data._id !== listingId) {
    throw new Error('Listing read failed: ' + JSON.stringify(getData));
  }
  console.log(`✓ Fetched Listing: "${getData.data.title}" | Views: ${getData.data.views} | Seller: ${getData.data.seller.name}`);

  // 6. Update Listing (PUT /api/listings/:id)
  console.log('\n--- [6. Update Listing Test] ---');
  const updateRes = await fetch(`${BASE_URL}/listings/${listingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify({
      price: 8200,
      quantity: 1,
    }),
  });
  const updateData = await updateRes.json();
  if (updateRes.status !== 200 || updateData.data.price !== 8200) {
    throw new Error('Listing update failed: ' + JSON.stringify(updateData));
  }
  console.log(`✓ Updated Listing: New price ₹${updateData.data.price}, Quantity: ${updateData.data.quantity}`);

  // 7. Delete Listing (DELETE /api/listings/:id)
  console.log('\n--- [7. Delete Listing Test] ---');
  const deleteRes = await fetch(`${BASE_URL}/listings/${listingId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${sellerToken}` },
  });
  const deleteData = await deleteRes.json();
  if (deleteRes.status !== 200 || !deleteData.success) {
    throw new Error('Listing deletion failed: ' + JSON.stringify(deleteData));
  }
  console.log(`✓ Deleted Listing ${listingId} successfully`);

  console.log('\n🎉 ALL PHASE 2 VEHICLES & LISTINGS VERIFICATION TESTS PASSED 100%! 🎉');
}

runPhase2Tests().catch((err) => {
  console.error('Phase 2 test suite error:', err);
  process.exit(1);
});
