// Initialize mood tracking data
let moodData = JSON.parse(localStorage.getItem('moodData')) || {
    labels: [],
    moods: [],
    recommendations: []
};

// Function to initialize the mood graph
function initializeMoodGraph() {
    const ctx = document.getElementById('moodGraph').getContext('2d');
    const moodGraph = new Chart(ctx, {
        type: 'line',
        data: {
            labels: moodData.labels,
            datasets: [{
                label: 'Mood Levels',
                data: moodData.moods,
                borderColor: '#8ACCD5',
                backgroundColor: 'rgba(255, 193, 218, 0.2)',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointBackgroundColor: '#FF90BB',
                pointBorderColor: '#8ACCD5',
                pointHoverBackgroundColor: '#FFC1DA',
                pointHoverBorderColor: '#FF90BB',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    grid: {
                        color: 'rgba(138, 204, 213, 0.1)',
                        borderColor: '#8ACCD5'
                    },
                    ticks: {
                        color: '#333333'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(138, 204, 213, 0.1)',
                        borderColor: '#8ACCD5'
                    },
                    ticks: {
                        color: '#333333'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#333333',
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            }
        }
    });
}

// Function to update statistics
function updateStatistics() {
    const sadCount = moodData.moods.filter(mood => mood <= 3).length;
    const sickCount = moodData.recommendations.filter(rec => rec.type === 'sick').length;
    
    const totalEntries = moodData.moods.length || 1;
    const sadnessLevel = Math.round((sadCount / totalEntries) * 100);
    const sicknessLevel = Math.round((sickCount / totalEntries) * 100);
    
    document.getElementById('sadnessLevel').textContent = `${sadnessLevel}%`;
    document.getElementById('sicknessLevel').textContent = `${sicknessLevel}%`;
}

// Function to display recommendations in the widget
function displayRecommendations() {
    const recommendationBox = document.getElementById('recommendationBox');
    recommendationBox.innerHTML = '<h3>Past Recommendations</h3>';

    // Get the last 5 recommendations
    const recentRecommendations = moodData.recommendations.slice(-5).reverse();
    
    if (recentRecommendations.length === 0) {
        recommendationBox.innerHTML += '<p class="no-recommendations">No recommendations yet.</p>';
        return;
    }

    const recList = document.createElement('ul');
    recList.className = 'recommendation-list';

    recentRecommendations.forEach(rec => {
        const recItem = document.createElement('li');
        recItem.className = 'recommendation-item';
        
        const date = new Date(rec.date);
        const formattedDate = date.toLocaleDateString();
        
        recItem.innerHTML = `
            <div class="rec-header">
                <span class="rec-mood">${rec.type}</span>
                <span class="rec-date">${formattedDate}</span>
            </div>
            <div class="rec-content">
                <h4>Products:</h4>
                <ul class="rec-list">
                    ${rec.products.slice(0, 3).map(product => `<li>${product}</li>`).join('')}
                </ul>
                <h4>Activities:</h4>
                <ul class="rec-list">
                    ${rec.activities.slice(0, 3).map(activity => `<li>${activity}</li>`).join('')}
                </ul>
            </div>
        `;
        recList.appendChild(recItem);
    });

    recommendationBox.appendChild(recList);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeMoodGraph();
    updateStatistics();
    displayRecommendations();
}); 