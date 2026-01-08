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
    Task<AccessRefreshPair> Login(UserLoginInfo userInfo);
    Task<UserFullInfo?> ValidateTokenAsync(string token);
    Task<AccessRefreshPair> RefreshSession(string refreshToken);
}

public class AuthService(IUserRepository userRepository, IOptions<JwtOptions> jwtOptions) : IAuthService
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly JwtOptions _jwtOptions = jwtOptions.Value;

    public async Task<AccessRefreshPair> Login(UserLoginInfo userInfo)
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

    public async Task<UserFullInfo?> ValidateTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtOptions.Secret);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _jwtOptions.Issuer,
                ValidateAudience = true,
                ValidAudience = _jwtOptions.Audience,
                ClockSkew = TimeSpan.Zero 
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userName = jwtToken.Claims.First(x => x.Type == ClaimTypes.Name).Value;

            return await _userRepository.GetUserByUsernameAsync(userName);
        }
        catch
        {
            return null;
        }
    }

    public async Task<AccessRefreshPair> RefreshSession(string refreshToken)
    {
        var user = await _userRepository.GetUserByRefreshTokenAsync(refreshToken);

        if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
        {
            throw new Exception("Invalid or expired refresh token");
        }

        var newAccessToken = GenerateAccessToken(user); 
        string newRefreshToken = GenerateRefreshToken();

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

        await _userRepository.UpdateUserAsync(user);

        return new AccessRefreshPair 
        { 
            AccessToken = newAccessToken, 
            RefreshToken = newRefreshToken
        };
    }
}