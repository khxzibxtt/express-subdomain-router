# Express Subdomain Router

A single-file Node.js Express server designed to dynamically parse and route incoming subdomains natively. Optimized to run on a single Render Free Plan service without requiring complex server configuration (like NGINX/Apache reverse proxies).

## Features

- **Native Subdomain Resolution:** Middleware inspects the incoming `host` header, strips ports, and extracts the leftmost subdomain segment.
- **Auto-Configuring Client Links:** The landing page dynamically extracts the host domain and port, auto-generating the test links for easy local/live navigation.
- **Premium Dark-Themed UI:** Beautiful, modern slate/indigo templates crafted using utility-first Tailwind CSS.
- **Render & Custom Domain Support:** Automatically detects local environments (`localhost`), Render subdomains (`*.onrender.com`), and custom domains (`*.khxzi.xyz`).

## File Structure

```
.
├── BUILD_LOG.md       # Development logs and milestones
├── package.json       # Project configurations and npm scripts
├── README.md          # Project documentation (this file)
├── server.js          # Core Express application and routing middleware
└── test.js            # Automated integration test script
```

## Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   - Production mode:
     ```bash
     npm start
     ```
   - Development mode (runs with auto-watch enabled):
     ```bash
     npm run dev
     ```

3. **Verify locally:**
   You can verify subdomain routing using local loopbacks. In your browser, visit:
   - Base Portal: [http://localhost:3000](http://localhost:3000)
   - Login Portal: [http://login.localhost:3000](http://login.localhost:3000)
   - Dashboard: [http://dashboard.localhost:3000](http://dashboard.localhost:3000)
   - Custom Wildcard: [http://anything.localhost:3000](http://anything.localhost:3000)

## Automated Tests

Run the built-in automated test suite to verify routing behavior against mock hosts:
```bash
node test.js
```

## Deployment to Render

To deploy this application to **Render Free Plan**:

1. **Create Web Service:**
   - Connect your GitHub repository to Render.
   - Choose the **Web Service** option.
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

2. **Render Dynamic Subdomain Setup (Wildcard Domains):**
   Render allows wildcard domains on custom domains. 
   - Go to your Web Service dashboard, click **Settings**, and scroll to **Custom Domains**.
   - Add your custom root domain (e.g. `khxzi.xyz`) and point your DNS `A` records to Render's IP.
   - Add a wildcard domain (e.g., `*.khxzi.xyz`) by creating a `CNAME` record pointing to your Render service address (`your-app.onrender.com`).
   - Express will automatically intercept headers like `login.khxzi.xyz` or `dashboard.khxzi.xyz` and match the paths dynamically!
