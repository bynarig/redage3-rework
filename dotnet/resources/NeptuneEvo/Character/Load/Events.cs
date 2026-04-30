using System;
using GTANetworkAPI;
using NeptuneEvo.Accounts;
using NeptuneEvo.Handles;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Character.Load
{
    internal class Events : Script
    {
        private static readonly nLog Log = new nLog("Core.Character.Load");

        [RemoteEvent("selectchar")]
        public void ClientEvent_selectCharacter(ExtPlayer player, int uuid, int spawnid)
        {
            try
            {
                var accountData = player.GetAccountData();
                if (accountData == null) return;
                if (!accountData.Chars.Contains(uuid)) return;
                Log.Write($"{player.Name}({uuid}) select char - spawnid({spawnid})");

                accountData.LastSelectCharUUID = uuid;

                Trigger.SetTask(async () => { await Repository.Load(player, uuid, spawnid); });
            }
            catch (Exception e)
            {
                Log.Write($"ClientEvent_selectCharacter Exception: {e}");
            }
        }
    }
}