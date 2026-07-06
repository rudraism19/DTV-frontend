const userModel = require('../models/userModel');
const db = require('../db');

function escapeHtml(unsafe) {
  return (unsafe || '').toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderDashboard(users, orders) {
  let totalRevenue = 0;
  let activePremium = 0;
  
  users.forEach(u => {
    if (u.subscriptionExpiresAt && new Date(u.subscriptionExpiresAt) > new Date()) {
      activePremium++;
    }
  });

  orders.forEach(o => {
    if (o.status === 'paid') {
      totalRevenue += Number(o.amount || 0) / 100; // Assuming amount in paise/cents
    }
  });

  const userRows = users.map(u => {
    const isPrem = u.subscriptionExpiresAt && new Date(u.subscriptionExpiresAt) > new Date();
    const isTrial = !isPrem && u.trialExpiresAt && new Date(u.trialExpiresAt) > new Date();
    let badge = '<span style="color:#e74c3c;font-weight:bold;">Free / Locked</span>';
    if (isPrem) badge = '<span style="color:#2ecc71;font-weight:bold;">Premium VIP</span>';
    else if (isTrial) badge = '<span style="color:#f39c12;font-weight:bold;">5-Day Trial</span>';

    return `
    <tr>
      <td>${escapeHtml(u.id)}</td>
      <td><strong>${escapeHtml(u.email)}</strong></td>
      <td>${escapeHtml(u.name || 'Student')}</td>
      <td>${escapeHtml(u.role)}</td>
      <td>${badge}</td>
      <td id="status-${escapeHtml(u.id)}"><span style="padding:3px 8px;border-radius:12px;background:${u.isActive ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)'};color:${u.isActive ? '#2ecc71' : '#e74c3c'};">${u.isActive ? 'Active' : 'Blocked'}</span></td>
      <td>${escapeHtml(u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '')}</td>
      <td>
        <button id="btn-${escapeHtml(u.id)}" onclick="toggleStatus('${escapeHtml(u.id)}', ${!u.isActive})" style="background:${u.isActive ? '#e74c3c' : '#2ecc71'};color:white;border:none;padding:6px 12px;cursor:pointer;border-radius:6px;font-weight:bold;">
          ${u.isActive ? 'Block' : 'Unblock'}
        </button>
      </td>
    </tr>`;
  }).join('\n');

  const orderRows = orders.map(o => `
    <tr>
      <td>${escapeHtml(o.id)}</td>
      <td>${escapeHtml(o.user_id)}</td>
      <td><strong>₹${Number(o.amount || 0) / 100}</strong></td>
      <td><span style="padding:3px 8px;border-radius:12px;background:${o.status === 'paid' ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)'};color:${o.status === 'paid' ? '#2ecc71' : '#e74c3c'};">${escapeHtml(o.status)}</span></td>
      <td>${escapeHtml(o.plan_duration)}</td>
      <td>${escapeHtml(o.razorpay_order_id)}</td>
      <td>${escapeHtml(o.created_at ? new Date(o.created_at).toLocaleString() : '')}</td>
    </tr>`).join('\n');

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-G79C8YZYXF"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-G79C8YZYXF');
    </script>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Digital Twin Verse — Admin Analytics Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 32px; background: #0b1322; color: #e8f0f8; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 32px; }
      .header h1 { margin: 0; font-size: 32px; background: linear-gradient(135deg, #ffd700, #ffb900); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      .header p { margin: 5px 0 0 0; color: #a78bfa; font-size: 15px; font-weight: 600; }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 40px; }
      .stat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); padding: 24px; border-radius: 16px; backdrop-filter: blur(12px); box-shadow: 0 4px 24px rgba(0,0,0,0.2); }
      .stat-card h3 { margin: 0 0 8px 0; font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
      .stat-card .value { font-size: 32px; font-weight: 800; color: #ffffff; }
      .stat-card .value.highlight { color: #ffd700; }
      .stat-card .value.green { color: #2ecc71; }
      .section-title { font-size: 22px; font-weight: 700; margin: 32px 0 16px 0; color: #ffffff; display: flex; align-items: center; gap: 10px; }
      .table-container { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.2); }
      table { width: 100%; border-collapse: collapse; text-align: left; }
      th, td { padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 14px; }
      th { background: rgba(255,255,255,0.04); font-weight: 600; color: #94a3b8; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
      tr:last-child td { border-bottom: none; }
      tr:hover { background: rgba(255,255,255,0.02); }
    </style>
  </head>
  <body>
    <div class="header">
      <div>
        <h1>Digital Twin Verse</h1>
        <p>Developer & Admin Analytics Dashboard</p>
      </div>
      <div>
        <span style="background: #a78bfa; color: #000; font-weight: bold; padding: 6px 14px; border-radius: 20px; font-size: 13px;">Live Admin Engine</span>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Revenue (Razorpay)</h3>
        <div class="value highlight">₹${totalRevenue}</div>
      </div>
      <div class="stat-card">
        <h3>Active Premium VIP</h3>
        <div class="value green">${activePremium}</div>
      </div>
      <div class="stat-card">
        <h3>Total Registered Students</h3>
        <div class="value">${users.length}</div>
      </div>
      <div class="stat-card">
        <h3>Recent Orders</h3>
        <div class="value">${orders.length}</div>
      </div>
    </div>

    <div class="section-title">👥 Registered Users & Subscriptions</div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Tier / Tier Status</th>
            <th>Account State</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${userRows}
        </tbody>
      </table>
    </div>

    <div class="section-title">💳 Recent Payment Orders</div>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Plan</th>
            <th>Razorpay Order ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${orderRows || '<tr><td colspan="7" style="text-align:center;color:#64748b;">No recent payment orders found</td></tr>'}
        </tbody>
      </table>
    </div>

    <script>
      async function toggleStatus(userId, makeActive) {
        if(!confirm(makeActive ? 'Unblock this user?' : 'Block this user?')) return;
        
        const btn = document.getElementById('btn-' + userId);
        const originalText = btn.innerText;
        btn.innerText = 'Wait...';
        btn.disabled = true;

        const token = window.opener && window.opener.APP_DATA ? window.opener.APP_DATA.userData.token : null;
        if (!token) {
          alert("Auth token not found. Please reload from the main app.");
          btn.innerText = originalText;
          btn.disabled = false;
          return;
        }

        try {
          const res = await fetch('/api/v1/users/' + userId + '/status', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ isActive: makeActive })
          });
          
          if(res.ok) {
            const statusTd = document.getElementById('status-' + userId);
            statusTd.innerHTML = '<span style="padding:3px 8px;border-radius:12px;background:' + (makeActive ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)') + ';color:' + (makeActive ? '#2ecc71' : '#e74c3c') + ';">' + (makeActive ? 'Active' : 'Blocked') + '</span>';
            
            btn.innerText = makeActive ? 'Block' : 'Unblock';
            btn.style.background = makeActive ? '#e74c3c' : '#2ecc71';
            btn.setAttribute('onclick', "toggleStatus('" + userId + "', " + !makeActive + ")");
            btn.disabled = false;
          } else {
            const data = await res.json();
            alert('Error: ' + (data.error || data.message || 'Failed'));
            btn.innerText = originalText;
            btn.disabled = false;
          }
        } catch(e) {
          alert('Network Error');
          btn.innerText = originalText;
          btn.disabled = false;
        }
      }
    </script>
  </body>
  </html>`;
}

const index = async function(req, res, next) {
  try {
    const [result, orderRes] = await Promise.all([
      userModel.listUsers({ limit: 1000, offset: 0 }),
      db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100').catch(() => ({ rows: [] }))
    ]);
    const users = result.users || [];
    const orders = orderRes.rows || [];
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(renderDashboard(users, orders));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index
};
