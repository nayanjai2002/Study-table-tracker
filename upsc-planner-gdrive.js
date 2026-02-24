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

// Simplified: Load from localStorage or show setup
async function loadConfig() {
  // Check localStorage first (already set on this device)
  const stored = localStorage.getItem('google_client_id');
  if (stored && stored.includes('apps.googleusercontent.com')) {
    gdriveClientId = stored;
    console.log('✓ Config loaded from localStorage');
    return true;
  }

  // Check config.js (local development)
  if (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.GOOGLE_CLIENT_ID) {
    if (APP_CONFIG.GOOGLE_CLIENT_ID !== 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com') {
      gdriveClientId = APP_CONFIG.GOOGLE_CLIENT_ID;
      console.log('✓ Config loaded from config.js');
      localStorage.setItem('google_client_id', gdriveClientId);
      return true;
    }
  }

  console.log('ℹ No Client ID found - setup required');
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
  // Load config first (localStorage → config.js)
  loadConfig().then(success => {
    if (!success) {
      // No config found - show setup on button click
      setupClientIdPrompt();
      const btn = document.getElementById('gdriveBtn');
      if (btn) btn.textContent = '⚙️ Setup Cloud';
      return;
    }

    // Config loaded - init Google OAuth
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
  
  btn.onclick = (e) => {
    e.stopPropagation();
    showSetupModal();
  };
  
  btn.title = 'Click to setup Google Drive sync (one-time)';
  btn.style.background = 'var(--ink3)';
}

function showSetupModal() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
  `;
  
  overlay.innerHTML = `
    <div style="background: var(--bg); padding: 24px; border-radius: 8px; max-width: 500px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); border: 1px solid var(--border);">
      <h3 style="margin: 0 0 12px 0; color: var(--ink);">☁️ Setup Google Drive Sync</h3>
      <p style="color: var(--ink3); font-size: 13px; line-height: 1.6; margin: 0 0 16px 0;">
        To enable cloud backup, paste your Google OAuth Client ID below.<br><br>
        <strong>Get it from:</strong> <code style="background: var(--bg2); padding: 2px 6px; border-radius: 3px; font-size: 12px;">https://console.cloud.google.com/</code>
      </p>
      
      <input 
        id="clientIdInput" 
        type="text" 
        placeholder="Paste your Client ID here..."
        style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 4px; background: var(--bg2); color: var(--ink); box-sizing: border-box; font-size: 13px; margin-bottom: 16px;"
      >
      
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button onclick="this.closest('div').parentElement.parentElement.remove()" style="padding: 8px 16px; background: var(--ink3); color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
          Cancel
        </button>
        <button onclick="saveClientIdSetup()" style="padding: 8px 16px; background: var(--green); color: #fff; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
          Save & Enable
        </button>
      </div>
      
      <div style="font-size: 11px; color: var(--ink3); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border);">
        💡 This device only. You'll need to paste it again on other devices.
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  document.getElementById('clientIdInput').focus();
  document.getElementById('clientIdInput').onkeydown = (e) => {
    if (e.key === 'Enter') saveClientIdSetup();
  };
}

function saveClientIdSetup() {
  const input = document.getElementById('clientIdInput');
  const clientId = input?.value?.trim();
  
  if (!clientId) {
    alert('Please paste your Client ID');
    return;
  }
  
  if (!clientId.includes('apps.googleusercontent.com')) {
    alert('Invalid Client ID format. Should contain "apps.googleusercontent.com"');
    input.focus();
    return;
  }
  
  // Save to localStorage
  localStorage.setItem('google_client_id', clientId);
  gdriveClientId = clientId;
  
  // Close modal
  document.body.querySelector('[style*="fixed"][style*="z-index: 10001"]')?.remove();
  
  // Reinit Google Auth
  showNotif('✓ Client ID saved! Initializing...');
  setTimeout(() => {
    initGoogleAuth();
  }, 500);
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
