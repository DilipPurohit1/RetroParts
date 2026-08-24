const BASE_URL = 'http://localhost:5000/api/v1';

async function runCouldHaveTests() {
  console.log('=== Starting RetroParts COULD HAVE Features Verification Test Suite ===\n');

  // 1. Authenticate Seller
  console.log('--- [1. Authentication Setup] ---');
  const sellerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'seller@retroparts.com', password: 'password123' }),
  });
  const sellerLogin = await sellerLoginRes.json();
  const sellerToken = sellerLogin.token;
  console.log(`✓ Authenticated Seller: "${sellerLogin.user.name}"`);

  // 2. Test Price Intelligence Estimator
  console.log('\n--- [2. Price Intelligence & Market Average Estimator Tests] ---');
  const priceEstimateRes = await fetch(`${BASE_URL}/listings/price-estimate?brand=Yamaha&model=RX100&category=Engine%20Parts`);
  const priceEstimateData = await priceEstimateRes.json();
  if (!priceEstimateData.success || !priceEstimateData.data?.averagePrice) {
    throw new Error('Price intelligence query failed: ' + JSON.stringify(priceEstimateData));
  }
  console.log(`✓ Price Intelligence Calculated for Yamaha RX100 Engine Spares:`);
  console.log(`  Average Market Price: ₹${priceEstimateData.data.averagePrice.toLocaleString('en-IN')}`);
  console.log(`  Fair Value Range: ₹${priceEstimateData.data.fairRangeLow.toLocaleString('en-IN')} - ₹${priceEstimateData.data.fairRangeHigh.toLocaleString('en-IN')}`);
  console.log(`  Confidence Tier: "${priceEstimateData.data.confidence.toUpperCase()}" | Trend: ${priceEstimateData.data.valuationTrend}`);

  // 3. Test Seller Vacation Mode
  console.log('\n--- [3. Seller Vacation Mode Toggle Tests] ---');
  const activateVacationRes = await fetch(`${BASE_URL}/users/me/vacation`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify({
      active: true,
      until: '2026-09-01',
      message: 'Away on rare motorcycle sourcing trip in Japan. Inquiries answered within 48h!',
    }),
  });
  const activateVacationData = await activateVacationRes.json();
  if (!activateVacationData.success || !activateVacationData.vacationMode?.active) {
    throw new Error('Failed to activate vacation mode: ' + JSON.stringify(activateVacationData));
  }
  console.log(`✓ Vacation Mode Activated: Active = ${activateVacationData.vacationMode.active}`);
  console.log(`  Message: "${activateVacationData.vacationMode.message}"`);

  // Deactivate Vacation Mode
  const deactivateVacationRes = await fetch(`${BASE_URL}/users/me/vacation`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sellerToken}`,
    },
    body: JSON.stringify({ active: false }),
  });
  const deactivateVacationData = await deactivateVacationRes.json();
  console.log(`✓ Vacation Mode Deactivated: Active = ${deactivateVacationData.vacationMode.active}`);

  console.log('\n🎉 ALL RETROPARTS COULD HAVE FEATURES PASSED 100%! 🎉');
}

runCouldHaveTests().catch((err) => {
  console.error('COULD HAVE test suite error:', err);
  process.exit(1);
});
