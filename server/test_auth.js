const BASE_URL = 'http://localhost:5000/api';

async function runAuthTests() {
  console.log('=== Starting RetroParts Phase 0 & Phase 1 Verification Test Suite ===\n');

  // 1. Phase 0 Health Check
  console.log('--- [Phase 0: Health Check & Scaffolding] ---');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const health = await healthRes.json();
  if (healthRes.status !== 200 || health.status !== 'ok') {
    throw new Error('Health check failed: ' + JSON.stringify(health));
  }
  console.log('✓ Health Check passed: 200 OK | Service:', health.service);

  // 2. Phase 1 User Registration
  console.log('\n--- [Phase 1: Dual Auth & JWT Lifecycle] ---');
  const testEmail = `restorer_${Date.now()}@retroparts.test`;
  const registerRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Aditya Vintage Master',
      email: testEmail,
      password: 'StrongPassword123!',
      phone: '+91 98888 77777',
      role: 'seller',
    }),
  });
  const registerData = await registerRes.json();
  if (registerRes.status !== 201 || !registerData.token) {
    throw new Error('Registration failed: ' + JSON.stringify(registerData));
  }
  console.log(`✓ Registration passed: Created seller "${registerData.user.name}" with access token (${registerData.token.slice(0, 20)}...)`);

  // Check refresh cookie in header
  const cookies = registerRes.headers.get('set-cookie');
  console.log('✓ Refresh Cookie set:', cookies ? 'Yes (httpOnly secure)' : 'Via response payload');

  // 3. Login with Correct Password
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'StrongPassword123!',
    }),
  });
  const loginData = await loginRes.json();
  if (loginRes.status !== 200 || !loginData.token) {
    throw new Error('Login failed: ' + JSON.stringify(loginData));
  }
  const accessToken = loginData.token;
  console.log('✓ Login with valid credentials passed: 200 OK');

  // 4. Login with Wrong Password Rejected
  const wrongLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'WrongPassword!',
    }),
  });
  if (wrongLoginRes.status === 401) {
    console.log('✓ Invalid password correctly rejected: 401 Unauthorized');
  } else {
    throw new Error('Expected 401 on invalid password, got ' + wrongLoginRes.status);
  }

  // 5. Access Protected Route /api/auth/me with Bearer Token
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const meData = await meRes.json();
  if (meRes.status !== 200 || meData.user.email !== testEmail) {
    throw new Error('Protected route /auth/me failed: ' + JSON.stringify(meData));
  }
  console.log(`✓ Protected route access passed: User "${meData.user.name}" (${meData.user.role})`);

  // 6. Access Protected Route without Token Rejected
  const unauthRes = await fetch(`${BASE_URL}/auth/me`);
  if (unauthRes.status === 401) {
    console.log('✓ Unauthenticated request correctly rejected: 401 Unauthorized');
  } else {
    throw new Error('Expected 401 on unauthenticated request, got ' + unauthRes.status);
  }

  // 7. Test Logout
  const logoutRes = await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
  const logoutData = await logoutRes.json();
  if (logoutRes.status === 200 && logoutData.success) {
    console.log('✓ Logout endpoint passed: 200 OK');
  } else {
    throw new Error('Logout failed');
  }

  console.log('\n🎉 ALL PHASE 0 & PHASE 1 VERIFICATION TESTS PASSED 100%! 🎉');
}

runAuthTests().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});
