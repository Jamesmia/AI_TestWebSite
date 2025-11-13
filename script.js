document.addEventListener('DOMContentLoaded', () => {
    const currentDayDateDiv = document.getElementById('current-day-date');
    const currentTimeDiv = document.getElementById('current-time');
    const postsContainer = document.getElementById('posts-container');

    // --- Date and Time Functions ---
    function updateDayDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'America/Chicago'
        };
        currentDayDateDiv.textContent = now.toLocaleDateString('en-US', options);
    }

    function updateTime() {
        const now = new Date();
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: 'America/Chicago'
        };
        currentTimeDiv.textContent = now.toLocaleTimeString('en-US', options);
    }

    // --- Restaurant Posts Functions ---
    async function loadRestaurantPosts() {
        try {
            const response = await fetch('restaurants.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const restaurants = await response.json();

            postsContainer.innerHTML = ''; // Clear loading message

            if (restaurants.length > 0) {
                restaurants.forEach(restaurant => {
                    const card = document.createElement('div');
                    card.className = 'restaurant-card';
                    card.innerHTML = `
                        <img src="${restaurant.image}" alt="${restaurant.name}">
                        <div class="restaurant-card-content">
                            <h3>${restaurant.name}</h3>
                            <p class="cuisine">${restaurant.cuisine}</p>
                            <p class="address">${restaurant.address}</p>
                            <p>${restaurant.description}</p>
                            <a href="${restaurant.website}" target="_blank">Visit Website</a>
                        </div>
                    `;
                    postsContainer.appendChild(card);
                });
            } else {
                postsContainer.innerHTML = '<p>No restaurant posts available.</p>';
            }

        } catch (error) {
            console.error('Error loading restaurant posts:', error);
            postsContainer.innerHTML = '<p>Could not load restaurant posts. Please try again later.</p>';
        }
    }

    // --- Initialize ---
    updateDayDate();
    updateTime();
    setInterval(updateTime, 1000); // Update time every second

    loadRestaurantPosts();
});
