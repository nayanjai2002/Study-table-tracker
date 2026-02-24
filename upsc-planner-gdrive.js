/* ══════════════════════════════════════════
   GOOGLE DRIVE SYNC
   ════════════════════════════════════════════
   Client ID loaded from:
   1. Vercel: /api/config endpoint (automatic from env vars)
   2. Local: config.js file
   3. Browser: localStorage (manual entry)
*/

const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let gdriveUser = null;
let gdriveToken = null;
let gdriveClientId = null;

// Fetch config from Vercel serverless function or use local config
async function loadConfig() {
  // Try Vercel API first
  try {
    console.log('📡 Fetching config from /api/config...');
    const response = await fetch('/api/config');
    if (response.ok) {
      const data = await response.json();
      console.log('📦 API Response:', data);
      if (data.GOOGLE_CLIENT_ID && data.GOOGLE_CLIENT_ID !== 'NOT_SET') {
        gdriveClientId = data.GOOGLE_CLIENT_ID;
        console.log('✓ Config loaded from Vercel API');
        return true;
      } else {
        console.warn('⚠️ API returned NOT_SET - env var not configured on Vercel');
      }
    } else {
      console.warn('⚠️ API returned status:', response.status);
    }
  } catch (err) {
    // API not available (local development) - fall back to config.js
    console.log('ℹ Vercel API not available (expected in local dev):', err.message);
  }

  // Try loading from public/config.json (manual upload to Vercel public folder)
  try {
    console.log('📡 Fetching config from /config.json...');
    const response = await fetch('/config.json');
    if (response.ok) {
      const data = await response.json();
      console.log('📦 JSON Response:', data);
      if (data.GOOGLE_CLIENT_ID && data.GOOGLE_CLIENT_ID !== 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com') {
        gdriveClientId = data.GOOGLE_CLIENT_ID;
        console.log('✓ Config loaded from /config.json');
        return true;
      }
    }
  } catch (err) {
    console.log('ℹ config.json not found (expected if using env var)');
  }

  // Fall back to config.js (local development)
  if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.GOOGLE_CLIENT_ID) {
    if (APP_CONFIG.GOOGLE_CLIENT_ID !== 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com') {
      gdriveClientId = APP_CONFIG.GOOGLE_CLIENT_ID;
      console.log('✓ Config loaded from config.js');
      return true;
    }
  }

  // Fall back to localStorage (manual entry on Vercel)
  const stored = localStorage.getItem('google_client_id');
  if (stored && stored.includes('apps.googleusercontent.com')) {
    gdriveClientId = stored;
    console.log('✓ Config loaded from localStorage');
    return true;
  }

  console.warn('✗ No Client ID found in any source');
  return false;
}

// Load Google API library
function loadGoogleAPI() {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  
  script.onload = () => {
    if (window.google && window.google.accounts) {
      initGoogleAuth();
    }
  };
}

function initGoogleAuth() {
  // Load config first (Vercel API → config.js → localStorage)
  loadConfig().then(success => {
    if (!success) {
      setupClientIdPrompt();
      return;
    }

    const storedToken = localStorage.getItem('gdrive_token');
    if (storedToken) {
      gdriveToken = storedToken;
      gdriveUser = localStorage.getItem('gdrive_user');
      updateGDriveUI();
    }

    const btn = document.getElementById('gdriveBtn');
    if (btn && !gdriveUser && window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: gdriveClientId,
        callback: handleGoogleLogin,
        auto_select: false,
      });
    }
  });
}

function setupClientIdPrompt() {
  const btn = document.getElementById('gdriveBtn');
  if (!btn) return;
  
  btn.addEventListener('click', () => {
    const clientId = prompt('📋 Google OAuth Client ID:\n\n(Get from: https://console.cloud.google.com/)\n\nPaste your Client ID:');
    if (clientId && clientId.includes('apps.googleusercontent.com')) {
      localStorage.setItem('google_client_id', clientId);
      showNotif('✓ Client ID saved! Reload page to enable cloud sync.');
      setTimeout(() => location.reload(), 1500);
    } else if (clientId) {
      showNotif('✗ Invalid Client ID format');
    }
  });
  
  btn.title = 'Click to setup Google Drive sync';
}

function handleGoogleLogin(response) {
  if (response.credential) {
    const token = response.credential;
    gdriveToken = token;
    
    // Decode JWT to get user info
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const decoded = JSON.parse(jsonPayload);
    gdriveUser = decoded.email;
    
    localStorage.setItem('gdrive_token', token);
    localStorage.setItem('gdrive_user', gdriveUser);
    
    updateGDriveUI();
    showNotif('✓ Connected to Google Drive as ' + gdriveUser);
  }
}

