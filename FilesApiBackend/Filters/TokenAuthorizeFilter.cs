using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using FilesApiBackend.Services;

namespace FilesApiBackend.Filters;

public class SessionAuthorizeAttribute : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var authAccessor = context.HttpContext.RequestServices.GetRequiredService<AuthContextAccessor>();
        var authService = context.HttpContext.RequestServices.GetRequiredService<IAuthService>();

        var token = authAccessor.GetAccessToken();
        
        if (string.IsNullOrEmpty(token))
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var user = await authService.ValidateTokenAsync(token);
        
        if (user == null)
        {
            context.Result = new UnauthorizedObjectResult("Session expired or invalid.");
            return;
        }

        authAccessor.CurrentUser = user;

        await next();
    }
}