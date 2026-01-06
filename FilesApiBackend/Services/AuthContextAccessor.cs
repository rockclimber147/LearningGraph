namespace FilesApiBackend.Services;
using FilesApiBackend.Models;

public class AuthContextAccessor(IHttpContextAccessor httpContextAccessor)
{
    public UserFullInfo? CurrentUser { get; set; }

    private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

    public string? GetAccessToken()
    {
        return _httpContextAccessor.HttpContext?.Request.Cookies["accessToken"];
    }
}