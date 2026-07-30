const { spawn } = require('child_process');
const http = require('http');

console.log('Starting automated tests for Subdomain Router...');

// Spawn the server process on a different port to avoid conflicts
const server = spawn('node', ['server.js'], {
  env: { ...process.env, PORT: '3005' }
});

// Helper to make request and get response text
function makeRequest(hostHeader) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '127.0.0.1',
      port: 3005,
      path: '/',
      method: 'GET',
      headers: {
        'Host': hostHeader
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

// Wait for server to boot
setTimeout(async () => {
  let passed = true;

  const testCases = [
    {
      host: 'localhost:3005',
      expected: 'Main Portal: khxzi.xyz',
      desc: 'Base Domain (No Subdomain)'
    },
    {
      host: 'www.localhost:3005',
      expected: 'Main Portal: khxzi.xyz',
      desc: 'Base Domain with www (Treated as No Subdomain)'
    },
    {
      host: 'login.localhost:3005',
      expected: 'Access Portal | login.khxzi.xyz',
      desc: 'Login Subdomain'
    },
    {
      host: 'dashboard.localhost:3005',
      expected: 'Dashboard Portal | dashboard.khxzi.xyz',
      desc: 'Dashboard Subdomain'
    },
    {
      host: 'random-sub.localhost:3005',
      expected: 'Welcome to the custom subdomain',
      desc: 'Wildcard Subdomain Catch-All (random-sub)'
    },
    {
      host: 'my-custom-subdomain.localhost:3005',
      expected: 'my-custom-subdomain',
      desc: 'Wildcard Subdomain text validation'
    }
  ];

  console.log('\n--- Running Test Cases ---');
  for (const tc of testCases) {
    try {
      const res = await makeRequest(tc.host);
      const isOk = res.body.includes(tc.expected);
      if (isOk) {
        console.log(`[PASS] ${tc.desc} (Host: ${tc.host})`);
      } else {
        console.log(`[FAIL] ${tc.desc} (Host: ${tc.host})`);
        console.log(`       Expected content: "${tc.expected}"`);
        console.log(`       Response snippet: "${res.body.substring(0, 100).replace(/\n/g, ' ')}..."`);
        passed = false;
      }
    } catch (err) {
      console.log(`[FAIL] ${tc.desc} (Host: ${tc.host}) - Connection error: ${err.message}`);
      passed = false;
    }
  }

  // Terminate server
  server.kill();
  
  console.log('\n--- Test Result ---');
  if (passed) {
    console.log('ALL TESTS PASSED SUCCESSFULLY! ✅');
    process.exit(0);
  } else {
    console.log('SOME TESTS FAILED. ❌');
    process.exit(1);
  }
}, 2000);
