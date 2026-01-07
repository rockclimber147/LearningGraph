using FilesApiBackend.Services;
using FilesApiBackend.Filters;
using FilesApiBackend.Repositories;
using FilesApiBackend.Configuration;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            var allowedOrigins = builder.Configuration
                                        .GetSection("CorsSettings:AllowedOrigins")
                                        .Get<string[]>() ?? [];

            policy.WithOrigins(allowedOrigins) 
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName));

builder.Services.AddControllers(options =>
{
    options.Filters.Add(new GlobalExceptionFilter());
}); 
builder.Services.AddScoped<IUserRepository, JsonUserRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IFilesService, FilesService>();
builder.Services.AddScoped<IMarkdownService, MarkdownService>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<AuthContextAccessor>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

builder.Services.AddLogging();

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();
InitializeFileDirectories(app);

app.Run();


static void InitializeFileDirectories(WebApplication webApp)
{
    using var scope = webApp.Services.CreateScope();
    var services = scope.ServiceProvider;

    try
    {
        FilesService.FileHelpers.InitializeFileDirectories();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "FATAL ERROR: Failed to initialize file directories.");
    }
}