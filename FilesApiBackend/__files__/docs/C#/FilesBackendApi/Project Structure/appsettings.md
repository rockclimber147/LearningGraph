---
title: Untitled Topic
tags: []
prerequisites: []
related: []
---
# appsettings.json

**Role:** This is the primary file for **application configuration settings**.

**What it does:** It stores settings that control the behavior of your application and its services across all environments (production, staging, development, etc.). Examples include:

* **Logging Levels**

* **Connection Strings** (to a database, but *not* secrets)

* **Custom Settings** (e.g., the root path to your `docs/` folder).

# appsettings.development.json

**Role:** This file contains **environment-specific overrides** for the `appsettings.json` file.

**What it does:** When your application runs in the `Development` environment (which is the default when running locally with `dotnet run`), any settings in this file will **override** the corresponding settings in `appsettings.json`.

* **Example:** You might set a detailed logging level here for debugging, while `appsettings.json` specifies a less verbose level for production.

* **Security Note:** This file often includes detailed error messages that you *don't* want exposed in a production environment.
