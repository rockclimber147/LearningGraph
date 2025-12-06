---
title: Untitled Topic
tags: []
prerequisites: []
related: []
---
# Open API Swagger conflict

### The Error Chain

1. **Conflicting Dependencies:** The `Microsoft.AspNetCore.OpenApi` package brought in one version of the underlying `Microsoft.OpenApi` assembly (e.g., v2.3.0.0, as seen in your error message).

2. **Overwriting/Mismatch:** When you added the **Swashbuckle** packages, they brought in a **newer** or different version of those same core `Microsoft.OpenApi` components.

3. **Runtime Crash:** When you navigated to `/swagger`, Swashbuckle tried to examine your controllers using the newer assemblies, but the framework's internal references were likely pointing to the older, incompatible assembly files that were still cached or conflicting.

4. **Result:** The runtime couldn't find the expected classes or methods (`IOpenApiAny`, `OpenApiSchema`, etc.), resulting in the fatal `System.Reflection.ReflectionTypeLoadException`.

## The Solution

The fix was to completely **decouple** the conflicting components:

1. **Removal:** You **removed the&#x20;**`Microsoft.AspNetCore.OpenApi`**&#x20;package reference** from your `.csproj` file.

2. **Consolidation:** This left **Swashbuckle.AspNetCore** as the sole provider for API documentation.

3. **Resolution:** By running `dotnet clean` and `dotnet restore`, you forced the system to rely only on the coherent set of dependencies provided by Swashbuckle, eliminating the assembly mismatch and allowing the Swagger UI to load successfully.
