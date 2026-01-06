using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

using FilesApiBackend.Models;
using FilesApiBackend.Repositories;
using FilesApiBackend.Configuration;
using Microsoft.Extensions.Options;



namespace FilesApiBackend.Services;

public interface IAuthService
{
    Task<AccessRefreshPair> Login(UserFullInfo userInfo);
}

public class AuthService(IUserRepository userRepository, IOptions<JwtOptions> jwtOptions) : IAuthService
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;

    public async Task<AccessRefreshPair> Login(UserFullInfo userInfo)
    {
        if (userInfo.UserName == null || userInfo.Password == null)
        {
            throw new Exception("Both username and password required to log in!");
        }

        var user = await _userRepository.GetUserByUsernameAsync(userInfo.UserName!) ?? throw new Exception("User not found");
        bool isValid = BCrypt.Net.BCrypt.Verify(userInfo.Password, user.Password);
        if (!isValid) throw new Exception("Invalid credentials");

        string accessToken = GenerateAccessToken(user);
        string refreshToken = GenerateRefreshToken();

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _userRepository.UpdateUserAsync(user);

        return new AccessRefreshPair
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    private string GenerateAccessToken(UserFullInfo user)
    {
        var claims = new[] {
            new Claim(ClaimTypes.Name, user.UserName!),
            new Claim(ClaimTypes.Role, "User")
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtOptions.Issuer,
            audience: _jwtOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }
}