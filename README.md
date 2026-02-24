# UPSC Study Planner

A comprehensive study planning tool for UPSC aspirants with progress tracking, time management, and cloud backup.

## Features
- 📅 Daily planning with progress tracking
- 📚 Syllabus view with topic organization
- ⚙️ Customizable subjects, topics, and study blocks
- ⏱️ Built-in timer for tracking study hours
- 🌙 Dark/Light mode support
- ☁️ Google Drive backup & sync
- 📱 Works offline with localStorage

## Quick Start

### Local Development
```bash
# Clone the repo
git clone https://github.com/nayanjai2002/Study-table-tracker.git
cd "Study table tracker"

# Start Python server (Windows)
python -m http.server 8000

# Or Node (if you have live-server)
npx live-server

# Open browser
http://localhost:8000
```

### Google Drive Setup (Optional)
1. Copy `config.example.js` → `config.js`
2. Add your Google OAuth Client ID to `config.js`
3. Cloud backup button (☁️) will appear in header

### Deploy to Vercel
```bash
git push
# Vercel auto-deploys on push
```

## File Structure
```
├── upsc-planner-final.html      # Main app (Daily + Syllabus tabs)
├── upsc-planner-manage.html     # Manage/Customize page
├── upsc-planner-script.js       # Core logic
├── upsc-planner-styles.css      # Styling
├── upsc-planner-gdrive.js       # Google Drive integration
├── config.example.js            # Config template
├── config.js                    # Local config (not committed)
├── vercel.json                  # Vercel deployment config
└── README.md                    # This file
```

## Data Storage
- **localStorage**: All data stored locally in browser
- **Google Drive**: Optional cloud backup (requires setup)
- Data syncs across tabs automatically

## Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with ES6 support

## License
MIT

## Support
For issues or feature requests, open an issue on GitHub.
