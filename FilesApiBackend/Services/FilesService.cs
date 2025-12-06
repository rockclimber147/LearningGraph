using FilesApiBackend.Configuration;
namespace FilesApiBackend.Services
{
    public interface IFilesService
    {
        
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
            if (!System.IO.Directory.Exists(dirPath))
            {
                System.IO.Directory.CreateDirectory(dirPath);
            }
        }
    }
}