using Markdig;
using Markdig.Extensions.Yaml;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;
using FilesApiBackend.Models;
using Markdig.Syntax;
using Markdig.Renderers.Normalize;



namespace FilesApiBackend.Services
{
    public interface IMarkdownService
    {
        public MarkdownMetaData? ExtractMetadata(string filePath);
        public MarkdownParseResult ExtractContentAndMetadata(string fileContent, string defaultTitle);
        public string StringifyContentWithMetadata(string content, MarkdownMetaData metadata);
    }
    public class MarkdownService : IMarkdownService
    {
        private readonly ISerializer _serializer;
        private readonly IDeserializer _deserializer;
        private readonly MarkdownPipeline _pipeline;

        public MarkdownService()
        {
            _serializer = new SerializerBuilder()
                .WithNamingConvention(CamelCaseNamingConvention.Instance)
                .Build();

            _deserializer = new DeserializerBuilder()
                .WithNamingConvention(CamelCaseNamingConvention.Instance)
                .Build();

            _pipeline = new MarkdownPipelineBuilder()
                .UseYamlFrontMatter()
                .Build();
        }

        public MarkdownMetaData? ExtractMetadata(string filePath)
        {
            string fileContent;
            try
            {
                fileContent = File.ReadAllText(filePath);
            }
            catch (FileNotFoundException)
            {
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading file {filePath}: {ex.Message}");
                return null; 
            }

            string defaultTitle = Path.GetFileNameWithoutExtension(filePath);

            var document = Markdown.Parse(fileContent, _pipeline);
            var yamlBlock = document.Descendants<YamlFrontMatterBlock>().FirstOrDefault();

            if (yamlBlock == null)
            {
                return new MarkdownMetaData { Title = defaultTitle };
            }
            var yaml = yamlBlock.Lines.ToString();

            try
            {
                var data = _deserializer.Deserialize<MarkdownMetaData>(yaml);
                data.Title ??= defaultTitle; 
                data.Tags ??= [];
                data.Prerequisites ??= [];
                data.Related ??= [];

                return data;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deserializing YAML: {ex.Message}");
                return new MarkdownMetaData { Title = defaultTitle };
            }
        }
    
        public MarkdownParseResult ExtractContentAndMetadata(string fileContent, string defaultTitle)
        {
            var document = Markdown.Parse(fileContent, _pipeline);
            var yamlBlock = document.Descendants<YamlFrontMatterBlock>().FirstOrDefault();
            
            var metadata = new MarkdownMetaData { Title = defaultTitle };

            if (yamlBlock != null)
            {
                var yaml = yamlBlock.Lines.ToString();

                try
                {
                    var data = _deserializer.Deserialize<MarkdownMetaData>(yaml);
                    data.Title ??= defaultTitle; 
                    data.Tags ??= [];
                    data.Prerequisites ??= [];
                    data.Related ??= [];
                    
                    metadata = data;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error deserializing YAML: {ex.Message}");
                }
            }
            
            string markdownBody = string.Empty;
            
            using (var writer = new StringWriter())
            {
                var renderer = new NormalizeRenderer(writer);
                
                foreach (var block in document.Where(b => b != yamlBlock))
                {
                    renderer.Render(block);
                }
                markdownBody = writer.ToString().Trim();
            }
            
            return new MarkdownParseResult
            {
                Content = markdownBody,
                Metadata = metadata
            };
        }
    
        public string StringifyContentWithMetadata(string content, MarkdownMetaData metadata)
        {
            // 1. Serialize the C# DTO to a YAML string
            var yamlString = _serializer.Serialize(metadata);

            // 2. Combine with delimiters and content (JavaScript equivalent of matter.stringify)
            var fileWithFrontmatter = $"---\n{yamlString}---\n\n{content.TrimStart()}";

            return fileWithFrontmatter;
        }
    }
}
