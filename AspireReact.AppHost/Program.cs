var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var db_username = builder.AddParameter("psql-username", secret: true); 
var db_password = builder.AddParameter("psql-password", secret: true);
var db_name = "aspiringreact";
var weatherDatabase = builder.AddPostgres(
        "postgres",  
        userName: db_username, 
        password: db_password)
    .WithEnvironment("POSTGRES_DB", db_name)
    .WithBindMount(
        "../AspireReact.ApiService/data/postgres",
        "/docker-entrypoint-initdb.d")
    .AddDatabase(db_name);

var ollama = builder.AddContainer("ollama", "ollama/ollama")
    .WithVolume("/root/.ollama")
    .WithBindMount("./ollama-config", "/root/")
    .WithEntrypoint("/root/entrypoint.sh")
    .WithHttpEndpoint(port: 11434, targetPort: 11434, name: "OllamaOpenApiEndpointUri")
    // .WithContainerRuntimeArgs("--gpus=all")
    ;

var ollamaOpenApiEndpointUri = ollama.GetEndpoint("OllamaOpenApiEndpointUri");

var ollamaService = builder.AddPythonProject("ollamaservice", "../aspiring-ollama-service", "main.py")
    .WithEndpoint(env: "PORT")
    .WithEnvironment("OllamaOpenApiEndpointUri", ollamaOpenApiEndpointUri);

var apiService = builder
    .AddProject<Projects.AspireReact_ApiService>("apiservice")
    .WithReference(weatherDatabase);

builder.AddNpmApp("react", "../aspiring-react")
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WithReference(apiService)
    .WithReference(ollamaService)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "PORT")
    .PublishAsDockerFile();

builder.Build().Run();
