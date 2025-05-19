// Add this function at the top of your script.js file
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Function to get user profile data
function getUserProfile() {
    return JSON.parse(localStorage.getItem('profileData') || '{}');
}

// Function to customize recommendations based on user profile
function customizeRecommendations(mood, recommendations) {
    const profile = getUserProfile();
    let customized = {...recommendations};

    // Age-based modifications
    if (profile.age) {
        const age = parseInt(profile.age);
        if (age > 60) {
            // Modify exercise recommendations for seniors
            if (mood === 'tired' || mood === 'lose-weight') {
                customized.activities = customized.activities.map(activity => 
                    activity.includes('HIIT') ? 'Low-impact cardio (swimming, walking)' : activity
                );
            }
        }
    }

    // Weight-based modifications
    if (profile.weight) {
        const weight = parseFloat(profile.weight);
        if (weight > 100) {
            // Modify exercise recommendations for higher weight
            customized.activities = customized.activities.map(activity =>
                activity.includes('running') ? 'Low-impact cardio (swimming, cycling)' : activity
            );
        }
    }

    // Gender-specific modifications
    if (profile.gender) {
        if (profile.gender === 'female') {
            if (mood === 'gain-weight') {
                customized.products.push('Iron supplements (consult doctor first)');
            }
        }
    }

    // Health goals based modifications
    if (profile.healthGoals) {
        if (profile.healthGoals.includes('stress-reduction')) {
            customized.activities.push('Meditation or deep breathing exercises');
        }
        if (profile.healthGoals.includes('better-sleep')) {
            customized.products.push('Sleep tracking app');
        }
    }

    // Allergy considerations
    if (profile.allergies) {
        const allergies = profile.allergies.toLowerCase();
        if (allergies.includes('dairy')) {
            customized.products = customized.products.filter(product => 
                !product.toLowerCase().includes('milk') && 
                !product.toLowerCase().includes('yogurt')
            );
        }
    }

    return customized;
}

// Recommendations data
const baseRecommendations = {
    'sick': {
        products: [
            'Herbal teas (ginger, chamomile, peppermint)',
            'Cough drops/throat lozenges',
            'Vitamin C supplements',
            'Thermometer',
            'Soft tissues',
            'Warm blanket',
            'Soup (chicken or vegetable broth)',
            'Nasal spray or vapor rub'
        ],
        activities: [
            'Resting/sleeping',
            'Watching light-hearted shows',
            'Listening to soft music or audiobooks',
            'Taking warm baths',
            'Journaling or light reading',
            'Doing light stretches or breathing exercises'
        ]
    },
    'tired': {
        products: [
            'Electrolyte drink or herbal energy tea',
            'Eye mask and noise-canceling earplugs',
            'Aromatherapy diffuser (lavender, eucalyptus)',
            'Comfortable pillow or neck support',
            'Healthy snacks (nuts, fruit, yogurt)',
            'Blue light blocking glasses'
        ],
        activities: [
            'Power nap (15–30 mins)',
            'Gentle walk or stretching',
            'Meditation or guided breathing',
            'Reducing screen time',
            'Journaling to clear mental clutter',
            'Light yoga'
        ]
    },
    'lose-weight': {
        products: [
            'Meal prep containers',
            'Digital kitchen scale',
            'Fitness tracker (e.g., Fitbit, smartwatch)',
            'Resistance bands or dumbbells',
            'Low-calorie snacks (rice cakes, air-popped popcorn)',
            'Water bottle with time markers',
            'Weight loss app (e.g., MyFitnessPal)'
        ],
        activities: [
            'Meal planning and cooking at home',
            'Daily walks or runs',
            'Strength training 2–3x/week',
            'HIIT workouts',
            'Tracking calories and progress',
            'Attending group fitness classes or online challenges'
        ]
    },
    'gain-weight': {
        products: [
            'High-calorie protein powder or shakes',
            'Nut butters, granola, dried fruits',
            'Meal prep containers',
            'Weightlifting equipment',
            'Blender for smoothies',
            'Mass gainer supplements (if necessary)'
        ],
        activities: [
            'Weight training (focus on progressive overload)',
            'Eating every 3–4 hours',
            'Cooking calorie-dense meals',
            'Tracking macronutrients',
            'Limiting cardio',
            'Sleep and recovery optimization'
        ]
    },
    'picnic': {
        products: [
            'Picnic basket or backpack',
            'Blanket or foldable chairs',
            'Reusable plates, cups, and utensils',
            'Cooler or ice packs',
            'Sunscreen and bug spray',
            'Portable speaker',
            'Frisbee, cards, or board games'
        ],
        activities: [
            'Eating and relaxing in nature',
            'Playing outdoor games (badminton, volleyball)',
            'Listening to music',
            'Taking photos',
            'Reading or sketching',
            'Nature walk or hike nearby'
        ]
    },
    'sad': {
        products: [
            'Comfort food or drink (hot chocolate, soup)',
            'Cozy blanket and soft pillow',
            'Journal or mood tracker',
            'Scented candles or essential oils',
            'Inspirational or uplifting book',
            'Self-care kit (face mask, bath salts, etc.)'
        ],
        activities: [
            'Talking to a friend or therapist',
            'Going for a walk or light exercise',
            'Watching a comforting movie',
            'Practicing mindfulness or gratitude journaling',
            'Listening to calming or uplifting music',
            'Doing something creative (drawing, writing, crafting)'
        ]
    },
    'happy': {
        products: [
            'Celebration snacks or treats',
            'Camera or phone for photos',
            'Party decorations or confetti',
            'Playlist or music speaker',
            'Journal or memory book',
            'Thank-you cards (if happiness is gratitude-related)'
        ],
        activities: [
            'Sharing time with friends/family',
            'Dancing or singing',
            'Creating something (art, photo album, video)',
            'Volunteering or helping others',
            'Going out (nature, event, favorite place)',
            'Writing down what made you happy to revisit later'
        ]
    }
};

