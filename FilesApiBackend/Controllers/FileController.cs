using FilesApiBackend.Services;
using Microsoft.AspNetCore.Mvc;

namespace FilesApiBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController(IFilesService filesService) : ControllerBase
    {
        private readonly IFilesService _filesService = filesService;
    }
}