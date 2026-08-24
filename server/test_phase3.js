const BASE_URL = 'http://localhost:5000/api';

async function runPhase3Tests() {
  console.log('=== Starting RetroParts Phase 3 Verification Test Suite ===\n');

  // 1. Multi-Token Search Test for "RX100 speedometer"
  console.log('--- [1. Intelligent Search: "RX100 speedometer"] ---');
  const rx100Res = await fetch(`${BASE_URL}/listings?search=RX100+speedometer`);
  const rx100Data = await rx100Res.json();
  const listings = Array.isArray(rx100Data) ? rx100Data : (rx100Data.data || []);
  if (rx100Res.status !== 200 || listings.length === 0) {
    throw new Error('Search "RX100 speedometer" returned 0 results: ' + JSON.stringify(rx100Data));
  }
  const topRx100 = listings[0];
  console.log(`✓ Found ${listings.length} match(es): "${topRx100.title}" (Price: ₹${topRx100.price})`);

  // 2. Multi-Token Search Test for "Honda City brake pad"
  console.log('\n--- [2. Intelligent Search: "Honda City brake pad"] ---');
  const hondaRes = await fetch(`${BASE_URL}/listings?search=Honda+City+brake+pad`);
  const hondaData = await hondaRes.json();
  const hondaListings = Array.isArray(hondaData) ? hondaData : (hondaData.data || []);
  if (hondaRes.status !== 200 || hondaListings.length === 0) {
    throw new Error('Search "Honda City brake pad" returned 0 results: ' + JSON.stringify(hondaData));
  }
  console.log(`✓ Found ${hondaListings.length} match(es): "${hondaListings[0].title}" (OEM: ${hondaListings[0].oemNumber})`);

  // 3. Multi-Token Search Test for "Bullet 350 crankshaft"
  console.log('\n--- [3. Intelligent Search: "Bullet 350 crankshaft"] ---');
  const bulletRes = await fetch(`${BASE_URL}/listings?search=Bullet+350+crankshaft`);
  const bulletData = await bulletRes.json();
  const bulletListings = Array.isArray(bulletData) ? bulletData : (bulletData.data || []);
  if (bulletRes.status !== 200 || bulletListings.length === 0) {
    throw new Error('Search "Bullet 350 crankshaft" returned 0 results: ' + JSON.stringify(bulletData));
  }
  console.log(`✓ Found ${bulletListings.length} match(es): "${bulletListings[0].title}"`);

  // 4. Vehicle Compatibility Checker API
  console.log('\n--- [4. Vehicle Compatibility Verification] ---');
  const compRes = await fetch(`${BASE_URL}/vehicles/check-compatibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listingId: topRx100._id,
      brand: 'Yamaha',
      model: 'RX100',
      year: 1989,
    }),
  });
  const compData = await compRes.json();
  if (compRes.status !== 200 || !compData.compatible) {
    throw new Error('Compatibility check failed: ' + JSON.stringify(compData));
  }
  console.log(`✓ Direct Compatibility: Yamaha RX100 with "${topRx100.title}" => ${compData.matchType} (${compData.details})`);

  // Incompatibility Check
  const incompRes = await fetch(`${BASE_URL}/vehicles/check-compatibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      listingId: topRx100._id,
      brand: 'Honda',
      model: 'City Type-Z',
      year: 1998,
    }),
  });
  const incompData = await incompRes.json();
  if (incompData.compatible === false) {
    console.log(`✓ Incompatibility Check: Honda City with Yamaha RX100 gauge => Correctly marked incompatible (compatible: false)`);
  } else {
    throw new Error('Expected incompatible, but returned true');
  }

  // 5. Category & Filter Queries
  console.log('\n--- [5. Category & Multi-Filter Query Test] ---');
  const filterRes = await fetch(`${BASE_URL}/listings?category=Lighting+%26+Gauges&condition=NOS+(New+Old+Stock)`);
  const filterData = await filterRes.json();
  const filterListings = Array.isArray(filterData) ? filterData : (filterData.data || []);
  console.log(`✓ Filtered query (Lighting & Gauges + NOS): Found ${filterListings.length} items`);

  console.log('\n🎉 ALL PHASE 3 SEARCH & DISCOVERY VERIFICATION TESTS PASSED 100%! 🎉');
}

runPhase3Tests().catch((err) => {
  console.error('Phase 3 test suite error:', err);
  process.exit(1);
});
