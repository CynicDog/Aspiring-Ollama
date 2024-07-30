import './App.css';
import WeatherAPI from './component/WeatherAPI.jsx';
import OllamaAPI from './component/OllamaAPI.jsx';

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h2>React UI</h2>
            </header>
            <WeatherAPI />
            <OllamaAPI />
        </div>
    );
}

export default App;
