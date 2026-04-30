namespace NeptuneEvo.Players.Models
{
    public class AuntificationData
    {
        public bool IsCreateAccount { get; set; } = false;
        public string Login { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool IsBlockAuth { get; set; } = false;
    }
}