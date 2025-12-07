using Markdig;
using Markdig.Extensions.Yaml;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;

using FilesApiBackend.Models;
using Markdig.Syntax;
using System.Reflection;


namespace FilesApiBackend.Services
{
    public interface IMarkdownService
    {
        public MarkdownMetaData? ExtractMetadata(string filePath);
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
    }
}
