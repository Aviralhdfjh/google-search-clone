// Enhanced Google Search - Advanced Features & Optimized Search with API Integration
class GoogleSearchClone {
    constructor() {
        // API Configuration
        this.apiConfig = {
            // Google Custom Search API (you'll need to get your own API key)
            googleSearchApi: {
                key: 'YOUR_GOOGLE_API_KEY', // Replace with your API key
                cx: 'YOUR_SEARCH_ENGINE_ID', // Replace with your search engine ID
                baseUrl: 'https://www.googleapis.com/customsearch/v1'
            },
            // Wikipedia API for quick facts
            wikipediaApi: {
                baseUrl: 'https://en.wikipedia.org/api/rest_v1/page/summary/'
            },
            // JSONPlaceholder for demo suggestions
            jsonPlaceholder: {
                baseUrl: 'https://jsonplaceholder.typicode.com'
            },
            // OpenWeatherMap API (optional)
            weatherApi: {
                key: 'YOUR_WEATHER_API_KEY', // Replace with your API key
                baseUrl: 'https://api.openweathermap.org/data/2.5'
            }
        };

        this.sampleSuggestions = [
            // Technology & Programming
            'javascript tutorial', 'javascript array methods', 'javascript promises', 'javascript async await',
            'javascript fetch api', 'javascript dom manipulation', 'javascript es6 features',
            'react js tutorial', 'react hooks', 'react router', 'react redux',
            'vue js tutorial', 'vue components', 'vue router',
            'angular tutorial', 'angular components', 'angular services',
            'nodejs tutorial', 'nodejs express', 'nodejs mongodb',
            'python programming', 'python django', 'python flask', 'python pandas',
            'typescript tutorial', 'typescript interfaces', 'typescript generics',
            
            // Web Development
            'html css javascript', 'web development', 'frontend development', 'backend development',
            'full stack development', 'responsive web design', 'css grid', 'css flexbox',
            'css animations', 'bootstrap tutorial', 'tailwind css',
            
            // Tools & Technologies
            'git tutorial', 'github pages', 'visual studio code', 'chrome developer tools',
            'webpack tutorial', 'vite tutorial', 'npm commands', 'yarn vs npm',
            
            // Data & APIs
            'api development', 'rest api', 'graphql', 'json tutorial',
            'database design', 'sql tutorial', 'mongodb tutorial', 'firebase tutorial',
            
            // General Searches
            'weather today', 'news headlines', 'translate english to spanish',
            'calculator online', 'time zones', 'currency converter',
            'stock market', 'cryptocurrency prices', 'sports scores',
            
            // Entertainment
            'movies 2024', 'netflix shows', 'youtube tutorials', 'music streaming',
            'game reviews', 'book recommendations'
        ];

        this.currentSuggestions = [];
        this.selectedSuggestionIndex = -1;
        this.isLoading = false;
        this.searchHistory = [];
        this.apiSuggestions = [];
        this.suggestionCache = new Map();
        
        this.initializeElements();
        this.bindEvents();
        this.loadSearchHistory();
        this.initializeQuickAccess();
        this.preloadPopularSuggestions();
    }

    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBox = document.getElementById('searchBox');
        this.suggestionsContainer = document.getElementById('suggestionsContainer');
        this.suggestionsContent = document.getElementById('suggestionsContent');
        this.recentSearches = document.getElementById('recentSearches');
        this.recentList = document.getElementById('recentList');
        this.quickAccess = document.getElementById('quickAccess');
        this.clearBtn = document.getElementById('clearBtn');
        this.micBtn = document.getElementById('micBtn');
        this.cameraBtn = document.getElementById('cameraBtn');
        this.voiceModal = document.getElementById('voiceModal');
        this.voiceCancel = document.getElementById('voiceCancel');
        this.appsMenu = document.getElementById('appsMenu');
        this.appsDropdown = document.getElementById('appsDropdown');
    }

    bindEvents() {
        // Search input events
        this.searchInput.addEventListener('input', this.handleInput.bind(this));
        this.searchInput.addEventListener('focus', this.handleFocus.bind(this));
        this.searchInput.addEventListener('blur', this.handleBlur.bind(this));
        this.searchInput.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Clear button
        this.clearBtn.addEventListener('click', this.clearSearch.bind(this));

        // Voice search
        this.micBtn.addEventListener('click', this.startVoiceSearch.bind(this));
        this.voiceCancel.addEventListener('click', this.stopVoiceSearch.bind(this));

        // Image search
        this.cameraBtn.addEventListener('click', this.startImageSearch.bind(this));

        // Apps menu
        this.appsMenu.addEventListener('click', this.toggleAppsMenu.bind(this));

        // Global click handler
        document.addEventListener('click', this.handleGlobalClick.bind(this));

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleGlobalKeyDown.bind(this));
    }

    handleInput(e) {
        const query = e.target.value;
        this.updateClearButton(query);
        this.debouncedSearch(query);
    }

    handleFocus() {
        this.searchBox.classList.add('focused');
        const query = this.searchInput.value;
        if (query.trim()) {
            this.showSuggestions(query);
        } else {
            this.showQuickAccess();
        }
    }

    handleBlur() {
        setTimeout(() => {
            this.searchBox.classList.remove('focused');
            this.hideSuggestions();
        }, 150);
    }

    handleKeyDown(e) {
        if (!this.suggestionsContainer.classList.contains('show')) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.navigateSuggestions(1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.navigateSuggestions(-1);
                break;
            case 'Enter':
                e.preventDefault();
                this.selectSuggestion();
                break;
            case 'Escape':
                this.hideSuggestions();
                this.searchInput.blur();
                break;
        }
    }

    handleGlobalClick(e) {
        if (!e.target.closest('.search-container') && !e.target.closest('.apps-menu')) {
            this.hideSuggestions();
            this.hideAppsMenu();
        }
    }

    handleGlobalKeyDown(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.searchInput.focus();
        }
    }

    updateClearButton(query) {
        if (query.length > 0) {
            this.clearBtn.style.display = 'flex';
        } else {
            this.clearBtn.style.display = 'none';
        }
    }

    clearSearch() {
        this.searchInput.value = '';
        this.clearBtn.style.display = 'none';
        this.hideSuggestions();
        this.searchInput.focus();
    }

    // API Methods for Enhanced Search
    async preloadPopularSuggestions() {
        try {
            // Preload popular search suggestions from JSONPlaceholder (demo)
            const response = await fetch(`${this.apiConfig.jsonPlaceholder.baseUrl}/posts`);
            const posts = await response.json();
            
            // Extract keywords from post titles for additional suggestions
            const apiSuggestions = posts.slice(0, 20).map(post => 
                post.title.toLowerCase().replace(/[^\w\s]/gi, '').trim()
            );
            
            this.apiSuggestions = [...new Set(apiSuggestions)]; // Remove duplicates
            console.log('Preloaded API suggestions:', this.apiSuggestions.length);
        } catch (error) {
            console.warn('Could not preload API suggestions:', error);
        }
    }

    async fetchGoogleSuggestions(query) {
        // This would use Google's actual suggestion API if available
        // For demo purposes, we'll use a mock implementation
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockSuggestions = [
                    `${query} tutorial`,
                    `${query} examples`,
                    `${query} best practices`,
                    `${query} documentation`,
                    `${query} vs alternatives`
                ].filter(s => s !== `${query} `);
                
                resolve(mockSuggestions);
            }, 100);
        });
    }

    async fetchWikipediaSummary(query) {
        try {
            const encodedQuery = encodeURIComponent(query.replace(/\s+/g, '_'));
            const response = await fetch(`${this.apiConfig.wikipediaApi.baseUrl}${encodedQuery}`);
            
            if (response.ok) {
                const data = await response.json();
                return {
                    title: data.title,
                    extract: data.extract,
                    url: data.content_urls?.desktop?.page
                };
            }
        } catch (error) {
            console.warn('Wikipedia API error:', error);
        }
        return null;
    }

    async fetchRealTimeWeather(location = 'current') {
        // Mock weather data for demo
        return {
            location: 'Current Location',
            temperature: Math.floor(Math.random() * 30) + 10,
            condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 40) + 40,
            windSpeed: Math.floor(Math.random() * 20) + 5
        };
    }

    // Enhanced search with API integration
    async getSuggestions(query) {
        if (!query.trim()) return [];

        // Check cache first
        const cacheKey = query.toLowerCase();
        if (this.suggestionCache.has(cacheKey)) {
            return this.suggestionCache.get(cacheKey);
        }

        const lowerQuery = query.toLowerCase();
        const suggestions = [];
        const queryWords = lowerQuery.split(' ');

        // Local suggestions (existing logic)
        const localSuggestions = this.getLocalSuggestions(query);
        
        // Add API suggestions if available
        const apiSuggestions = this.apiSuggestions.filter(suggestion => 
            suggestion.includes(lowerQuery)
        ).slice(0, 3);

        // Combine suggestions
        const allSuggestions = [
            ...localSuggestions.slice(0, 5),
            ...apiSuggestions,
            ...localSuggestions.slice(5)
        ];

        // Remove duplicates and limit
        const uniqueSuggestions = [...new Set(allSuggestions)].slice(0, 8);

        // Try to fetch additional suggestions from API
        try {
            const googleSuggestions = await this.fetchGoogleSuggestions(query);
            const enhancedSuggestions = [
                ...uniqueSuggestions.slice(0, 6),
                ...googleSuggestions.slice(0, 2)
            ].slice(0, 8);

            // Cache the results
            this.suggestionCache.set(cacheKey, enhancedSuggestions);
            
            return enhancedSuggestions;
        } catch (error) {
            console.warn('API suggestion fetch failed:', error);
            return uniqueSuggestions;
        }
    }

    getLocalSuggestions(query) {
        const lowerQuery = query.toLowerCase();
        const suggestions = [];
        const queryWords = lowerQuery.split(' ');

        // Exact matches first
        const exactMatches = this.sampleSuggestions.filter(suggestion => 
            suggestion.toLowerCase().startsWith(lowerQuery)
        );

        // Partial matches
        const partialMatches = this.sampleSuggestions.filter(suggestion => {
            const lowerSuggestion = suggestion.toLowerCase();
            return !lowerSuggestion.startsWith(lowerQuery) && 
                   lowerSuggestion.includes(lowerQuery);
        });

        // Word-based matches
        const wordMatches = this.sampleSuggestions.filter(suggestion => {
            const lowerSuggestion = suggestion.toLowerCase();
            return !lowerSuggestion.includes(lowerQuery) &&
                   queryWords.some(word => lowerSuggestion.includes(word));
        });

        // Combine and deduplicate
        const allMatches = [...exactMatches, ...partialMatches, ...wordMatches];
        return [...new Set(allMatches)];
    }

    async showSuggestions(query) {
        // Show loading state
        this.showLoadingState();
        
        try {
            const suggestions = await this.getSuggestions(query);
            this.displaySuggestions(suggestions, query);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            this.hideSuggestions();
        }
    }

    showLoadingState() {
        this.suggestionsContent.innerHTML = `
            <div class="suggestion-item loading-state">
                <div class="loading"></div>
                <span>Loading suggestions...</span>
            </div>
        `;
        this.suggestionsContainer.classList.add('show');
    }

    displaySuggestions(suggestions, query = '') {
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.currentSuggestions = suggestions;
        this.selectedSuggestionIndex = -1;
        this.suggestionsContent.innerHTML = '';

        suggestions.forEach((suggestion, index) => {
            const suggestionElement = this.createSuggestionElement(suggestion, query, index);
            this.suggestionsContent.appendChild(suggestionElement);
        });

        this.suggestionsContainer.classList.add('show');
        this.hideQuickAccess();
    }

    createSuggestionElement(suggestion, query, index) {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.dataset.index = index;

        const icon = this.getSuggestionIcon(suggestion);
        const highlightedText = this.highlightMatch(suggestion, query);
        const type = this.getSuggestionType(suggestion);

        div.innerHTML = `
            <i class="${icon} suggestion-icon"></i>
            <span class="suggestion-text">${highlightedText}</span>
            <span class="suggestion-type">${type}</span>
        `;

        div.addEventListener('click', () => this.selectSuggestionByIndex(index));
        div.addEventListener('mouseenter', () => this.highlightSuggestion(index));

        return div;
    }

    getSuggestionIcon(suggestion) {
        const lowerSuggestion = suggestion.toLowerCase();
        
        if (lowerSuggestion.includes('weather')) return 'fas fa-cloud-sun';
        if (lowerSuggestion.includes('news')) return 'fas fa-newspaper';
        if (lowerSuggestion.includes('translate')) return 'fas fa-language';
        if (lowerSuggestion.includes('calculator')) return 'fas fa-calculator';
        if (lowerSuggestion.includes('time') || lowerSuggestion.includes('clock')) return 'fas fa-clock';
        if (lowerSuggestion.includes('currency')) return 'fas fa-dollar-sign';
        if (lowerSuggestion.includes('movie') || lowerSuggestion.includes('film')) return 'fas fa-film';
        if (lowerSuggestion.includes('music')) return 'fas fa-music';
        if (lowerSuggestion.includes('programming') || lowerSuggestion.includes('code')) return 'fas fa-code';
        if (lowerSuggestion.includes('tutorial')) return 'fas fa-graduation-cap';
        
        return 'fas fa-search';
    }

    getSuggestionType(suggestion) {
        const lowerSuggestion = suggestion.toLowerCase();
        
        if (lowerSuggestion.includes('tutorial')) return 'Tutorial';
        if (lowerSuggestion.includes('weather')) return 'Weather';
        if (lowerSuggestion.includes('news')) return 'News';
        if (lowerSuggestion.includes('translate')) return 'Translate';
        if (lowerSuggestion.includes('calculator')) return 'Calculator';
        if (lowerSuggestion.includes('programming') || lowerSuggestion.includes('javascript') || lowerSuggestion.includes('python')) return 'Programming';
        
        return '';
    }

    highlightMatch(text, query) {
        if (!query.trim()) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    navigateSuggestions(direction) {
        const maxIndex = this.currentSuggestions.length - 1;
        
        if (direction === 1) {
            this.selectedSuggestionIndex = Math.min(this.selectedSuggestionIndex + 1, maxIndex);
        } else {
            this.selectedSuggestionIndex = Math.max(this.selectedSuggestionIndex - 1, -1);
        }

        this.updateSuggestionHighlight();
    }

    updateSuggestionHighlight() {
        const suggestionElements = this.suggestionsContent.querySelectorAll('.suggestion-item');
        
        suggestionElements.forEach((el, index) => {
            el.classList.toggle('selected', index === this.selectedSuggestionIndex);
        });
    }

    highlightSuggestion(index) {
        this.selectedSuggestionIndex = index;
        this.updateSuggestionHighlight();
    }

    selectSuggestion() {
        if (this.selectedSuggestionIndex >= 0 && this.currentSuggestions[this.selectedSuggestionIndex]) {
            this.searchInput.value = this.currentSuggestions[this.selectedSuggestionIndex];
            this.performSearch();
        } else if (this.searchInput.value.trim()) {
            this.performSearch();
        }
    }

    selectSuggestionByIndex(index) {
        this.searchInput.value = this.currentSuggestions[index];
        this.performSearch();
    }

    hideSuggestions() {
        this.suggestionsContainer.classList.remove('show');
        this.selectedSuggestionIndex = -1;
        this.showQuickAccess();
    }

    // Voice Search
    startVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice search is not supported in your browser. Please try Chrome or Edge.');
            return;
        }

        this.voiceModal.classList.add('show');
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.searchInput.value = transcript;
            this.stopVoiceSearch();
            this.performSearch();
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopVoiceSearch();
        };

        this.recognition.onend = () => {
            this.stopVoiceSearch();
        };

        this.recognition.start();
    }

    stopVoiceSearch() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.voiceModal.classList.remove('show');
    }

    // Image Search
    startImageSearch() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // In a real implementation, this would upload the image to Google's servers
                alert(`Image search selected: ${file.name}\n\nIn a real implementation, this would perform a reverse image search.`);
            }
        };
        
        input.click();
    }

    // Apps Menu
    toggleAppsMenu() {
        this.appsDropdown.classList.toggle('show');
    }

    hideAppsMenu() {
        this.appsDropdown.classList.remove('show');
    }

    // Quick Access
    initializeQuickAccess() {
        const quickLinks = document.querySelectorAll('.quick-link');
        quickLinks.forEach(link => {
            link.addEventListener('click', () => {
                const searchTerm = link.dataset.search;
                this.searchInput.value = searchTerm;
                this.performSearch();
            });
        });
    }

    showQuickAccess() {
        if (!this.searchInput.value.trim()) {
            this.quickAccess.style.display = 'block';
        }
    }

    hideQuickAccess() {
        this.quickAccess.style.display = 'none';
    }

    // Search History Management
    loadSearchHistory() {
        this.searchHistory = JSON.parse(localStorage.getItem('googleSearchHistory')) || [];
        this.displaySearchHistory();
    }

    saveToSearchHistory(query) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        
        // Add to beginning
        this.searchHistory.unshift(query);
        
        // Keep only last 10 searches
        this.searchHistory = this.searchHistory.slice(0, 10);
        
        localStorage.setItem('googleSearchHistory', JSON.stringify(this.searchHistory));
        this.displaySearchHistory();
    }

    displaySearchHistory() {
        if (this.searchHistory.length === 0) {
            this.recentSearches.style.display = 'none';
            return;
        }

        this.recentSearches.style.display = 'block';
        this.recentList.innerHTML = '';

        this.searchHistory.forEach((search, index) => {
            const recentItem = document.createElement('div');
            recentItem.className = 'recent-item';
            recentItem.innerHTML = `
                <div class="recent-text">
                    <i class="fas fa-history recent-icon"></i>
                    <span>${search}</span>
                </div>
                <i class="fas fa-times remove-recent" data-index="${index}"></i>
            `;

            recentItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('remove-recent')) {
                    this.searchInput.value = search;
                    this.performSearch();
                }
            });

            const removeBtn = recentItem.querySelector('.remove-recent');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFromSearchHistory(index);
            });

            this.recentList.appendChild(recentItem);
        });
    }

    removeFromSearchHistory(index) {
        this.searchHistory.splice(index, 1);
        localStorage.setItem('googleSearchHistory', JSON.stringify(this.searchHistory));
        this.displaySearchHistory();
    }

    // Enhanced search with API integration and special results
    async handleSpecialSearches(query) {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('weather')) {
            await this.showEnhancedWeatherResult(query);
        } else if (lowerQuery.includes('calculator') || /^\d+[\+\-\*\/]\d+/.test(query)) {
            this.showCalculatorResult(query);
        } else if (lowerQuery.includes('time')) {
            this.showTimeResult();
        } else if (lowerQuery.includes('translate')) {
            this.showTranslateResult(query);
        } else if (lowerQuery.length > 3) {
            // Try to get Wikipedia summary for longer queries
            await this.showEnhancedSearchResult(query);
        } else {
            this.showGeneralSearchResult(query);
        }

        // Clear search and refocus
        this.searchInput.value = '';
        this.clearBtn.style.display = 'none';
        this.searchInput.focus();
    }

    async showEnhancedWeatherResult(query) {
        const weatherData = await this.fetchRealTimeWeather();
        alert(`🌤️ Weather Search: "${query}"\n\nCurrent conditions:\n• Location: ${weatherData.location}\n• Temperature: ${weatherData.temperature}°C\n• Condition: ${weatherData.condition}\n• Humidity: ${weatherData.humidity}%\n• Wind: ${weatherData.windSpeed} km/h\n\nIn a real implementation, this would show live weather data with maps and forecasts.`);
    }

    async showEnhancedSearchResult(query) {
        const wikipediaSummary = await this.fetchWikipediaSummary(query);
        
        if (wikipediaSummary) {
            alert(`🔍 Enhanced Search Result: "${query}"\n\n📖 Quick Summary from Wikipedia:\n${wikipediaSummary.extract.substring(0, 200)}...\n\nIn a real implementation, this would show:\n• Web results with rich snippets\n• Knowledge panels\n• Related searches\n• Images and videos\n• Shopping results\n• Local results`);
        } else {
            this.showGeneralSearchResult(query);
        }
    }

    // Search Functions with API integration
    async performSearch() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.saveToSearchHistory(query);
        this.hideSuggestions();

        // Show loading indicator
        this.showSearchLoading();

        // Simulate different types of searches with API integration
        await this.handleSpecialSearches(query);
    }

    showSearchLoading() {
        // Create a temporary loading overlay
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'searchLoading';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1);
            z-index: 2000;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        loadingDiv.innerHTML = '<div class="loading"></div><span>Searching...</span>';
        document.body.appendChild(loadingDiv);

        // Remove after a short delay
        setTimeout(() => {
            const loading = document.getElementById('searchLoading');
            if (loading) loading.remove();
        }, 1000);
    }

    showCalculatorResult(query) {
        try {
            // Simple math evaluation (in real app, use a proper math parser)
            const result = eval(query.replace(/[^0-9+\-*/().]/g, ''));
            alert(`🧮 Calculator: "${query}"\n\nResult: ${result}\n\nIn a real implementation, this would show a calculator widget.`);
        } catch {
            alert(`🧮 Calculator: "${query}"\n\nSorry, I couldn't calculate that. Please check your expression.`);
        }
    }

    showTimeResult() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString();
        alert(`🕐 Current Time\n\nTime: ${timeString}\nDate: ${dateString}\n\nIn a real implementation, this would show time zones and world clocks.`);
    }

    showTranslateResult(query) {
        alert(`🌐 Translate: "${query}"\n\nGoogle Translate would appear here with:\n• Auto-detected source language\n• Translation options\n• Voice pronunciation\n• Alternative translations\n\nIn a real implementation, this would use Google Translate API.`);
    }

    showGeneralSearchResult(query) {
        alert(`🔍 Searching for: "${query}"\n\nIn a real implementation, this would:\n• Redirect to search results page\n• Show web results, images, videos\n• Display knowledge panels\n• Provide related searches\n• Show ads and shopping results`);
    }

    feelingLucky() {
        const query = this.searchInput.value.trim();
        const searchTerm = query || this.sampleSuggestions[Math.floor(Math.random() * this.sampleSuggestions.length)];
        
        this.saveToSearchHistory(searchTerm);
        alert(`🍀 I'm Feeling Lucky: "${searchTerm}"\n\nIn a real implementation, this would take you directly to the first search result without showing the search results page.`);
        
        this.searchInput.value = '';
        this.clearBtn.style.display = 'none';
        this.searchInput.focus();
    }

    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the Google Search Clone
