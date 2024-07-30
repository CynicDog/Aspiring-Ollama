import './App.css';
import WeatherAPI from './component/WeatherAPI.jsx';
import OllamaAPI from './component/OllamaAPI.jsx';

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h2>React UI</h2>
            </header>
            {/* temporally disalbed due to network settings (likely due to the port mapping of AspireReact_ApiService. Should be mapped to 8080 not the default value of 5329 in the `launchSettings.json`. */}
            {/*<WeatherAPI />*/}
            <OllamaAPI />
        </div>
    );
}

export default App;
