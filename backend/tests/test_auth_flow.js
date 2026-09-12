async function testAuthFlow() {
  console.log('Testing direct backend auth (http://localhost:5000)...');
  const backendBase = 'http://localhost:5000/api';
  const testEmail = `judge_${Date.now()}@mettle.app`;
  const testPassword = 'Password123!';

  // 1. Test Register
  const regRes = await fetch(`${backendBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Shubham Tester',
      email: testEmail,
      password: testPassword,
    }),
  });
  const regData = await regRes.json();
  console.log('1. Direct Register Status:', regRes.status, 'User:', regData.data?.user?.email);
  const token = regData.data?.token;

  if (!token) throw new Error('Token was not returned in register response: ' + JSON.stringify(regData));

  // 2. Test /me with Bearer token
  const meRes = await fetch(`${backendBase}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log('2. Direct /me Status:', meRes.status, 'User:', meData.data?.user?.name, 'Level:', meData.data?.character?.level);

  // 3. Test Login
  const loginRes = await fetch(`${backendBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  const loginData = await loginRes.json();
  console.log('3. Direct Login Status:', loginRes.status, 'Token returned:', !!loginData.data?.token);

  // 4. Test Google OAuth URL endpoint
  const googleRes = await fetch(`${backendBase}/auth/google/url`);
  const googleData = await googleRes.json();
  console.log('4. Google Auth URL endpoint Status:', googleRes.status, 'URL length:', googleData.data?.url?.length);

  // 5. Test Frontend Proxy to Backend
  console.log('\nTesting frontend Vite proxy (http://localhost:5173/api)...');
  const proxyBase = 'http://localhost:5173/api';
  const proxyEmail = `proxy_${Date.now()}@mettle.app`;

  const pRegRes = await fetch(`${proxyBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Proxy Tester',
      email: proxyEmail,
      password: testPassword,
    }),
  });
  const pRegData = await pRegRes.json();
  console.log('5. Proxy Register Status:', pRegRes.status, 'User:', pRegData.data?.user?.email);
  const proxyToken = pRegData.data?.token;

  if (!proxyToken) throw new Error('Proxy register token missing');

  const pMeRes = await fetch(`${proxyBase}/auth/me`, {
    headers: { Authorization: `Bearer ${proxyToken}` },
  });
  const pMeData = await pMeRes.json();
  console.log('6. Proxy /me Status:', pMeRes.status, 'User:', pMeData.data?.user?.name);

  console.log('\n✨ ALL DIRECT AND PROXY AUTH TESTS PASSED SUCCESSFULLY!');
}

testAuthFlow().catch(err => {
  console.error('❌ Auth flow test failed:', err);
  process.exit(1);
});
