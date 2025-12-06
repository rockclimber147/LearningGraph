using FilesApiBackend.Configuration;
namespace FilesApiBackend.Services
{
    public interface IFilesService
    {
        Task<string> ReadFileContentAsync(string relativePath);
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
            var canonicalFullPath = Path.GetFullPath(fullPath);
            var canonicalDocsPath = Path.GetFullPath(FilePaths.DOCS_DIR);

            if (!canonicalFullPath.StartsWith(canonicalDocsPath))
            {
                throw new UnauthorizedAccessException("Attempted access outside of the defined documentation directory.");
            }

            if (!File.Exists(canonicalFullPath))
            {
                throw new FileNotFoundException($"File not found at path: {relativePath}");
            }

            return await File.ReadAllTextAsync(canonicalFullPath);
        }
    }
}