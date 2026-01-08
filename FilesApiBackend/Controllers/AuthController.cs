using FilesApiBackend.Filters;
using FilesApiBackend.Models;
using FilesApiBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace FilesApiBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService, AuthContextAccessor authAccessor): ApiBaseController
    {
        private readonly IAuthService _authService = authService;
    
        [HttpPost("login")]
        public async Task<ActionResult<UserMinimalInfo>> Login([FromBody] UserLoginInfo user)
        {
            AccessRefreshPair tokens = await _authService.Login(user);

            var accessOptions = new CookieOptions
            {
                HttpOnly = true,
                // Secure = true, TODO https prod, http dev config
                SameSite = SameSiteMode.Lax,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddMinutes(15)
            };

            var refreshOptions = new CookieOptions
            {
                HttpOnly = true,
                // Secure = true,
                SameSite = SameSiteMode.Lax,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("accessToken", tokens.AccessToken!, accessOptions);
            Response.Cookies.Append("refreshToken", tokens.RefreshToken!, refreshOptions);

            return Ok(new UserMinimalInfo{ UserName = user.UserName });
        }

        [HttpGet("me")]
        [SessionAuthorize]
        public IActionResult GetCurrentUser()
        {
            var user = authAccessor.CurrentUser;

            if (user == null)
            {
                return Unauthorized();
            }
            return Ok(new UserMinimalInfo 
            { 
                UserName = user.UserName 
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            {
                return BadRequest("Refresh token is missing.");
            }

            try
            { 
                AccessRefreshPair tokens = await _authService.RefreshSession(refreshToken);

                var accessOptions = new CookieOptions
                {
                    HttpOnly = true,
                    // Secure = true, TODO https prod, http dev config
                    SameSite = SameSiteMode.Lax,
                    Path = "/",
                    Expires = DateTimeOffset.UtcNow.AddMinutes(15)
                };

                var refreshOptions = new CookieOptions
                {
                    HttpOnly = true,
                    // Secure = true,
                    SameSite = SameSiteMode.Lax,
                    Path = "/",
                    Expires = DateTimeOffset.UtcNow.AddDays(7)
                };

                Response.Cookies.Append("accessToken", tokens.AccessToken!, accessOptions);
                Response.Cookies.Append("refreshToken", tokens.RefreshToken!, refreshOptions);

                return Ok();
            }
            catch
            {
                Response.Cookies.Delete("accessToken");
                Response.Cookies.Delete("refreshToken");
                return Unauthorized("Session expired. Please log in again.");
            }
        }
    }
}

