using System.Text.Json;

using FilesApiBackend.Models;

namespace FilesApiBackend.Repositories;
public interface IUserRepository
{
    Task<UserFullInfo?> GetUserByUsernameAsync(string username);
    Task<UserFullInfo?> GetUserByRefreshTokenAsync(string token);
    Task<UserFullInfo> UpdateUserAsync(UserFullInfo userInfo);
}

public class JsonUserRepository : IUserRepository
{
    private readonly string _filePath = "json_db/users.json";
    private readonly JsonSerializerOptions _options = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<UserFullInfo?> GetUserByUsernameAsync(string username)
    {
        if (!File.Exists(_filePath)) return null;
        var json = await File.ReadAllTextAsync(_filePath);
        var users = await ReadAllUsers();

        return users?.FirstOrDefault(u => 
            u.UserName?.Equals(username, StringComparison.OrdinalIgnoreCase) ?? false);
    }

    public async Task<UserFullInfo?> GetUserByRefreshTokenAsync(string token)
    {
        var users = await ReadAllUsers();
        return users.FirstOrDefault(u => u.RefreshToken == token);
    }

    public async Task<UserFullInfo> UpdateUserAsync(UserFullInfo userInfo)
    {
        var users = (await ReadAllUsers()).ToList();
        var index = users.FindIndex(u => 
            u.UserName?.Equals(userInfo.UserName, StringComparison.OrdinalIgnoreCase) ?? false);

        if (index != -1)
        {
            users[index] = userInfo;
        }
        var json = JsonSerializer.Serialize(users, _options);
        await File.WriteAllTextAsync(_filePath, json);

        return userInfo;
    }

    private async Task<IEnumerable<UserFullInfo>> ReadAllUsers()
    {
        if (!File.Exists(_filePath)) return [];
        var json = await File.ReadAllTextAsync(_filePath);
        var users = JsonSerializer.Deserialize<List<UserFullInfo>>(json, _options);
        return users ?? [];
    }
}