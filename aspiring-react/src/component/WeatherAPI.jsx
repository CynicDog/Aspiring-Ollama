import { useState, useEffect } from 'react';

const WeatherAPI = () => {
    const [forecasts, setForecasts] = useState([]);

    const requestWeather = async () => {
        const weather = await fetch("/weather/forecast");
        console.log(weather);

        const weatherJson = await weather.json();
        console.log(weatherJson);

        setForecasts(weatherJson);
    };

    useEffect(() => {
        requestWeather();
    }, []);

    return (
        <div style={{marginTop: '50px'}}>
            <h3>Weather API service / PostgreSQL DB</h3>
            <div style={{border: '1px solid', borderRadius: '5px', margin: '10px', padding: '10px'}}>
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
                    {(
                        forecasts ?? [
                            {
                                date: "N/A",
                                temperatureC: "",
                                temperatureF: "",
                                summary: "No forecasts",
                            },
                        ]
                    ).map((w) => {
                        return (
                            <tr key={w.date}>
                                <td>{w.date}</td>
                                <td>{w.temperatureC}</td>
                                <td>{w.temperatureF}</td>
                                <td>{w.summary}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WeatherAPI;
