const BASE_URL = 'http://localhost:5000/api';

async function runPhase7Tests() {
  console.log('=== Starting RetroParts Phase 7 Verification Test Suite ===\n');

  // 1. Authenticate Admin
  console.log('--- [1. Admin Authentication Setup] ---');
  const adminRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@retroparts.com', password: 'password123' }),
  });
  const admin = await adminRes.json();
  if (adminRes.status !== 200 || !admin.token) {
    throw new Error('Admin login failed: ' + JSON.stringify(admin));
  }
  const adminToken = admin.token;
  console.log(`✓ Authenticated Admin: "${admin.user.name}" (${admin.user.role})`);

  // 2. Fetch Marketplace Statistics
  console.log('\n--- [2. Admin Platform Metrics & Stats] ---');
  const statsRes = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const statsData = await statsRes.json();
  if (statsRes.status !== 200 || !statsData.data) {
    throw new Error('Fetch admin stats failed: ' + JSON.stringify(statsData));
  }
  console.log(`✓ Platform Metrics Loaded:`);
  console.log(`  Users: ${statsData.data.users.total} (${statsData.data.users.sellers} sellers)`);
  console.log(`  Listings: ${statsData.data.listings.total} (${statsData.data.listings.active} active)`);
  console.log(`  Orders: ${statsData.data.orders.total} (Revenue: ₹${statsData.data.orders.totalRevenue})`);

  // 3. Create a New Seller & Request Verification
  console.log('\n--- [3. Seller Submits Verification Request] ---');
  const newSellerEmail = `vintage_specialist_${Date.now()}@retroparts.test`;
  const registerSellerRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Delhi Vintage Motoring House',
      email: newSellerEmail,
      password: 'password123',
      role: 'seller',
      phone: '+91 99110 22334',
    }),
  });
  const newSellerData = await registerSellerRes.json();
  const sellerToken = newSellerData.token;
  const sellerId = newSellerData.user.id;
  console.log(`✓ Created Seller "${newSellerData.user.name}" (Initial Verified Status: ${newSellerData.user.isVerifiedSeller})`);

  // Submit verification request
  const verifyReqRes = await fetch(`${BASE_URL}/auth/verify-seller`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${sellerToken}` },
  });
  const verifyReqData = await verifyReqRes.json();
  console.log(`✓ Verification Request Submitted: Status is now "${verifyReqData.verificationStatus}"`);

  // 4. Admin Inspects Verification Queue
  console.log('\n--- [4. Admin Inspects Pending Verification Queue] ---');
  const queueRes = await fetch(`${BASE_URL}/admin/verifications`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const queueData = await queueRes.json();
  const pendingUsers = Array.isArray(queueData.data) ? queueData.data : [];
  const foundInQueue = pendingUsers.find((u) => u._id === sellerId);
  if (!foundInQueue) {
    throw new Error('Seller not found in pending verification queue!');
  }
  console.log(`✓ Found Seller "${foundInQueue.name}" in Admin Verification Queue (Status: ${foundInQueue.verificationStatus})`);

  // 5. Admin Approves Seller Verification
  console.log('\n--- [5. Admin Approves Seller Verification] ---');
  const approveRes = await fetch(`${BASE_URL}/admin/verifications/${sellerId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: 'verified',
      isVerifiedSeller: true,
    }),
  });
  const approveData = await approveRes.json();
  if (approveRes.status !== 200 || !approveData.data.isVerifiedSeller) {
    throw new Error('Approval failed: ' + JSON.stringify(approveData));
  }
  console.log(`✓ Admin Approved! User "${approveData.data.name}" isVerifiedSeller: ${approveData.data.isVerifiedSeller}`);

  // 6. Security Verification: Non-Admin Access Rejected
  console.log('\n--- [6. Security & RBAC Enforcement] ---');
  const forbiddenRes = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${sellerToken}` },
  });
  if (forbiddenRes.status === 403) {
    console.log('✓ Non-admin user blocked from /api/admin: 403 Forbidden (RBAC Verified)');
  } else {
    throw new Error('Expected 403 Forbidden for non-admin on admin route, got ' + forbiddenRes.status);
  }

  console.log('\n🎉 ALL PHASE 7 DASHBOARDS & ADMIN CONSOLE TESTS PASSED 100%! 🎉');
}

runPhase7Tests().catch((err) => {
  console.error('Phase 7 test suite error:', err);
  process.exit(1);
});
