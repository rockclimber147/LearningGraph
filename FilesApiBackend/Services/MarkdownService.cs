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
    }
    public class MarkdownService : IMarkdownService
    {
        private readonly IDeserializer _deserializer;
        private readonly MarkdownPipeline _pipeline;

        public MarkdownService()
        {
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
    }
}
