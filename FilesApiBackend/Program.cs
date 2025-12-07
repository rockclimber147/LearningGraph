using FilesApiBackend.Services;
using FilesApiBackend.Filters;

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
                                        .Get<string[]>() ?? Array.Empty<string>();

            policy.WithOrigins(allowedOrigins) 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
builder.Services.AddControllers(options =>
{
    options.Filters.Add(new GlobalExceptionFilter());
}); 
builder.Services.AddScoped<IFilesService, FilesService>();

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
        var fileService = services.GetRequiredService<IFilesService>();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "FATAL ERROR: Failed to initialize file directories.");
    }
}