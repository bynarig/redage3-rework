using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using NeptuneEvo.Accounts.Models;
using NeptuneEvo.Handles;
using RAGE;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Accounts
{
    public static class Repository
    {
        private static readonly nLog Log = new nLog("Accounts.Repository");

        public static bool IsAccountData(this ExtPlayer player)
        {
            if (player is null)
                return false;

            return player.AccountData != null;
        }

        public static AccountData GetAccountData(this ExtPlayer player)
        {
            if (player != null)
                return player.AccountData;

            return null;
        }

        public static string GetLogin(this ExtPlayer player)
        {
            var accountData = player.GetAccountData();

            if (accountData != null)
                return accountData.Login;

            return "";
        }

        public static string GetSha256(string strData)
        {
            var message = Encoding.ASCII.GetBytes(strData);
            using (var hashString = new SHA256Managed())
            {
                var hex = "";

                var hashValue = hashString.ComputeHash(message);
                foreach (var x in hashValue)
                    hex += string.Format("{0:x2}", x);
                return hex;
            }
        }

        public static ExtPlayer GetPlayerToLogin(string login)
        {
            try
            {
                login = login.ToLower();

                return Entities.Players.All.Cast<ExtPlayer>()
                    .FirstOrDefault(p => p.AccountData != null && p.AccountData.Login.ToLower() == login);
            }
            catch (Exception e)
            {
                Log.Write($"GetPlayerToLogin Exception: {e}");
            }

            return null;
        }

        public static string GetEmailToLogin(string login)
        {
            login = login.ToLower();

            if (Main.LoginToEmail.ContainsKey(login))
                return Main.LoginToEmail[login];

            return null;
        }
    }
}