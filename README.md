#### Read more about the project in [my article](https://cynicdog.github.io/posts/azure-aspire-with-containerized-ollama/). 📰

#### Architecture of AspirngOllama 
``` mermaid
flowchart TD
    
    A([React UI Client]) --> B([Python Ollama server])
    B --> E([Containerized Ollama])
    A --> C([.NET weather API server])
    C --> D([Containerized PostgreSQL])
    F([Aspire AppHost]) --- |ollamaservice.bindings.http.targetPort| A
    F --- |apiservice.bindings.http.targetPort| A
    F --- |connectionString| C
    F --- |ollama.bindings.ollama-uri.url| B
    F --- |db credentials, init.d| D
     
    classDef container stroke:#333,stroke-width:1px;
    class A,B,C,D,E container;

    linkStyle 4,5,6,7,8 stroke-width:.3px,color:grey;
```

<details>
  <summary>First look in to the app 👀</summary>
  <img src="https://github.com/user-attachments/assets/0411f62d-2976-4c6d-a5a4-a42440a33013"></img>
</details>

<details>
  <summary>Aspire Dashboard 👨‍🏫</summary>
  <img src="https://github.com/user-attachments/assets/b558e398-d955-4ccd-afbb-6a529416298e"></img>
</details>
 