// Function to create loading animation
function showLoadingMessage() {
    const chatMessages = document.getElementById('chatMessages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot-message';
    loadingDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-robot bot-icon"></i>
            <p>Thinking<span class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </span></p>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    return loadingDiv;
}

// Modified addMessage function with typing effect
function addMessage(content, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const messageContent = `
        <div class="message-content">
            ${!isUser ? '<i class="fas fa-robot bot-icon"></i>' : ''}
            <p></p>
        </div>
    `;
    
    messageDiv.innerHTML = messageContent;
    chatMessages.appendChild(messageDiv);
    
    const paragraph = messageDiv.querySelector('p');
    typeWriter(paragraph, content);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Return a promise that resolves when typing is complete
    return new Promise(resolve => {
        setTimeout(() => resolve(), content.length * 50 + 500);
    });
}

// Modified selectMood function
async function selectMood(mood) {
    showLoadingMessage();
    
    // Get customized recommendations
    const recommendations = customizeRecommendations(mood, baseRecommendations[mood]);
    
    // Store the recommendation in localStorage for archive
    const moodData = JSON.parse(localStorage.getItem('moodData')) || {
        labels: [],
        moods: [],
        recommendations: []
    };
    
    const today = new Date();
    moodData.labels.push(today.toLocaleDateString());
    moodData.moods.push(getMoodValue(mood));
    moodData.recommendations.push({
        date: today.toISOString(),
        type: mood,
        products: recommendations.products,
        activities: recommendations.activities
    });
    
    // Keep only the last 30 days of data
    if (moodData.labels.length > 30) {
        moodData.labels = moodData.labels.slice(-30);
        moodData.moods = moodData.moods.slice(-30);
        moodData.recommendations = moodData.recommendations.slice(-30);
    }
    
    localStorage.setItem('moodData', JSON.stringify(moodData));
    
    // Display recommendations
    await displayRecommendations(recommendations, mood);
}

// Helper function to convert mood to numerical value for graphing
function getMoodValue(mood) {
    const moodValues = {
        'happy': 9,
        'picnic': 7,
        'tired': 5,
        'sad': 3,
        'sick': 2,
        'lose-weight': 6,
        'gain-weight': 6
    };
    return moodValues[mood] || 5;
}

// Add chart data to home page if we're on the home page
if (document.querySelector('.chart-bars')) {
    const chartData = [5, 7, 3, 8, 6, 4];
    const chartBars = document.querySelector('.chart-bars');
    
    chartData.forEach((height, index) => {
        const bar = document.createElement('div');
        bar.style.height = `${height * 20}px`;
        bar.style.width = '30px';
        // Alternate between colors from the pastel palette
        const colors = ['#8ACCD5', '#FF90BB', '#FFC1DA', '#8ACCD5', '#FF90BB', '#FFC1DA'];
        bar.style.backgroundColor = colors[index % colors.length];
        bar.style.borderRadius = '5px';
        bar.style.transition = 'all 0.3s ease';
        bar.style.cursor = 'pointer';
        bar.style.boxShadow = '0 2px 4px rgba(138, 204, 213, 0.1)';
        
        bar.addEventListener('mouseover', () => {
            bar.style.transform = 'translateY(-5px)';
            bar.style.boxShadow = '0 4px 15px rgba(138, 204, 213, 0.2)';
        });
        
        bar.addEventListener('mouseout', () => {
            bar.style.transform = 'translateY(0)';
            bar.style.boxShadow = '0 2px 4px rgba(138, 204, 213, 0.1)';
        });
        
        chartBars.appendChild(bar);
    });
}

// Handle profile form submission if we're on the profile page
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Profile updated successfully!');
    });
}

async function displayRecommendations(recommendations, mood) {
    // Add user's selection to chat
    await addMessage(`I'm feeling ${mood.replace('-', ' ')}`, true);
    
    // Show loading animation
    const loadingMessage = showLoadingMessage();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Remove loading message
    loadingMessage.remove();
    
    // Add bot response
    await addMessage("I've prepared some personalized recommendations for you! Check out the suggestions in the panel on the right →");
    
    // Update the recommendations panel with animation
    const recommendationsWidgets = document.getElementById('recommendationsWidgets');
    recommendationsWidgets.innerHTML = `
        <div class="widget">
            <h3>Recommended Products</h3>
            <ul>
                ${recommendations.products.map(product => `<li>${product}</li>`).join('')}
            </ul>
        </div>
        <div class="widget">
            <h3>Recommended Activities</h3>
            <ul>
                ${recommendations.activities.map(activity => `<li>${activity}</li>`).join('')}
            </ul>
        </div>
    `;
} 