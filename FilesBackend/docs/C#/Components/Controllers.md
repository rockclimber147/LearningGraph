---
title: Untitled Topic
tags: []
prerequisites: []
related: []
---
# Controllers

|                                  |                                                                                                                                                       |                                                   |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Feature/Component**            | **Purpose**                                                                                                                                           | **Example**                                       |
| `Controllers/FilesController.cs` | The file where the controller class resides.                                                                                                          | `public class FilesController : ControllerBase`   |
| `: ControllerBase`               | The **base class** that all API controllers inherit from. It provides access to methods like `Ok()`, `NotFound()`, and `BadRequest()`.                | `public class FilesController : ControllerBase`   |
| **Constructor**                  | Used for **dependency injection (DI)**. This is where the controller receives services like logging, databases, or configuration.                     | `public FilesController(ILogger<T> logger)`       |
| **Action Method**                | A public method within the controller that handles a specific HTTP request.                                                                           | `public ActionResult<string> GetFileContent()`    |
| `ActionResult<T>`                | The **return type** for an action method. It allows the method to return either a specific data type (`T`) or an action result (like a 404 response). | `public ActionResult<string> GetFileContent(...)` |

|                   |                                                                                                                                            |                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| **Attribute**     | **Purpose**                                                                                                                                | **Example Route**                                     |
| `[ApiController]` | Enables special API behaviors like automatic model validation and automatic source binding for action parameters. **Must be present.**     | N/A (Configuration)                                   |
| `[Route("...")]`  | Defines the **base URL path** for all actions in this controller. The `[controller]` token is replaced by the controller's name (`files`). | `[Route("api/[controller]")]` results in `/api/files` |
| `[Authorize]`     | Specifies that all actions in this controller require an authenticated user. (Used when adding login later).                               | `[Authorize]`                                         |

|                |                 |                                                                         |                                                    |
| -------------- | --------------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| **Attribute**  | **HTTP Method** | **Route Configuration**                                                 | **Example Route**                                  |
| `[HttpGet]`    | **READ**        | Maps to an HTTP `GET` request. Used to retrieve data.                   | `[HttpGet]` results in `/api/files`                |
| `[HttpPost]`   | **CREATE**      | Maps to an HTTP `POST` request. Used to create new resources.           | `[HttpPost]` results in `/api/files`               |
| `[HttpPut]`    | **UPDATE**      | Maps to an HTTP `PUT` request. Used to fully replace/update a resource. | `[HttpPut("{id}")]` results in `/api/files/123`    |
| `[HttpDelete]` | **DELETE**      | Maps to an HTTP `DELETE` request. Used to remove a resource.            | `[HttpDelete("{id}")]` results in `/api/files/123` |
| `[HttpPatch]`  | **UPDATE**      | Maps to an HTTP `PATCH` request. Used to partially update a resource.   | `[HttpPatch("{id}")]`                              |
