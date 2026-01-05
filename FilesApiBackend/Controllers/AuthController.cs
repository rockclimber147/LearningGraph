using FilesApiBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace FilesApiBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController
    {
        [HttpPost("login")]
        public async Task<ActionResult<UserMinimalInfo>> Login([FromBody] User user)
        {
            return Ok();
        }
    }
}

