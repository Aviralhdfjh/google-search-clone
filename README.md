# Google Evo Search Clone

A modern, feature-rich Google search interface clone built with HTML, CSS, and JavaScript.

## 🚀 Features

- **Authentic Google Design** - Pixel-perfect recreation of Google's interface
- **Smart Autocomplete** - Intelligent search suggestions with API integration
- **Voice Search** - Real voice input using Web Speech API
- **Image Search** - File upload capability for reverse image search
- **Enhanced UI/UX** - Larger, more accessible components
- **API Integration** - Wikipedia, weather data, and extensible API system
- **Responsive Design** - Works perfectly on all devices
- **Dark Mode Support** - Automatic dark mode detection
- **Performance Optimized** - Debounced search, caching, and loading states

## 🎯 Live Demo

[View Live Demo](https://googleevo-clone.netlify.app/) ✨ **LIVE NOW!**

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript** - ES6+ with class-based architecture
- **Font Awesome** - Icons and UI elements
- **Google Fonts** - Product Sans typography
- **APIs** - Wikipedia, JSONPlaceholder, and extensible API system

## � Quick Deployment

### Deploy to Netlify:
1. Fork this repository
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git" → GitHub → Select this repo
4. Deploy! Your site will be live in 1-2 minutes

### Local Development:
1. Clone the repository:
```bash
git clone https://github.com/Aviralhdfjh/google-search-clone.git
cd google-search-clone
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

## 🔧 API Configuration (Optional)

The application works fully without API keys but can be enhanced:

### Add API Keys in `script.js`:
```javascript
this.apiConfig = {
    googleSearchApi: {
        key: 'YOUR_GOOGLE_API_KEY',
        cx: 'YOUR_SEARCH_ENGINE_ID',
    },
    weatherApi: {
        key: 'YOUR_WEATHER_API_KEY',
    }
};
```

### Available APIs:
- **Google Custom Search API** - For real search results
- **OpenWeatherMap API** - For live weather data
- **Wikipedia API** - Already working (no key needed)
- **JSONPlaceholder API** - Already working (no key needed)

## ✨ Key Features

### Search Functionality
- Real-time autocomplete suggestions
- Voice search with Web Speech API
- Image search file upload
- Smart suggestion caching
- Wikipedia integration for quick facts

### UI/UX Enhancements
- Google-authentic design and colors
- Enhanced navigation bar (60px height)
- Larger search box (56px height, 650px max width)
- Touch-friendly mobile interface
- Smooth animations and transitions

### Performance
- Debounced search input (150ms delay)
- Intelligent suggestion ranking
- API response caching
- Optimized loading states
- Graceful error handling

## 📱 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ⚠️ Voice search requires Chrome/Edge

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google for design inspiration
- Font Awesome for icons
- Wikipedia API for educational content
- Web Speech API for voice functionality

---

**Note**: This is an educational project and not affiliated with Google Inc.
