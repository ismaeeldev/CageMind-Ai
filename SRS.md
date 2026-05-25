<style>
  :root {
    --primary: #d22828;
    --dark: #18181b;
    --light: #f4f4f5;
    --gray: #71717a;
    --border: #e4e4e7;
    --premium: #ca8a04;
  }
  body {
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: var(--dark);
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 850px;
    margin: 0 auto;
    padding: 30px;
  }
  .cover-page {
    text-align: center;
    padding: 60px 40px;
    background: linear-gradient(135deg, var(--dark) 0%, #27272a 100%);
    color: white;
    border-radius: 12px;
    margin-bottom: 50px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .cover-page h1 {
    margin: 0 0 15px 0;
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .cover-page p {
    color: #a1a1aa;
    font-size: 20px;
    margin: 0 0 30px 0;
  }
  .prepared-by {
    display: inline-block;
    background-color: var(--primary);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  h2 {
    color: var(--primary);
    border-bottom: 2px solid var(--border);
    padding-bottom: 10px;
    margin-top: 50px;
    font-size: 24px;
  }
  h3 {
    color: var(--dark);
    margin-top: 30px;
    font-size: 18px;
    display: flex;
    align-items: center;
  }
  ul {
    padding-left: 20px;
    color: #3f3f46;
  }
  li {
    margin-bottom: 10px;
  }
  .feature-box {
    background-color: var(--light);
    border-left: 4px solid var(--primary);
    padding: 20px;
    margin: 25px 0;
    border-radius: 0 8px 8px 0;
  }
  .premium-box {
    background-color: #fefce8;
    border-left: 4px solid var(--premium);
    padding: 20px;
    margin: 25px 0;
    border-radius: 0 8px 8px 0;
  }
  .premium-box h4 {
    color: #854d0e;
    margin-top: 0;
  }
  .warning-box {
    background-color: #fff1f2;
    border-left: 4px solid var(--primary);
    padding: 20px;
    margin: 40px 0;
    border-radius: 0 8px 8px 0;
  }
  .warning-box h4 {
    margin-top: 0;
    color: #9f1239;
    font-size: 18px;
  }
  .warning-box p {
    margin-bottom: 0;
    color: #be123c;
  }
  .badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    background-color: var(--light);
    color: var(--dark);
    margin-right: 8px;
    margin-bottom: 8px;
    border: 1px solid var(--border);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 30px 0;
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border-radius: 8px;
    overflow: hidden;
  }
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }
  th {
    background-color: var(--light);
    font-weight: 600;
    color: var(--dark);
  }
  tr:last-child td {
    border-bottom: none;
  }
</style>

<div class="container">

  <div class="cover-page">
    <h1>Software Requirements Specification</h1>
    <p>Octagon AI — UFC & MMA Analytics Platform</p>
    <div class="prepared-by">Prepared by: Muhammad Ismaeel</div>
  </div>

  <h2>1. Executive Summary</h2>
  <div class="feature-box">
    <p><strong>Octagon AI</strong> is transitioning from a static frontend prototype into a fully functional, production-ready SaaS platform. The system will leverage automated data scraping to provide live UFC/MMA analytics, dynamic Elo rankings, AI-driven prediction models, and an integrated Stripe paywall for premium subscriber access.</p>
  </div>

  <h2>2. Technology Stack & Architecture</h2>
  <p>The application will be built using a robust, scalable modern web stack optimized for performance and rapid data processing.</p>
  <ul>
    <li><span class="badge">Frontend</span> <strong>Next.js (React)</strong> - For server-side rendering, SEO optimization, and dynamic UI components.</li>
    <li><span class="badge">Backend</span> <strong>Node.js / Next.js API Routes</strong> - Handling logic, cron jobs, and secure API endpoints.</li>
    <li><span class="badge">Database</span> <strong>Neon DB (PostgreSQL)</strong> - A scalable, serverless relational database for storing fighters, events, and user data securely.</li>
    <li><span class="badge">Hosting</span> <strong>Vercel</strong> - For continuous integration and high-performance edge deployment.</li>
    <li><span class="badge">Payments</span> <strong>Stripe</strong> - Secure processing of monthly subscriptions.</li>
  </ul>

  <h2>3. Core System Features</h2>

  <h3>3.1 Authentication & User Management</h3>
  <ul>
    <li><strong>Secure Onboarding:</strong> Full signup, login, and logout flow using encrypted password handling.</li>
    <li><strong>User Profiles:</strong> Personalized dashboards where users can view their subscription status and manage saved data.</li>
    <li><strong>UI Preferences:</strong> Persistent Dark/Light mode toggling to match user system preferences.</li>
  </ul>

  <h3>3.2 Automated Data Pipelines (Cron Jobs)</h3>
  <p>The platform relies heavily on 100% accurate, automated data. The backend will routinely fetch, sanitize, and insert data from external sources.</p>
  <ul>
    <li><strong>Sources:</strong> <code>roster.watch</code>, <code>Tapology</code>, <code>ESPN</code>, <code>UFC</code>, and <code>FanDuel</code>.</li>
    <li><strong>Live Odds Sync:</strong> Automatically draw live fight odds from FanDuel, factoring into the prediction engine to find and highlight betting edges.</li>
    <li><strong>Roster Sync:</strong> Auto-import the full active roster, continuously cross-referencing to add new signings and remove duplicates.</li>
    <li><strong>Event Sync:</strong> Automatically pull fight cards, bout orders, and scheduled dates.</li>
    <li><strong>Post-Event Trigger:</strong> Following an event, the system will auto-archive the event, update fight results, recalculate Elo rankings, and update finish stats.</li>
  </ul>

  <h3>3.3 Comprehensive Fighter Database</h3>
  <p>Each fighter entity will house deep statistical data, updated automatically:</p>
  <ul>
    <li><strong>Biometrics:</strong> Age, Weight Class, Division, Height, and Reach.</li>
    <li><strong>Record Details:</strong> Wins, Losses, Draws, and detailed finish statistics (KO/TKO, Sub).</li>
    <li><strong>Advanced Analytics:</strong> Performance metrics (SLpM, striking accuracy, takedown defense) and proprietary Elo Ratings.</li>
    <li><strong>AI Predictions:</strong> Model-driven statistics for upcoming matchups.</li>
  </ul>

  <h2>4. Paywall & Subscription Tiers</h2>

  <div class="feature-box">
    <h4 style="margin-top:0; color:var(--dark);">Free Tier (Unregistered / Non-paying Users)</h4>
    <ul>
      <li>Homepage: Only the <strong>most upcoming UFC event</strong> is fully viewable.</li>
      <li><strong>Events Tab:</strong> Viewable (Prediction picks remain locked).</li>
      <li><strong>Elo Rankings & Fighters Tabs:</strong> Fully accessible.</li>
      <li><strong>Model & Performance Tabs:</strong> Fully accessible.</li>
    </ul>
  </div>

  <div class="premium-box">
    <h4>Premium Tier (Monthly Paid Subscribers)</h4>
    <ul>
      <li><strong>Homepage Unlocked:</strong> Full access to all homepage content and historical event data.</li>
      <li><strong>Betting Tab:</strong> Unlocked access to premium betting insights and odds.</li>
      <li><strong>Matchup Lab:</strong> Unlocked access to the interactive comparison tool.</li>
      <li><strong>Prediction Picks:</strong> Full visibility of AI-driven prediction picks across all upcoming fights.</li>
    </ul>
  </div>

  <div class="warning-box">
    <h4>Client Approval & Scope Freeze</h4>
    <p>This document details the complete functional scope of the Octagon AI platform. <strong>Please review carefully.</strong> Any new features, logic changes, or additional data sources requested after development begins will be considered a scope change, which may require budget adjustments and timeline extensions. If everything looks correct, your approval will initiate the coding phase.</p>
  </div>

</div>
