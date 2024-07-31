import { useState, useEffect } from 'react';

const WeatherAPI = () => {
    const [forecasts, setForecasts] = useState([]);

    const requestWeather = async () => {
        try {
            const weather = await fetch("/weather/forecast");
            const weatherJson = await weather.json();

            setForecasts(weatherJson);
        } catch (error) {
            console.error("Failed to fetch weather data:", error);
            setForecasts([]); 
        }
    };

    useEffect(() => {
        requestWeather();
    }, []);

    return (
        <div style={{ marginTop: '50px' }}>
            <h3>Weather API service / PostgreSQL DB</h3>
            <div style={{ border: '1px solid', borderRadius: '5px', margin: '10px', padding: '10px', display: 'flex', justifyContent: 'center' }}>
                <table>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Temp. (C)</th>
                        <th>Temp. (F)</th>
                        <th>Summary</th>
                    </tr>
                    </thead>
                    <tbody>
                    {forecasts && forecasts.length > 0 ? (
                        forecasts.map((w) => (
                            <tr key={w.date}>
                                <td>{w.date}</td>
                                <td>{w.temperatureC}</td>
                                <td>{w.temperatureF}</td>
                                <td>{w.summary}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No forecasts available</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WeatherAPI;
