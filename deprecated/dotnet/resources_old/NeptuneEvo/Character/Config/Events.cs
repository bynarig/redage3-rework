using System;
using GTANetworkAPI;
using NeptuneEvo.Handles;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Character.Config
{
    internal class Events : Script
    {
        private static readonly nLog Log = new nLog("Core.Character.Config");

        [RemoteEvent("chatConfigSave")]
        public void Save(ExtPlayer player, string chatData)
        {
            try
            {
                Repository.Update(player, chatData);
            }
            catch (Exception e)
            {
                Log.Write($"bindConfigSave Exception: {e}");
            }
        }
    }
}