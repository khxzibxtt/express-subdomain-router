const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse and log the subdomain
app.use((req, res, next) => {
  const host = req.get('host') || '';
  const hostname = host.split(':')[0].toLowerCase();
  const parts = hostname.split('.');

  let subdomain = null;

  // 1. Check for localhost subdomains (e.g., login.localhost)
  if (parts.length === 2 && parts[1] === 'localhost') {
    subdomain = parts[0];
  } 
  // 2. Check for Render default domains (e.g., login.myapp.onrender.com)
  else if (hostname.endsWith('.onrender.com')) {
    if (parts.length > 3) {
      subdomain = parts.slice(0, -3).join('.');
    }
  } 
  // 3. Check for standard domains (e.g., login.khxzi.xyz)
  else if (parts.length > 2) {
    subdomain = parts.slice(0, -2).join('.');
  }

  // Treat 'www' as no subdomain
  if (subdomain === 'www') {
    subdomain = null;
  }

  req.subdomain = subdomain;

  console.log(`Incoming request from subdomain: [${subdomain || 'none'}] | Host: ${host}`);
  next();
});

// Common HTML wrapper with Tailwind CSS CDN and Premium UI Styling
const renderPage = (title, content) => `
<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .gradient-bg {
            background: radial-gradient(circle at top, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 50%);
        }
    </style>
</head>
<body class="h-full relative overflow-x-hidden flex flex-col justify-between">
    <div class="absolute inset-0 gradient-bg pointer-events-none z-0"></div>
    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col justify-center">
        ${content}
    </div>
    <footer class="relative z-10 w-full text-center py-6 text-xs text-slate-500 border-t border-slate-900 bg-slate-950/50 backdrop-blur-md">
        <p>&copy; ${new Date().getFullYear()} khxzi.xyz &bull; Powered by Express Subdomain Router</p>
    </footer>
</body>
</html>
`;