document.addEventListener('DOMContentLoaded', () => {
    const googleSearch = new GoogleSearchClone();
    
    // Create debounced search function
    googleSearch.debouncedSearch = googleSearch.debounce((query) => {
        if (query.trim()) {
            googleSearch.showSuggestions(query);
        } else {
            googleSearch.hideSuggestions();
        }
    }, 150);

    // Global functions for HTML onclick handlers
    window.performSearch = () => googleSearch.performSearch();
    window.feelingLucky = () => googleSearch.feelingLucky();

    // Focus search input on page load
    googleSearch.searchInput.focus();

    // Add some demo search history if none exists
    if (googleSearch.searchHistory.length === 0) {
        const demoHistory = ['javascript tutorial', 'weather today', 'react hooks', 'css grid'];
        localStorage.setItem('googleSearchHistory', JSON.stringify(demoHistory));
        googleSearch.loadSearchHistory();
    }

    // Add loading state simulation
    googleSearch.simulateLoading = () => {
        googleSearch.isLoading = true;
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'suggestion-item';
        loadingDiv.innerHTML = '<div class="loading"></div>Loading suggestions...';
        googleSearch.suggestionsContent.innerHTML = '';
        googleSearch.suggestionsContent.appendChild(loadingDiv);
        googleSearch.suggestionsContainer.classList.add('show');
        
        setTimeout(() => {
            googleSearch.isLoading = false;
            const query = googleSearch.searchInput.value;
            if (query.trim()) {
                googleSearch.showSuggestions(query);
            }
        }, 300);
    };
});
