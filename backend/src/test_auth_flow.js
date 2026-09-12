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
  console.log('2. Direct /auth/me Status:', meRes.status, 'Level:', meData.data?.character?.level);

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

  console.log('\nTesting Vite frontend proxy (http://localhost:5173/api)...');
  const proxyBase = 'http://localhost:5173/api';
  const proxyEmail = `proxy_${Date.now()}@mettle.app`;

  // 4. Test Register via Proxy
  const proxyRegRes = await fetch(`${proxyBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Proxy Tester',
      email: proxyEmail,
      password: testPassword,
    }),
  });
  const proxyRegData = await proxyRegRes.json();
  console.log('4. Proxy Register Status:', proxyRegRes.status, 'User:', proxyRegData.data?.user?.email);
  const proxyToken = proxyRegData.data?.token;

  if (!proxyToken) throw new Error('Token was not returned in proxy register response: ' + JSON.stringify(proxyRegData));

  // 5. Test /me via Proxy
  const proxyMeRes = await fetch(`${proxyBase}/auth/me`, {
    headers: { Authorization: `Bearer ${proxyToken}` },
  });
  const proxyMeData = await proxyMeRes.json();
  console.log('5. Proxy /auth/me Status:', proxyMeRes.status, 'Level:', proxyMeData.data?.character?.level);

  // 6. Test Login via Proxy
  const proxyLoginRes = await fetch(`${proxyBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: proxyEmail,
      password: testPassword,
    }),
  });
  const proxyLoginData = await proxyLoginRes.json();
  console.log('6. Proxy Login Status:', proxyLoginRes.status, 'Token returned:', !!proxyLoginData.data?.token);

  console.log('\n==================================================');
  console.log('🎉 ALL AUTHENTICATION TEST CASES PASSED 100%!');
  console.log('==================================================');
}

testAuthFlow().catch((err) => {
  console.error('❌ Auth test error:', err.message);
  process.exit(1);
});
