// Handle profile picture upload
const profilePicture = document.getElementById('profilePicture');
const profilePictureInput = document.getElementById('profilePictureInput');
const profileImage = document.getElementById('profileImage');

// Set up profile picture click handler
profilePicture.addEventListener('click', () => {
    profilePictureInput.click();
});

// Handle profile picture change
profilePictureInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            profileImage.src = imageData;
            // Save image data to localStorage
            localStorage.setItem('profilePicture', imageData);
        };
        reader.readAsDataURL(file);
    }
});

// Profile form handling
const profileForm = document.getElementById('profileForm');

// Load saved profile data
function loadProfile() {
    const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
    const savedPicture = localStorage.getItem('profilePicture');

    // Load profile picture if exists
    if (savedPicture) {
        profileImage.src = savedPicture;
    }

    // Fill form fields with saved data
    if (profileData.name) document.getElementById('name').value = profileData.name;
    if (profileData.gender) {
        const genderInput = document.querySelector(`input[name="gender"][value="${profileData.gender}"]`);
        if (genderInput) genderInput.checked = true;
    }
    if (profileData.age) document.getElementById('age').value = profileData.age;
    if (profileData.weight) document.getElementById('weight').value = profileData.weight;
    if (profileData.allergies) document.getElementById('allergies').value = profileData.allergies;
    
    // Handle health goals (multiple select)
    if (profileData.healthGoals) {
        const healthGoalsSelect = document.getElementById('healthGoals');
        profileData.healthGoals.forEach(goal => {
            const option = healthGoalsSelect.querySelector(`option[value="${goal}"]`);
            if (option) option.selected = true;
        });
    }
}

// Save profile data
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value,
        age: document.getElementById('age').value,
        weight: document.getElementById('weight').value,
        allergies: document.getElementById('allergies').value,
        healthGoals: Array.from(document.getElementById('healthGoals').selectedOptions).map(option => option.value)
    };

    // Save to localStorage
    localStorage.setItem('profileData', JSON.stringify(formData));

    // Show success message
    showNotification('Profile saved successfully!');
});

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Add styles dynamically
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#7B68EE';
    notification.style.color = 'white';
    notification.style.padding = '1rem 2rem';
    notification.style.borderRadius = '10px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.animation = 'slideIn 0.5s ease-out';
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add CSS animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Load profile data when page loads
loadProfile(); 