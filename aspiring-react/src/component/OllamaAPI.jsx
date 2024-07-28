import { useState, useEffect } from 'react';

const OllamaAPI = () => {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('qwen2:0.5b');
    const [availableModels, setAvailableModels] = useState(['qwen2:0.5b', 'qwen2:1.5b', 'phi3']);
    const [loading, setLoading] = useState(false);
    const [activeModel, setActiveModel] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const pullModel = async () => {
        setLoading(true);
        const response = await fetch("/ollama/api/pull", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: selectedModel })
        });
        await fetchModels();
        setLoading(false);
    };

    const fetchModels = async () => {
        const response = await fetch("/ollama/api/tags");
        const result = await response.json();
        setModels(result.models);
        const pulledModels = result.models.map(model => model.model);
        setAvailableModels(['qwen2:0.5b', 'qwen2:1.5b', 'phi3'].filter(model => !pulledModels.includes(model)));
    };

    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };

    const handleModelClick = (model) => {
        if (activeModel?.model === model.model) {
            setActiveModel(null);
        } else {
            setActiveModel(model);
        }
    };

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleSendPrompt = async () => {
        const newChatHistory = [...chatHistory, { sender: 'user', message: prompt }];
        setChatHistory(newChatHistory);
        setPrompt('');
        const response = await fetch('/ollama/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ model: activeModel.model, prompt })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        const readStream = async () => {
            let generatedMessage = '';
            
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');
                const newResponses = lines.map(line => JSON.parse(line).response).join(' ');
            
                generatedMessage += newResponses;
            
                setChatHistory(prevChatHistory => {
                    const updatedChatHistory = [...prevChatHistory];
                    updatedChatHistory[updatedChatHistory.length - 1] = { sender: 'ai', message: generatedMessage };
                    return updatedChatHistory;
                });
            }
        };

        setChatHistory(prevChatHistory => [...prevChatHistory, { sender: 'ai', message: '' }]);
        readStream();
    };

    useEffect(() => {
        fetchModels();
    }, []);

    return (
        <div style={{ marginTop: '50px' }}>
            <h3>Ollama service server in Python / Ollama in container</h3>
            <div style={{ border: '1px solid', borderRadius: '5px', margin: '10px', padding: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <label htmlFor="modelSelect">Select Model: </label>
                    <select id="modelSelect" value={selectedModel} onChange={handleModelChange} disabled={loading}>
                        {availableModels.map((model, index) => (
                            <option key={index} value={model}>{model}</option>
                        ))}
                    </select>
                    {loading ? (
                        <div className="spinner" style={{ marginLeft: 'auto' }}></div>
                    ) : (
                        <button onClick={pullModel} style={{ marginLeft: 'auto' }}>Pull Model</button>
                    )}
                </div>
            </div>
            {models.length > 0 && (
                <div style={{ border: '1px solid', borderRadius: '5px', margin: '10px', padding: '10px' }}>
                    <h4>Pulled Models</h4>
                    {models.map((model, index) => (
                        <div
                            key={index}
                            style={{
                                border: `${activeModel?.model === model.model ? '2px purple' : '1px black'} solid`,
                                borderRadius: '5px',
                                margin: '10px',
                                padding: '10px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                backgroundColor: `${activeModel?.model === model.model ? '#D7BFDC' : 'white'}`,
                                opacity: `${activeModel?.model === model.model ? '.6' : '1'}`
                            }}
                            onClick={() => handleModelClick(model)}
                        >
                            Model: <strong>{model.model}</strong> <br />
                            Family: <strong>{model.details.family}</strong> <br />
                            Parameter Size: <strong>{model.details.parameter_size}</strong> <br/>
                            Format: <strong>{model.details.format}</strong> <br/>
                            Quantization Level: <strong>{model.details.quantization_level}</strong> <br/>
                            Modified At: <strong>{model.modified_at}</strong>
                        </div>
                    ))}
                    {activeModel && (
                        <div style={{ marginTop: '20px', padding: '10px' }}>
                            {chatHistory.length > 0 && (
                                <div style={{
                                    maxHeight: '700px',
                                    overflowY: 'auto',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    marginBottom: '10px',
                                    width: '100%',
                                    maxWidth: '380px',
                                    wordWrap: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    backgroundColor: '#f9f9f9',
                                }}>
                                    {chatHistory.map((chat, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                justifyContent: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                                                marginBottom: '10px'
                                            }}
                                        >
                                            <div style={{
                                                maxWidth: '80%',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                backgroundColor: chat.sender === 'user' ? '#d1e7dd' : '#e2e3e5',
                                                textAlign: chat.sender === 'user' ? 'right' : 'left'
                                            }}>
                                                {chat.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <textarea
                                type="text"
                                value={prompt}
                                onChange={handlePromptChange}
                                placeholder="Type your prompt here..."
                                style={{width: '98%', marginTop: '15px', marginBottom: '10px', resize: 'vertical'}}
                            />
                            <button onClick={handleSendPrompt} style={{width: '100%', padding: '10px'}}>Send Prompt</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OllamaAPI;
