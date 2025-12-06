using FilesApiBackend.Services; // 1. Add using statement for IFilesService and FilesService
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApi();
builder.Services.AddControllers(); 
builder.Services.AddScoped<IFilesService, FilesService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}
app.UseHttpsRedirection();

InitializeFileDirectories(app);

app.MapControllers();
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