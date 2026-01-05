using System.Text.Json;

using FilesApiBackend.Models;

namespace FilesApiBackend.Repositories;
public interface IUserRepository
{
    Task<User?> GetUserByUsernameAsync(string username);
}

public class JsonUserRepository : IUserRepository
{
    private readonly string _filePath = "json_db/users.json";
    private readonly JsonSerializerOptions _options = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<User?> GetUserByUsernameAsync(string username)
    {
        if (!File.Exists(_filePath)) return null;

        var json = await File.ReadAllTextAsync(_filePath);

        var users = JsonSerializer.Deserialize<List<User>>(json, _options);

        return users?.FirstOrDefault(u => 
            u.UserName?.Equals(username, StringComparison.OrdinalIgnoreCase) ?? false);
    }
}