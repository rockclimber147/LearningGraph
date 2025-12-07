using Microsoft.AspNetCore.SignalR;

namespace FilesApiBackend.Models
{
    public static class NodeTypes
    {
        public const string File = "file";
        public const string Folder = "folder";
    }
    
    public class AddNodeRequest
    {
        public string ParentPath { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; 
    }

    public class DeleteNodeRequest
    {
        public string Path { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }

    public class RenameNodeRequest
    {
        public string Path { get; set; } = string.Empty;
        public string NewName { get; set; } = string.Empty;
    }

    public class FileNode
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public MarkdownMetaData? Metadata { get; set; } = null;
        public List<FileNode> Children { get; set; } = [];
    }

    public class MarkdownFileContent
    {
        public string FileName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public MarkdownMetaData Metadata { get; set; } = new MarkdownMetaData();
    }

    public class MarkdownMetaData
    {
        public string Title { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = [];
        public List<string> Prerequisites { get; set; } = [];
        public List<string> Related { get; set; } = [];
    }

    public class MarkdownParseResult
    {
        public string Content { get; set; } = string.Empty;
        public MarkdownMetaData Metadata { get; set; } = new MarkdownMetaData();
    }

}