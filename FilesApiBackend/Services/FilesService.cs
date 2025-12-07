using FilesApiBackend.Configuration;
using FilesApiBackend.Models;

namespace FilesApiBackend.Services
{
    public interface IFilesService
    {
        Task SaveMarkdownFileAsync(SaveFileRequest request);
        Task<MarkdownFileContent> LoadMarkdownFileAsync(string relativePath);
        Task<FileNode> GetFileTreeAsync(string relativePath = "");
        Task AddNodeAsync(string parentPath, string name, string type);
        Task DeleteNodeAsync(string fullPath, string type);
        Task RenameNodeAsync(string fullPath, string newName);
    }

    public class FilesService(IMarkdownService markdownService) : IFilesService
    {
        private readonly IMarkdownService _markdownService = markdownService;

        public async Task SaveMarkdownFileAsync(SaveFileRequest request)
        {
            if (!FileHelpers.IsMarkdownFile(request.Filename))
            {
                throw new ArgumentException("Invalid file. Only Markdown files in docs/ allowed.");
            }
            
            var canonicalFullPath = FileHelpers.GetCanonicalPath(request.Filename);
            var parentDir = Path.GetDirectoryName(canonicalFullPath);

            if (parentDir != null)
            {
                Directory.CreateDirectory(parentDir); 
            }

            var fileWithFrontmatter = _markdownService.StringifyContentWithMetadata(
                request.Content, 
                request.Metadata
            );

            await File.WriteAllTextAsync(canonicalFullPath, fileWithFrontmatter);
        }

        public async Task<MarkdownFileContent> LoadMarkdownFileAsync(string relativePath)
        {
            var canonicalFullPath = FileHelpers.GetCanonicalPath(relativePath); 

            if (!FileHelpers.IsMarkdownFile(Path.GetFileName(relativePath)))
            {
                throw new ArgumentException("Invalid file. Only Markdown files are allowed.");
            }
            
            if (!File.Exists(canonicalFullPath))
            {
                throw new FileNotFoundException($"File not found at path: {relativePath}");
            }
            
            var fileContent = await File.ReadAllTextAsync(canonicalFullPath);
            var parseResult = _markdownService.ExtractContentAndMetadata(fileContent, relativePath); 

            return new MarkdownFileContent
            {
                FileName = relativePath,
                Content = parseResult.Content,
                Metadata = parseResult.Metadata
            };
        }
        

        public Task<FileNode> GetFileTreeAsync(string relativePath = "")
        {
            var canonicalStartPath = FileHelpers.GetCanonicalPath(relativePath); 
            var rootNode = GetFileTreeRecursive(canonicalStartPath);
            
            return Task.FromResult(rootNode);
        }

        private FileNode GetFileTreeRecursive(string fullPath)
        {
            var attributes = File.GetAttributes(fullPath);
            var isDirectory = attributes.HasFlag(FileAttributes.Directory);
            var name = Path.GetFileName(fullPath);

            var node = new FileNode
            {
                Name = name,
                Type = isDirectory ? NodeTypes.Folder : NodeTypes.File,
            };

            if (isDirectory)
            {
                var children = Directory.EnumerateFileSystemEntries(fullPath)
                    .Select(childPath => GetFileTreeRecursive(childPath))
                    .OrderByDescending(n => n.Type == NodeTypes.Folder)
                    .ThenBy(n => n.Name)
                    .ToList();
                
                node.Children = children;
            }
            else if (FileHelpers.IsMarkdownFile(name))
            {
                // This call uses IMarkdownService which is fine
                node.Metadata = _markdownService.ExtractMetadata(fullPath); 
            }

            return node;
        }

        public Task AddNodeAsync(string parentPath, string name, string type)
        {
            // Use FileHelpers.SetFileNameAsMarkdown and FileHelpers.GetCanonicalPath
            string markdownFormattedName = FileHelpers.SetFileNameAsMarkdown(name);
            var fullPath = FileHelpers.GetCanonicalPath(Path.Combine(parentPath, markdownFormattedName));

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
            var canonicalPath = FileHelpers.GetCanonicalPath(fullPath);
            var trashPath = Path.Combine(FilePaths.TRASH_DIR, Path.GetFileName(canonicalPath) + "_" + DateTime.Now.Ticks);
            // ... (rest of delete logic remains)
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
            var oldPath = FileHelpers.GetCanonicalPath(fullPath);
            // ... (rest of rename logic remains)
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

        public static class FileHelpers
        {
            internal static string GetCanonicalPath(string relativePath)
            {
                var docsDirName = Path.GetFileName(FilePaths.DOCS_DIR.TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar));
                var prefix = docsDirName + Path.DirectorySeparatorChar;

                if (relativePath.StartsWith(prefix, StringComparison.OrdinalIgnoreCase) || 
                    relativePath.StartsWith(docsDirName + Path.AltDirectorySeparatorChar, StringComparison.OrdinalIgnoreCase))
                {
                    relativePath = relativePath.Substring(prefix.Length);
                }
                
                var fullPath = Path.Combine(FilePaths.DOCS_DIR, relativePath);
                
                var canonicalFullPath = Path.GetFullPath(fullPath);
                var canonicalDocsPath = Path.GetFullPath(FilePaths.DOCS_DIR);

                if (!canonicalFullPath.StartsWith(canonicalDocsPath, StringComparison.OrdinalIgnoreCase))
                {
                    throw new UnauthorizedAccessException("Attempted access outside of the defined documentation directory.");
                }
                
                return canonicalFullPath;
            }

            internal static bool IsMarkdownFile(string filename)
            {
                return filename.EndsWith(".md", StringComparison.OrdinalIgnoreCase);
            }
            
            internal static string SetFileNameAsMarkdown(string name)
            {
                var illegalChars = Path.GetInvalidFileNameChars().Union(['/', '\\']);
                
                if (name.Any(c => illegalChars.Contains(c)))
                {
                    throw new ArgumentException("File name contains illegal characters.");
                }

                return name.EndsWith(".md", StringComparison.OrdinalIgnoreCase) ? name : name + ".md";
            }
            
            internal static void InitializeFileDirectories()
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
        }
    }
}