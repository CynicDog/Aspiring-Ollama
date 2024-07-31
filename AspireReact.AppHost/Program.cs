var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");

var db_username = builder.AddParameter("psql-username", secret: true); 
var db_password = builder.AddParameter("psql-password", secret: true);
var db_name = "aspiringreact";
var weatherDatabase = builder
    .AddPostgres(
        "postgres",  
        userName: db_username, 
        password: db_password)
    .WithEnvironment("POSTGRES_DB", db_name)
    .WithBindMount(
        "../AspireReact.ApiService/data/postgres",
        "/docker-entrypoint-initdb.d")
    .AddDatabase(db_name);

var weatherService = builder
    .AddProject<Projects.AspireReact_ApiService>("apiservice")
    .WithReference(weatherDatabase);

var ollama = builder
    .AddContainer("ollama", "ollama/ollama")
    .WithHttpEndpoint(port: 11434, targetPort: 11434, name: "ollama-uri")
    ;

var ollamaOpenApiEndpointUri = ollama.GetEndpoint("ollama-uri");
var ollamaService = builder
    .AddPythonProject("ollamaservice", "../aspiring-ollama-service", "main.py")
    .WithHttpEndpoint(env: "PORT", port: 8000) // sticky port setting for Dockerfile deploy 
    .WithEnvironment("ollama-uri", ollamaOpenApiEndpointUri)
    ;

builder.AddNpmApp("react", "../aspiring-react")
    .WithExternalHttpEndpoints()
    .WithReference(cache)
    .WithReference(weatherService)
    .WithReference(ollamaService)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "PORT", port: 4173, targetPort: 5173) // sticky port setting for Dockerfile deploy
    .PublishAsDockerFile()
    ;

builder.Build().Run();
