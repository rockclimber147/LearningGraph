using Microsoft.AspNetCore.Mvc;

using FilesApiBackend.Services;
using FilesApiBackend.Models;

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

        /// <summary>
        /// Creates a new file or folder.
        /// Client: POST /api/files/add with JSON body
        /// </summary>
        [HttpPost("add")]
        public async Task<IActionResult> AddNode([FromBody] AddNodeRequest request)
        {
            await _filesService.AddNodeAsync(request.ParentPath, request.Name, request.Type);
            return Ok();
        }

        /// <summary>
        /// Deletes (moves to trash) a file or folder.
        /// Client: POST /api/files/delete with JSON body
        /// </summary>
        [HttpPost("delete")]
        public async Task<IActionResult> DeleteNode([FromBody] DeleteNodeRequest request)
        {
            await _filesService.DeleteNodeAsync(request.Path, request.Type);
            return Ok();
        }

        /// <summary>
        /// Renames a file or folder.
        /// Client: POST /api/files/rename with JSON body
        /// </summary>
        [HttpPost("rename")]
        public async Task<IActionResult> RenameNode([FromBody] RenameNodeRequest request)
        {
            await _filesService.RenameNodeAsync(request.Path, request.NewName);
            return Ok();
        }

        [HttpGet("tree")]
        public async Task<ActionResult<FileNode>> GetTree()
        {
            FileNode tree = await _filesService.GetFileTreeAsync();
            return Ok(tree);
        }

        [HttpGet("load")]
        public async Task<ActionResult<MarkdownFileContent>> LoadFile([FromQuery] string filename)
        {
            if (string.IsNullOrEmpty(filename))
            {
                return BadRequest(new { error = "Missing filename" });
            }

            var fileData = await _filesService.LoadMarkdownFileAsync(filename);
            return Ok(fileData);
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveFile([FromBody] SaveFileRequest request)
        {

            if (request == null)
            {
                return BadRequest(new { error = "Invalid request body." });
            }

            try
            {
                await _filesService.SaveMarkdownFileAsync(request);
            
                return Ok(new { message = "File saved successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving file: {ex.Message}");
                return StatusCode(500, new { error = "Failed to save file due to a server error." });
            }
        }
    }
}