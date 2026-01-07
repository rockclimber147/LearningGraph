using Microsoft.AspNetCore.Mvc;
using FilesApiBackend.Models;

namespace FilesApiBackend.Controllers
{
    public class ApiBaseController : ControllerBase
    {
        [NonAction]
        public OkObjectResult Ok<T>(T content, string message = "Success")
        {
            return base.Ok(ApiResponse<T>.Ok(content, message));
        }

        [NonAction]
        public new OkObjectResult Ok()
        {
            return base.Ok(ApiResponse.Ok());
        }

        [NonAction]
        public OkObjectResult Success(string message)
        {
            return base.Ok(ApiResponse.Ok(message));
        }

        [NonAction]
        public BadRequestObjectResult BadRequest(string message)
        {
            return base.BadRequest(ApiResponse.Fail(message));
        }
    }
}