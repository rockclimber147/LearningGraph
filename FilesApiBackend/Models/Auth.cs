namespace FilesApiBackend.Models;

public class AccessRefreshPair
{
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
}