// Route mapping based on the parsed subdomain
app.get('*', (req, res) => {
  const sub = req.subdomain;

  // Render Main Site (No Subdomain)
  if (!sub) {
    return res.send(renderPage('Main Portal: khxzi.xyz', `
      <div class="text-center max-w-3xl mx-auto my-12">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-6">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          Subdomain Routing Active
        </span>
        <h1 class="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent mb-6">
          Main Portal: khxzi.xyz
        </h1>
        <p class="text-lg text-slate-400 mb-10 leading-relaxed">
          Welcome to the landing page. This application dynamically handles custom subdomains natively within Express.
        </p>

        <!-- Subdomain Switcher Box -->
        <div class="bg-slate-900/55 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl text-left max-w-xl mx-auto">
          <h2 class="text-xl font-bold text-slate-200 mb-4">Interactive Test Console</h2>
          <p class="text-sm text-slate-400 mb-6">
            Click the links below to test the dynamic subdomain routing. The system will automatically preserve your current domain and port config.
          </p>

          <div class="space-y-4">
            <a id="link-login" href="#" class="flex items-center justify-between p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition group">
              <div>
                <div class="font-semibold text-indigo-400 group-hover:text-indigo-300 transition">login.YOUR_DOMAIN</div>
                <div class="text-xs text-slate-500">Serves a stylized secure login page</div>
              </div>
              <span class="text-slate-600 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1 duration-200">&rarr;</span>
            </a>

            <a id="link-dashboard" href="#" class="flex items-center justify-between p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition group">
              <div>
                <div class="font-semibold text-emerald-400 group-hover:text-emerald-300 transition">dashboard.YOUR_DOMAIN</div>
                <div class="text-xs text-slate-500">Serves a mock database-driven dashboard</div>
              </div>
              <span class="text-slate-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1 duration-200">&rarr;</span>
            </a>

            <a id="link-wildcard" href="#" class="flex items-center justify-between p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition group">
              <div>
                <div class="font-semibold text-violet-400 group-hover:text-violet-300 transition">test.YOUR_DOMAIN</div>
                <div class="text-xs text-slate-500">Catch-all fallback welcome page</div>
              </div>
              <span class="text-slate-600 group-hover:text-violet-400 transition-transform group-hover:translate-x-1 duration-200">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      <script>
        // Dynamically build the URLs based on the current host port structure to ensure local testing works seamlessly
        const currentHost = window.location.host;
        let baseDomain = currentHost;
        
        // Remove 'www.' or any other subdomain to find base domain if accessing via one
        const hostParts = currentHost.split('.');
        
        if (hostParts.includes('localhost')) {
          baseDomain = 'localhost' + (window.location.port ? ':' + window.location.port : '');
        } else if (currentHost.endsWith('.onrender.com')) {
          // Render domain: format looks like my-app.onrender.com or sub.my-app.onrender.com
          if (hostParts.length > 3) {
             baseDomain = hostParts.slice(-3).join('.');
          }
        } else {
          // Standard custom domain (e.g. sub.khxzi.xyz -> khxzi.xyz)
          if (hostParts.length > 2) {
            baseDomain = hostParts.slice(-2).join('.');
          }
        }

        const protocol = window.location.protocol;
        document.getElementById('link-login').href = protocol + '//login.' + baseDomain;
        document.getElementById('link-dashboard').href = protocol + '//dashboard.' + baseDomain;
        document.getElementById('link-wildcard').href = protocol + '//test.' + baseDomain;

        // Display exact URLs inside the console UI
        document.getElementById('link-login').querySelector('.font-semibold').innerText = 'login.' + baseDomain;
        document.getElementById('link-dashboard').querySelector('.font-semibold').innerText = 'dashboard.' + baseDomain;
        document.getElementById('link-wildcard').querySelector('.font-semibold').innerText = 'test.' + baseDomain;
      </script>
    `));
  }

  // Render Login Subdomain
  if (sub === 'login') {
    return res.send(renderPage('Access Portal | login.khxzi.xyz', `
      <div class="w-full max-w-md mx-auto my-12">
        <div class="text-center mb-8">
          <a href="/" id="back-to-home" class="inline-flex items-center text-sm text-slate-400 hover:text-white transition gap-2 mb-4 group">
            <span class="transition-transform group-hover:-translate-x-1">&larr;</span> Back to Main Portal
          </a>
          <h1 class="text-3xl font-extrabold text-slate-100">Sign in to your account</h1>
          <p class="text-sm text-slate-400 mt-2">Dynamic login server node active</p>
        </div>

        <div class="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <form class="space-y-6" onsubmit="event.preventDefault(); alert('Authentication success simulation!');">
            <div>
              <label for="username" class="block text-sm font-medium text-slate-300">Username or Email</label>
              <input type="text" id="username" required class="mt-2 block w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-600 transition" placeholder="you@khxzi.xyz">
            </div>

            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium text-slate-300">Password</label>
                <a href="#" class="text-xs text-indigo-400 hover:underline">Forgot password?</a>
              </div>
              <input type="password" id="password" required class="mt-2 block w-full rounded-xl bg-slate-950 border border-slate-800 text-slate-100 px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-600 transition" placeholder="••••••••">
            </div>

            <div class="flex items-center">
              <input id="remember-me" type="checkbox" class="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-slate-900">
              <label for="remember-me" class="ml-2 block text-sm text-slate-400">Remember my session</label>
            </div>

            <button type="submit" class="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-lg shadow-indigo-600/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition">
              Sign In
            </button>
          </form>
        </div>
      </div>

      <script>
        // Update home navigation
        const currentHost = window.location.host;
        let baseDomain = currentHost.replace('login.', '');
        document.getElementById('back-to-home').href = window.location.protocol + '//' + baseDomain;
      </script>
    `));
  }

  // Render Dashboard Subdomain
  if (sub === 'dashboard') {
    // Generate some random fake database records for dynamic listing
    const mockUsers = [
      { id: '1082', name: 'Alexander Wright', email: 'alex@khxzi.xyz', role: 'Administrator', status: 'Active' },
      { id: '1083', name: 'Sophia Chen', email: 'sophia.c@partner.xyz', role: 'Editor', status: 'Active' },
      { id: '1084', name: 'Marcus Miller', email: 'marcus@khxzi.xyz', role: 'Support Agent', status: 'Suspended' },
      { id: '1085', name: 'Clara Oswald', email: 'clara@tardis.xyz', role: 'Contributor', status: 'Pending' }
    ];

    return res.send(renderPage('Dashboard Portal | dashboard.khxzi.xyz', `
      <div class="space-y-8">
        <!-- Top bar -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-900">
          <div>
            <a href="/" id="back-to-home" class="inline-flex items-center text-xs text-slate-400 hover:text-white transition gap-1.5 mb-2 group">
              <span class="transition-transform group-hover:-translate-x-1">&larr;</span> Main Portal
            </a>
            <h1 class="text-3xl font-extrabold text-slate-100">Executive Dashboard</h1>
            <p class="text-sm text-slate-400 mt-1">Real-time analytical telemetry for subdomain routing engine</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Live Sync
            </span>
          </div>
        </div>

        <!-- Metrics widgets -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subdomain Access Requests</div>
            <div class="text-3xl font-bold mt-2 text-indigo-400">84,921</div>
            <div class="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span class="text-emerald-400 font-semibold">&uarr; 12.3%</span> from last week
            </div>
          </div>

          <div class="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unique Active Nodes</div>
            <div class="text-3xl font-bold mt-2 text-emerald-400">14</div>
            <div class="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span class="text-emerald-400 font-semibold">&uarr; 2.5%</span> scaling target met
            </div>
          </div>

          <div class="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Response Time</div>
            <div class="text-3xl font-bold mt-2 text-violet-400">14ms</div>
            <div class="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span class="text-emerald-400 font-semibold">&darr; 8%</span> latency optimized
            </div>
          </div>
        </div>

        <!-- Data table -->
        <div class="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div class="px-6 py-5 border-b border-slate-900 flex justify-between items-center">
            <h2 class="font-bold text-slate-200">System Users (Mock database)</h2>
            <button onclick="alert('Refresh simulation complete.');" class="px-3 py-1.5 text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg hover:text-white transition">
              Refresh Data
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-400">
              <thead class="bg-slate-950/60 text-slate-300 font-semibold border-b border-slate-900">
                <tr>
                  <th class="px-6 py-4">ID</th>
                  <th class="px-6 py-4">User</th>
                  <th class="px-6 py-4">Role</th>
                  <th class="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-900">
                ${mockUsers.map(u => `
                  <tr class="hover:bg-slate-900/20 transition">
                    <td class="px-6 py-4 font-mono text-xs text-slate-500">#${u.id}</td>
                    <td class="px-6 py-4">
                      <div class="font-medium text-slate-200">${u.name}</div>
                      <div class="text-xs text-slate-500">${u.email}</div>
                    </td>
                    <td class="px-6 py-4 text-xs font-medium text-slate-300">${u.role}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                        u.status === 'Suspended' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-amber-500/10 text-amber-400'
                      }">
                        ${u.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <script>
        // Update home navigation
        const currentHost = window.location.host;
        let baseDomain = currentHost.replace('dashboard.', '');
        document.getElementById('back-to-home').href = window.location.protocol + '//' + baseDomain;
      </script>
    `));
  }

  // Render Wildcard Subdomain Catch-All
  return res.send(renderPage(`Subdomain Welcome | ${sub}.khxzi.xyz`, `
    <div class="text-center max-w-xl mx-auto my-12">
      <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-6">
        <span class="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
        Wildcard Catcher
      </span>
      
      <div class="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl mb-8">
        <div class="w-16 h-16 bg-violet-500/10 text-violet-400 border border-violet-500/25 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
          ${sub.charAt(0).toUpperCase()}
        </div>
        
        <h1 class="text-2xl font-bold text-slate-100 mb-2">
          Welcome to the custom subdomain
        </h1>
        <div class="inline-block px-4 py-2 bg-slate-950 text-indigo-400 border border-slate-850 rounded-xl font-mono text-lg font-semibold my-4">
          ${sub}
        </div>
        
        <p class="text-sm text-slate-400 mt-2 leading-relaxed">
          The Express router has successfully intercepted this wildcard route and resolved your custom hostname pattern automatically.
        </p>
      </div>

      <a href="/" id="back-to-home" class="inline-flex items-center text-sm text-slate-400 hover:text-white transition gap-2 group">
        <span class="transition-transform group-hover:-translate-x-1">&larr;</span> Return to Main Portal
      </a>
    </div>

    <script>
      // Update home navigation
      const currentHost = window.location.host;
      let baseDomain = currentHost.replace('${sub}.', '');
      document.getElementById('back-to-home').href = window.location.protocol + '//' + baseDomain;
    </script>
  `));
});

// Start the Express engine
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`Subdomain router initialized on port ${PORT}`);
  console.log(`Access Base Portal: http://localhost:${PORT}`);
  console.log(`Access Login Node:  http://login.localhost:${PORT}`);
  console.log(`Access Dashboard:   http://dashboard.localhost:${PORT}`);
  console.log(`Access Wildcard:    http://test.localhost:${PORT}`);
  console.log(`==================================================`);
});
