using NeptuneEvo.Core;
using NeptuneEvo.Handles;

namespace NeptuneEvo.Accounts.NewPassword
{
    internal class Repository
    {
        public static void changePassword(ExtPlayer player, string newPass)
        {
            var accountData = player.GetAccountData();
            if (accountData == null) return;
            accountData.Password = Accounts.Repository.GetSha256(newPass);
            GameLog.AccountLog(accountData.Login, accountData.HWID, accountData.IP, accountData.SocialClub,
                "Смена пароля");
        }
    }
}