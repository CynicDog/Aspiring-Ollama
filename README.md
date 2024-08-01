#### Read more about the project in [my article](https://cynicdog.github.io/posts/azure-aspire-with-containerized-ollama/). 📰

#### Architecture of AspirngOllama 
``` mermaid
flowchart TD
    
    A([React UI Client]) --> B([Python Ollama server])
    B --> E([Containerized Ollama])
    A --> C([.NET weather API server])
    C --> D([Containerized PostgreSQL])
    F([Aspire AppHost]) -. ollamaservice_bindings_http_targetPort .- A
    F -. apiservice_bindings_http_targetPort .- A
    F -. connectionString .- C
    F -. ollama_bindings_ollama-uri_url .- B
    F -. db credentials, init_d .- D
     
    classDef container stroke:#333,stroke-width:1px;
    class A,B,C,D,E container;

    linkStyle 4,5,6,7,8 stroke-width:.3px,color:grey;
```

#### Reverse proxy details
```mermaid
flowchart TD
    
    A([React UI Client]) --> |ollamaservice:8000| B(Reverse Proxy)
    B --> |localhost:RANDOM_PORT| E([Python Ollama server])
    A --> |apiservice:8080| C(Reverse Proxy)
    C --> |localhost:RANDOM_PORT| D([.NET weather API server])
    F(Kubernetes) -. NodePort .- A 
    F -. NodePort .- D
    F -. NodePort .- E

    classDef container stroke:#333,stroke-width:1px;
    class B,C container;

    linkStyle 4,5,6 stroke-width:.2px,color:grey;
```

<details>
  <summary>First look in to the app 👀</summary>
  <img src="https://github.com/user-attachments/assets/0411f62d-2976-4c6d-a5a4-a42440a33013"></img>
</details>

<details>
  <summary>Aspire Dashboard 👨‍🏫</summary>
  <img src="https://github.com/user-attachments/assets/b558e398-d955-4ccd-afbb-6a529416298e"></img>
</details>

<details>
  <summary>Local Kubernetes deployment details ⚓</summary>
  <img src="https://github.com/user-attachments/assets/9db18082-ad24-4e12-ab2b-33093cfb7f89"></img>
</details>
