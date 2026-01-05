using System.Text.Json;

using FilesApiBackend.Models;

namespace FilesApiBackend.Repositories;
public interface IUserRepository
{
    Task<User?> GetUserByUsernameAsync(string username);
}

public class JsonUserRepository : IUserRepository
{
    private readonly string _filePath = "users.json";

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        if (!File.Exists(_filePath)) return null;

        var json = await File.ReadAllTextAsync(_filePath);
        
        var users = JsonSerializer.Deserialize<List<User>>(json, new JsonSerializerOptions 
        { 
            PropertyNameCaseInsensitive = true 
        });

        return users?.FirstOrDefault(u => 
            u.UserName?.Equals(username, StringComparison.OrdinalIgnoreCase) ?? false);
    }
}