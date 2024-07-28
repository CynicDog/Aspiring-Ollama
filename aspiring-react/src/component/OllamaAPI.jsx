import { useState, useEffect } from 'react';

const OllamaAPI = () => {
    const [selectedModel, setSelectedModel] = useState('qwen2:1.5b');
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(false);

    const pullModel = async () => {
        setLoading(true);
        
        const response = await fetch("/ollama/api/pull", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: selectedModel })
        });

        fetchModels();
        setLoading(false);
    };

    const fetchModels = async () => {
        
        const response = await fetch("/ollama/api/tags");
            
        const result = await response.json();
        setModels(result.models);
    };

    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };

    useEffect(() => {
        fetchModels();
    }, []);

    return (
        <div style={{ marginTop: '50px' }}>
            <h4>Ollama service in Python / Ollama in container</h4>
            <div style={{ border: '1px solid', borderRadius: '5px', margin: '10px', padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <label htmlFor="modelSelect">Select Model: </label>
                    <select id="modelSelect" value={selectedModel} onChange={handleModelChange} disabled={loading}>
                        <option value="qwen2:1.5b">qwen2:1.5b</option>
                        <option value="phi3">phi3</option>
                    </select>
                    {loading ? (
                        <div className="spinner"></div>
                    ) : (
                        <button onClick={pullModel}>Pull Model</button>
                    )}
                </div>
            </div>
            {models.length > 0 && (
                <div style={{ border: '1px solid', borderRadius: '5px', margin: '10px', padding: '10px' }}>
                    <h4>Pulled Models</h4>
                    {models.map((model, index) => (
                        <div key={index} style={{ border: '1px solid', borderRadius: '5px', margin: '10px', padding: '10px', textAlign: 'left' }}>
                            <strong>Model:</strong> {model.model}<br />
                            <strong>Family:</strong> {model.details.family}<br />
                            <strong>Parameter Size:</strong> {model.details.parameter_size}<br />
                            <strong>Format:</strong> {model.details.format}<br />
                            <strong>Quantization Level:</strong> {model.details.quantization_level}<br />
                            <strong>Modified At:</strong> {model.modified_at}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OllamaAPI;
