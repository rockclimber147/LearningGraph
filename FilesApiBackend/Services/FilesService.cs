using FilesApiBackend.Configuration;
using FilesApiBackend.Models;
namespace FilesApiBackend.Services
{
    public interface IFilesService
    {
        Task<string> ReadFileContentAsync(string relativePath);
        Task AddNodeAsync(string parentPath, string name, string type);
        Task DeleteNodeAsync(string fullPath, string type);
        Task RenameNodeAsync(string fullPath, string newName);
    }

    public class FilesService: IFilesService
    {
        public FilesService()
        {
            InitializeFileDirectories();
        }

        private static void InitializeFileDirectories()
        {
            CreateDirIfNotExists(FilePaths.FILES_ROOT_DIR);
            CreateDirIfNotExists(FilePaths.DOCS_DIR);
            CreateDirIfNotExists(FilePaths.TRASH_DIR);
        }

        private static void CreateDirIfNotExists(string dirPath)
        {
            if (!Directory.Exists(dirPath))
            {
                Directory.CreateDirectory(dirPath);
            }
        }
    
        public async Task<string> ReadFileContentAsync(string relativePath)
        {
            var fullPath = Path.Combine(FilePaths.DOCS_DIR, relativePath);
            var canonicalFullPath = GetCanonicalPath(relativePath);

            if (!File.Exists(canonicalFullPath))
            {
                throw new FileNotFoundException($"File not found at path: {relativePath}");
            }

            return await File.ReadAllTextAsync(canonicalFullPath);
        }
    
        private static string GetCanonicalPath(string relativePath)
        {
            var fullPath = Path.Combine(FilePaths.DOCS_DIR, relativePath);
            var canonicalFullPath = Path.GetFullPath(fullPath);
            var canonicalDocsPath = Path.GetFullPath(FilePaths.DOCS_DIR);

            if (!canonicalFullPath.StartsWith(canonicalDocsPath))
            {
                throw new UnauthorizedAccessException("Attempted access outside of the defined documentation directory.");
            }
            return canonicalFullPath;
        }

        public Task AddNodeAsync(string parentPath, string name, string type)
        {
            var fullPath = GetCanonicalPath(Path.Combine(parentPath, name));

            if (type.Equals(NodeTypes.Folder, StringComparison.OrdinalIgnoreCase))
            {
                if (Directory.Exists(fullPath)) throw new InvalidOperationException("Folder already exists.");
                Directory.CreateDirectory(fullPath);
            }
            else if (type.Equals(NodeTypes.File, StringComparison.OrdinalIgnoreCase))
            {
                if (File.Exists(fullPath)) throw new InvalidOperationException("File already exists.");
                return File.WriteAllTextAsync(fullPath, string.Empty);
            }
            else
            {
                throw new ArgumentException("Invalid node type specified.");
            }
            return Task.CompletedTask;
        }

        public Task DeleteNodeAsync(string fullPath, string type)
        {
            var canonicalPath = GetCanonicalPath(fullPath);
            var trashPath = Path.Combine(FilePaths.TRASH_DIR, Path.GetFileName(canonicalPath) + "_" + DateTime.Now.Ticks);

            if (type.Equals(NodeTypes.File, StringComparison.OrdinalIgnoreCase))
            {
                if (!File.Exists(canonicalPath)) throw new FileNotFoundException($"File not found at: {fullPath}");
                File.Move(canonicalPath, trashPath);
            }
            else if (type.Equals(NodeTypes.Folder, StringComparison.OrdinalIgnoreCase))
            {
                if (!Directory.Exists(canonicalPath)) throw new DirectoryNotFoundException($"Folder not found at: {fullPath}");
                Directory.Move(canonicalPath, trashPath);
            }
            else
            {
                throw new ArgumentException("Invalid node type specified.");
            }
            return Task.CompletedTask;
        }

        public Task RenameNodeAsync(string fullPath, string newName)
        {
            var oldPath = GetCanonicalPath(fullPath);
            var parentDir = Path.GetDirectoryName(oldPath);
            
            if (string.IsNullOrEmpty(parentDir)) throw new InvalidOperationException("Cannot rename the root directory.");

            var newPath = Path.Combine(parentDir, newName);

            if (File.Exists(oldPath))
            {
                File.Move(oldPath, newPath);
            }
            else if (Directory.Exists(oldPath))
            {
                Directory.Move(oldPath, newPath);
            }
            else
            {
                throw new FileNotFoundException($"Entry not found at: {fullPath}");
            }
            return Task.CompletedTask;
        }
    }
}