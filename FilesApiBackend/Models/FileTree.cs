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

}