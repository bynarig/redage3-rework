using System;
using NeptuneEvo.Handles;

namespace NeptuneEvo.Accounts.Email.Models
{
    public class EmailVerification
    {
        public string Email;
        public bool IsRegistered;
        public string Login;
        public string Password;
        public ExtPlayer Player;
        public string Promo;
        public DateTime Time;
    }
}