function updateGDriveUI() {
  const btn = document.getElementById('gdriveBtn');
  if (!btn) return;
  
  if (gdriveUser) {
    btn.innerHTML = `☁️ ${gdriveUser.split('@')[0]}`;
    btn.onclick = showGDriveMenu;
    btn.style.background = 'var(--green)';
    btn.style.color = '#fff';
    btn.style.borderColor = 'var(--green)';
  }
}

async function backupToGDrive() {
  if (!gdriveToken) {
    alert('Please connect to Google Drive first');
    return;
  }
  
  showNotif('⏳ Backing up to Google Drive...');
  
  try {
    const data = {
      timestamp: new Date().toISOString(),
      subjects: JSON.parse(localStorage.getItem(SK) || '{}'),
      progress: JSON.parse(localStorage.getItem(SP) || '{}'),
      config: JSON.parse(localStorage.getItem(SC) || '{}'),
    };
    
    // Check if backup file exists
    const fileList = await searchDriveFile('upsc-planner-backup.json');
    const fileId = fileList.length > 0 ? fileList[0].id : null;
    
    const metadata = {
      name: 'upsc-planner-backup.json',
      mimeType: 'application/json',
    };
    
    const content = JSON.stringify(data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);
    
    const url = fileId 
      ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    
    const method = fileId ? 'PATCH' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${gdriveToken}`,
      },
      body: form,
    });
    
    if (response.ok) {
      showNotif('✓ Backup saved to Google Drive');
    } else {
      showNotif('✗ Backup failed: ' + response.statusText);
    }
  } catch (err) {
    console.error('Backup error:', err);
    showNotif('✗ Backup error: ' + err.message);
  }
}

async function restoreFromGDrive() {
  if (!gdriveToken) {
    alert('Please connect to Google Drive first');
    return;
  }
  
  if (!confirm('Restore will overwrite your current data. Continue?')) return;
  
  showNotif('⏳ Restoring from Google Drive...');
  
  try {
    const fileList = await searchDriveFile('upsc-planner-backup.json');
    if (fileList.length === 0) {
      showNotif('✗ No backup found in Google Drive');
      return;
    }
    
    const fileId = fileList[0].id;
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        Authorization: `Bearer ${gdriveToken}`,
      },
    });
    
    if (!response.ok) {
      showNotif('✗ Failed to download backup');
      return;
    }
    
    const data = await response.json();
    
    localStorage.setItem(SK, JSON.stringify(data.subjects));
    localStorage.setItem(SP, JSON.stringify(data.progress));
    localStorage.setItem(SC, JSON.stringify(data.config));
    
    showNotif('✓ Restored from Google Drive');
    setTimeout(() => location.reload(), 1000);
  } catch (err) {
    console.error('Restore error:', err);
    showNotif('✗ Restore error: ' + err.message);
  }
}

async function searchDriveFile(name) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${name}' and trashed=false&spaces=drive&fields=files(id,modifiedTime)&pageSize=10`,
      {
        headers: {
          Authorization: `Bearer ${gdriveToken}`,
        },
      }
    );
    
    if (response.ok) {
      const result = await response.json();
      return result.files || [];
    }
    return [];
  } catch (err) {
    console.error('Search error:', err);
    return [];
  }
}

function showGDriveMenu() {
  const menu = document.createElement('div');
  menu.style.cssText = `
    position: fixed;
    top: 60px;
    right: 20px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    min-width: 200px;
  `;
  
  menu.innerHTML = `
    <div style="padding: 8px;">
      <div style="font-size: 11px; color: var(--ink3); padding: 6px; text-transform: uppercase; font-weight: 700;">Google Drive</div>
      <button onclick="backupToGDrive()" style="width: 100%; padding: 8px; margin: 4px 0; background: var(--green); color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
        💾 Backup Now
      </button>
      <button onclick="restoreFromGDrive()" style="width: 100%; padding: 8px; margin: 4px 0; background: var(--blue); color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
        📥 Restore
      </button>
      <button onclick="logoutGDrive()" style="width: 100%; padding: 8px; margin: 4px 0; background: var(--ink3); color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
        ⤴️ Logout
      </button>
    </div>
  `;
  
  document.body.appendChild(menu);
  setTimeout(() => menu.remove(), 5000);
}

function logoutGDrive() {
  localStorage.removeItem('gdrive_token');
  localStorage.removeItem('gdrive_user');
  gdriveToken = null;
  gdriveUser = null;
  location.reload();
}

function showNotif(msg) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: var(--bg2);
    color: var(--ink);
    padding: 12px 16px;
    border-radius: 6px;
    border: 1px solid var(--border);
    font-size: 13px;
    z-index: 10001;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  notif.textContent = msg;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// Load Google API on page start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadGoogleAPI);
} else {
  loadGoogleAPI();
}
