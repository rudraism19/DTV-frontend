const userModel = require('../models/userModel');

function escapeHtml(unsafe) {
  return (unsafe || '').toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderUsersTable(users) {
  const rows = users.map(u => `
    <tr>
      <td>${escapeHtml(u.id)}</td>
      <td>${escapeHtml(u.email)}</td>
      <td>${escapeHtml(u.name)}</td>
      <td>${escapeHtml(u.role)}</td>
      <td>${u.emailVerified ? 'yes' : 'no'}</td>
      <td id="status-${escapeHtml(u.id)}">${u.isActive ? 'Active' : 'Blocked'}</td>
      <td>${escapeHtml(u.createdAt)}</td>
      <td>${escapeHtml(u.lastLoginAt)}</td>
      <td>
        <button id="btn-${escapeHtml(u.id)}" onclick="toggleStatus('${escapeHtml(u.id)}', ${!u.isActive})" style="background:${u.isActive ? '#e74c3c' : '#2ecc71'};color:white;border:none;padding:5px 10px;cursor:pointer;border-radius:3px;">
          ${u.isActive ? 'Block' : 'Unblock'}
        </button>
      </td>
    </tr>`).join('\n');

  return `
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>DB Dashboard - Users</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;padding:24px;background:#07111e;color:#e8f0f8}
      table{width:100%;border-collapse:collapse;background:rgba(255,255,255,0.03)}
      th,td{padding:8px 10px;border:1px solid rgba(255,255,255,0.06);font-size:13px;color:#e8f0f8}
      th{background:rgba(255,255,255,0.04);text-align:left}
      pre{white-space:pre-wrap}
    </style>
  </head>
  <body>
    <h1>Users</h1>
    <p>Total: ${users.length}</p>
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>email</th>
          <th>name</th>
          <th>role</th>
          <th>emailVerified</th>
          <th>Status</th>
          <th>createdAt</th>
          <th>lastLoginAt</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
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
            // Dynamically update DOM instead of reloading window
            const statusTd = document.getElementById('status-' + userId);
            statusTd.innerText = makeActive ? 'Active' : 'Blocked';
            
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
    // fetch up to 1000 users
    const result = await userModel.listUsers({ limit: 1000, offset: 0 });
    const users = result.users || [];
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(renderUsersTable(users));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index
};
