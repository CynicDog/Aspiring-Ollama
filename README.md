#### Architecture  
``` mermaid
flowchart TD
    A[React UI Client] --> B[Python Ollama server]
    B --> E[Containerized Ollama]
    A --> C[.NET weather API server]
    C --> D[Containerized PostgreSQL]
   
    classDef container stroke:#333,stroke-width:1px;
    class A,B,C,D,E,F container;
```

#### First look 
![스크린샷 2024-07-31 112047](https://github.com/user-attachments/assets/0411f62d-2976-4c6d-a5a4-a42440a33013)

#### Dashboard 
![스크린샷 2024-07-31 105931](https://github.com/user-attachments/assets/b558e398-d955-4ccd-afbb-6a529416298e)
