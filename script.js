document.addEventListener('DOMContentLoaded', () => {
    const weatherInfoDiv = document.getElementById('weather-info');
    const currentTimeDiv = document.getElementById('current-time');

    async function getWeatherData() {
        try {
            // First, get the forecast office and gridpoint for San Antonio
            const pointsResponse = await fetch('https://api.weather.gov/points/29.42,-98.49');
            if (!pointsResponse.ok) {
                throw new Error('Could not retrieve location data from weather.gov');
            }
            const pointsData = await pointsResponse.json();
            const forecastUrl = pointsData.properties.forecast;

            // Now, get the actual forecast
            const forecastResponse = await fetch(forecastUrl);
            if (!forecastResponse.ok) {
                throw new Error('Could not retrieve forecast data from weather.gov');
            }
            const forecastData = await forecastResponse.json();

            // Get the current forecast (the first period in the array)
            const currentForecast = forecastData.properties.periods[0];

            // Display the weather
            weatherInfoDiv.innerHTML = `
                <div class="weather-card">
                    <h3>${currentForecast.name}</h3>
                    <p class="temperature">${currentForecast.temperature}&deg;${currentForecast.temperatureUnit}</p>
                    <p>${currentForecast.detailedForecast}</p>
                </div>
            `;
        } catch (error) {
            console.error('Error fetching weather data:', error);
            weatherInfoDiv.innerHTML = '<p>Could not load weather data. Please try again later.</p>';
        }
    }

    function updateTime() {
        const now = new Date();
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: 'America/Chicago' // San Antonio's timezone
        };
        currentTimeDiv.textContent = now.toLocaleTimeString('en-US', options);
    }

    getWeatherData();
    updateTime(); // Initial call
    setInterval(updateTime, 1000); // Update every second
});
