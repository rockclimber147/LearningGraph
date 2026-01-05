namespace FilesApiBackend.Models
{
    public class User : UserMinimalInfo
    {
        public string? Password { get; set; }
    }

    public class UserMinimalInfo
    {
        public string? UserName { get; set; }
    }
}