using FilesApiBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace FilesApiBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController(IFilesService filesService) : ControllerBase
    {
        private readonly IFilesService _filesService = filesService;

        [HttpGet("{**path}")]
        public async Task<ActionResult<string>> GetFileContent(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
            {
                return BadRequest("File path must be provided.");
            }
            string content = await _filesService.ReadFileContentAsync(path);
            return Ok(content);
        }
    }
}