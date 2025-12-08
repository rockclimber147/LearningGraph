---
title: Untitled Topic
tags: []
prerequisites: []
related: []
---
# Project Definition File

An XML file that is the manifest and configuration file for the C# project.

**Target Framework:** Defines which version of .NET your project runs on (e.g., `net8.0`).

**Project Type:** Identifies the project as a Web API, a library, or a console application.

**Package References:** Lists all the **NuGet packages** (dependencies like **Markdig**) your project uses. When you run `dotnet restore`, it reads this file to download all necessary libraries.
