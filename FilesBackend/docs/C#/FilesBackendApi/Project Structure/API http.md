---
title: Untitled Topic
tags: []
prerequisites: []
related: []
---
# API.http

**Role:** This is a simple text file used by VS Code's **REST Client extension** (and some other tools) to send pre-formatted **HTTP requests** to your running API.

**What it does:** It's a quick, convenient way to test your API endpoints (like your CRUD operations for files/folders) without needing a full-featured tool like Postman. For example, it might contain:

```
GET http://localhost:5000/api/files/readme.md
Accept: application/json
```
