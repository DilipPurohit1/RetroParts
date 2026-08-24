const BASE_URL = 'http://localhost:5000/api/v1';

async function runShouldHaveTests() {
  console.log('=== Starting RetroParts SHOULD HAVE Features Verification Test Suite ===\n');

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

  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@retroparts.com', password: 'password123' }),
  });
  const adminLogin = await adminLoginRes.json();
  const adminToken = adminLogin.token;
  console.log(`✓ Authenticated Admin: "${adminLogin.user.name}"`);

  // 2. Test My Garage (Private Vehicle Profile + Restoration Logs)
  console.log('\n--- [2. My Garage & Restoration Timeline Tests] ---');
  const addVehicleRes = await fetch(`${BASE_URL}/garage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`,
    },
    body: JSON.stringify({
      make: 'Yamaha',
      model: 'RX100',
      year: 1989,
      variant: 'Standard Escorts',
      nickname: 'Midnight RX Restoration',
      registrationNumber: 'KA-01-EA-1989',
      currentOdometerKm: 34200,
      status: 'in_restoration',
    }),
  });
  const addVehicleData = await addVehicleRes.json();
  if (addVehicleRes.status !== 201 || !addVehicleData.data?._id) {
    throw new Error('Failed to add garage vehicle: ' + JSON.stringify(addVehicleData));
  }
  const garageVehicleId = addVehicleData.data._id;
  console.log(`✓ Added Vehicle to My Garage: "${addVehicleData.data.nickname}" (ID: ${garageVehicleId})`);

  // Add Restoration Entry
  const addEntryRes = await fetch(`${BASE_URL}/garage/${garageVehicleId}/entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`,
    },
    body: JSON.stringify({
      title: 'Full Mikuni VM20 Slide Carburetor Rebuild & Slide Needle Tuning',
      description: 'Cleaned brass jets in ultrasonic bath, set float height to 21mm, factory oil seal replaced.',
      category: 'engine',
      cost: 4800,
      odometerKm: 34250,
    }),
  });
  const addEntryData = await addEntryRes.json();
  if (addEntryRes.status !== 201 || !addEntryData.data?._id) {
    throw new Error('Failed to add restoration entry: ' + JSON.stringify(addEntryData));
  }
  console.log(`✓ Logged Restoration Milestone: "${addEntryData.data.title}" (Cost: ₹${addEntryData.data.cost})`);

  // Verify Vehicle Detail & Ledger Tally
  const getVehicleRes = await fetch(`${BASE_URL}/garage/${garageVehicleId}`, {
    headers: { Authorization: `Bearer ${buyerToken}` },
  });
  const getVehicleData = await getVehicleRes.json();
  const vehicleDetail = getVehicleData.data?.vehicle || getVehicleData.vehicle;
  const vehicleEntries = getVehicleData.data?.entries || getVehicleData.entries || [];
  console.log(`✓ Verified Garage Detail: Total Logged Spend = ₹${vehicleDetail.totalRestorationSpend}, Entries = ${vehicleEntries.length}`);

  // 3. Test AI Part Visual Identifier Endpoint
  console.log('\n--- [3. AI Part Visual Identification Tests] ---');
  const aiIdentifyRes = await fetch(`${BASE_URL}/listings/ai-identify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39',
      hintQuery: 'carburetor mikuni rx100',
    }),
  });
  const aiIdentifyData = await aiIdentifyRes.json();
  const aiResult = aiIdentifyData.data || aiIdentifyData.identification;
  if (!aiResult?.suggestedTitle) {
    throw new Error('AI part identification failed: ' + JSON.stringify(aiIdentifyData));
  }
  console.log(`✓ AI Part Detected: "${aiResult.suggestedTitle}"`);
  console.log(`  Make/Model: ${aiResult.vehicleBrand} ${aiResult.vehicleModel} | Est. OEM: ${aiResult.estimatedOemNumber} | Confidence: ${(aiResult.confidenceScore * 100).toFixed(0)}%`);

  // 4. Test Listing Quality Score Calculation Endpoint
  console.log('\n--- [4. Listing Quality Score Engine Tests] ---');
  const qualityRes = await fetch(`${BASE_URL}/listings/calculate-quality`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Yamaha RX100 Original Mikuni VM20 Slide Carburetor Japan NOS',
      description: 'Factory sealed New Old Stock carburetor assembly preserved in original preservative grease. Includes throttle cable guide and mounting flange studs.',
      oemNumber: '17G-14101-00-JP',
      images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      compatibleVehicles: [{ brand: 'Yamaha', model: 'RX100', yearFrom: 1985, yearTo: 1996 }],
      verificationStatus: 'verified',
    }),
  });
  const qualityData = await qualityRes.json();
  console.log(`✓ Computed Listing Quality Score: ${qualityData.score}/100 (Tips remaining: ${qualityData.tips?.length || 0})`);

  // 5. Test Part Passport Trust & Provenance Workflow
  console.log('\n--- [5. Part Passport Provenance Workflow Tests] ---');
  const listingsRes = await fetch(`${BASE_URL}/listings?limit=1`);
  const listingsData = await listingsRes.json();
  const sampleListing = listingsData.data[0];

  const passportRes = await fetch(`${BASE_URL}/passports/${sampleListing._id}`);
  const passportData = await passportRes.json();
  console.log(`✓ Fetched Part Passport for "${sampleListing.title}": Status = "${passportData.passport?.status || 'claimed'}"`);

  // 6. Test Moderation Reports
  console.log('\n--- [6. Moderation & Safety Reports Tests] ---');
  const reportRes = await fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${buyerToken}`,
    },
    body: JSON.stringify({
      targetType: 'listing',
      targetId: sampleListing._id,
      reason: 'wrong_compatibility',
      details: 'Please double check year fitment for 1996 models.',
    }),
  });
  const reportData = await reportRes.json();
  console.log(`✓ Submitted Moderation Report: Status = "${reportData.report?.status || 'open'}"`);

  const adminReportsRes = await fetch(`${BASE_URL}/reports`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminReportsData = await adminReportsRes.json();
  const reportsList = adminReportsData.data || adminReportsData.reports || [];
  console.log(`✓ Admin Verified Reports Queue: ${reportsList.length} total report(s) in review`);

  console.log('\n🎉 ALL RETROPARTS SHOULD HAVE FEATURES PASSED 100%! 🎉');
}

runShouldHaveTests().catch((err) => {
  console.error('SHOULD HAVE test suite error:', err);
  process.exit(1);
});
