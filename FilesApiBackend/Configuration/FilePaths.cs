namespace FilesApiBackend.Configuration
{
    public static class FilePaths
    {
        public const string FILES_ROOT_DIR = "__files__/";
        
        public static readonly string DOCS_DIR = System.IO.Path.Combine(FILES_ROOT_DIR, "docs");
        public static readonly string TRASH_DIR = System.IO.Path.Combine(FILES_ROOT_DIR, "trash");
    }
}