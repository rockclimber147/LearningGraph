using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace FilesApiBackend.Filters
{
    public class GlobalExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            HttpStatusCode statusCode = HttpStatusCode.InternalServerError;

            if (context.Exception is FileNotFoundException)
            {
                statusCode = HttpStatusCode.NotFound;
            }
            else if (context.Exception is UnauthorizedAccessException)
            {
                statusCode = HttpStatusCode.Forbidden;
            }

            context.HttpContext.Response.StatusCode = (int)statusCode;
            
            context.Result = new ObjectResult(new ProblemDetails
            {
                Status = (int)statusCode,
                Title = statusCode.ToString(),
                Detail = context.Exception.Message,
                Instance = context.HttpContext.Request.Path
            });

            context.ExceptionHandled = true;
        }
    }
}