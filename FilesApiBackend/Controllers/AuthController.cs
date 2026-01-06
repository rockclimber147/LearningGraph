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
        public async Task<ActionResult<AccessRefreshPair>> Login([FromBody] UserFullInfo user)
        {
            AccessRefreshPair tokens = await _authService.Login(user);
            return Ok(tokens);
        }
    }
}

