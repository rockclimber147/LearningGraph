using FilesApiBackend.Models;
using FilesApiBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace FilesApiBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService): ControllerBase
    {
        private readonly IAuthService _authService = authService;
    
        [HttpPost("login")]
        public async Task<ActionResult<UserMinimalInfo>> Login([FromBody] User user)
        {
            UserMinimalInfo userMinimalInfo = await _authService.Login(user);
            return Ok(userMinimalInfo);
        }
    }
}

