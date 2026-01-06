namespace FilesApiBackend.Models
{
    public class UserFullInfo : UserLoginInfo
    {
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
    }

    public class UserLoginInfo: UserMinimalInfo
    {
        public string? Password { get; set; }
    }

    public class UserMinimalInfo
    {
        public string? UserName { get; set; }
    }
}