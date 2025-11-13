document.addEventListener('DOMContentLoaded', () => {
    const currentDayDateDiv = document.getElementById('current-day-date');
    const currentTimeDiv = document.getElementById('current-time');
    const currentWeatherInfoDiv = document.getElementById('current-weather-info');
    const monthlyForecastInfoDiv = document.getElementById('monthly-forecast-info');
    const eventsInfoDiv = document.getElementById('events-info');

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

    // --- Weather and Forecast Functions ---
    async function getWeatherData() {
        try {
            // San Antonio coordinates
            const lat = 29.42;
            const lon = -98.49;

            // Get forecast office and gridpoint
            const pointsResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
            if (!pointsResponse.ok) {
                throw new Error('Could not retrieve location data from weather.gov');
            }
            const pointsData = await pointsResponse.json();
            if (!pointsData.properties || !pointsData.properties.forecast || !pointsData.properties.forecastHourly) {
                throw new Error('Invalid location data received from weather.gov: missing properties or forecast URLs.');
            }
            const forecastUrl = pointsData.properties.forecast;
            const forecastHourlyUrl = pointsData.properties.forecastHourly;

            // Get current conditions (using hourly forecast for a more "current" feel)
            const hourlyResponse = await fetch(forecastHourlyUrl);
            if (!hourlyResponse.ok) {
                throw new Error('Could not retrieve hourly forecast data from weather.gov');
            }
            const hourlyData = await hourlyResponse.json();
            if (!hourlyData.properties || !hourlyData.properties.periods || hourlyData.properties.periods.length === 0) {
                throw new Error('Invalid hourly forecast data received from weather.gov.');
            }

            const currentPeriod = hourlyData.properties.periods[0];
            currentWeatherInfoDiv.innerHTML = `
                <p class="temperature">${currentPeriod.temperature}&deg;${currentPeriod.temperatureUnit}</p>
                <p class="description">${currentPeriod.shortForecast}</p>
                <p>${currentPeriod.detailedForecast}</p>
            `;

            // Get monthly forecast
            const forecastResponse = await fetch(forecastUrl);
            if (!forecastResponse.ok) {
                throw new Error('Could not retrieve daily forecast data from weather.gov');
            }
            const forecastData = await forecastResponse.json();
            if (!forecastData.properties || !forecastData.properties.periods || forecastData.properties.periods.length === 0) {
                throw new Error('Invalid daily forecast data received from weather.gov.');
            }

            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const monthlyForecasts = forecastData.properties.periods.filter(period => {
                const periodDate = new Date(period.startTime);
                return periodDate.getMonth() === currentMonth && periodDate.getFullYear() === currentYear;
            });

            if (monthlyForecasts.length > 0) {
                monthlyForecastInfoDiv.innerHTML = monthlyForecasts.map(period => `
                    <div class="forecast-card">
                        <h3>${period.name}</h3>
                        <p class="temp">${period.temperature}&deg;${period.temperatureUnit}</p>
                        <p class="desc">${period.shortForecast}</p>
                    </div>
                `).join('');
            } else {
                monthlyForecastInfoDiv.innerHTML = '<p>No monthly forecast available.</p>';
            }

        } catch (error) {
            console.error('Error fetching weather data:', error);
            currentWeatherInfoDiv.innerHTML = '<p>Could not load current weather data.</p>';
            monthlyForecastInfoDiv.innerHTML = '<p>Could not load monthly forecast data.</p>';
        }
    }

    // --- Events Functions ---
    async function getEventsData() {
        // NOTE: You need to obtain an API key from AllEvents.in (or Eventbrite)
        // and replace 'YOUR_ALLEVENT_API_KEY' below.
        // For AllEvents, you might need to sign up and get an API key from their developer portal.
        // Example API endpoint (this might need adjustment based on actual API docs):
        // const eventsApiUrl = `https://api.allevents.in/events?city=San%20Antonio&start_date=${startDate}&end_date=${endDate}&api_key=YOUR_ALLEVENT_API_KEY`;

        eventsInfoDiv.innerHTML = '<p>Events API integration requires an API key and specific endpoint. Please refer to AllEvents.in or Eventbrite API documentation.</p>';
        eventsInfoDiv.innerHTML += '<p>For now, here is a placeholder for events:</p>';
        eventsInfoDiv.innerHTML += `
            <div class="event-card">
                <h3>San Antonio Placeholder Event 1</h3>
                <p class="event-date">November 15, 2025 - 7:00 PM</p>
                <p>A fantastic placeholder event happening downtown.</p>
            </div>
            <div class="event-card">
                <h3>San Antonio Placeholder Event 2</h3>
                <p class="event-date">November 22, 2025 - 10:00 AM</p>
                <p>Another exciting placeholder event for the whole family.</p>
            </div>
        `;

        // Placeholder for actual API call
        /*
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const startDate = startOfMonth.toISOString().split('T')[0];
            const endDate = endOfMonth.toISOString().split('T')[0];

            const response = await fetch(eventsApiUrl); // Replace with actual API URL
            if (!response.ok) {
                throw new Error('Could not retrieve events data.');
            }
            const data = await response.json();

            // Assuming 'data.events' is an array of event objects
            if (data.events && data.events.length > 0) {
                eventsInfoDiv.innerHTML = data.events.map(event => `
                    <div class="event-card">
                        <h3>${event.title}</h3>
                        <p class="event-date">${new Date(event.start_time).toLocaleString()}</p>
                        <p>${event.description || 'No description available.'}</p>
                    </div>
                `).join('');
            } else {
                eventsInfoDiv.innerHTML = '<p>No events found for this month.</p>';
            }

        } catch (error) {
            console.error('Error fetching events data:', error);
            eventsInfoDiv.innerHTML = '<p>Could not load events data. Please try again later.</p>';
        }
        */
    }


    // --- Initialize ---
    updateDayDate();
    updateTime();
    setInterval(updateTime, 1000); // Update time every second

    getWeatherData();
    getEventsData();
});