using FilesApiBackend.Models;
using FilesApiBackend.Repositories;


namespace FilesApiBackend.Services;

public interface IAuthService
{
    Task<UserMinimalInfo> Login(User userInfo);
}

public class AuthService(IUserRepository userRepository) : IAuthService
{
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<UserMinimalInfo> Login(User userInfo)
    {
        if (userInfo.UserName == null || userInfo.Password == null)
        {
            throw new Exception("Both username and password required to log in!");
        }

        var user = await _userRepository.GetUserByUsernameAsync(userInfo.UserName!) ?? throw new Exception("User not found");
        bool isValid = BCrypt.Net.BCrypt.Verify(userInfo.Password, user.Password);
        if (!isValid) throw new Exception("Invalid credentials");
        return new UserMinimalInfo
        {
            UserName = userInfo.UserName
        };
    }
}