using GTANetworkAPI;
using NeptuneEvo.Handles;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Character.BindConfig
{
    internal class Events : Script
    {
        private static readonly nLog Log = new nLog("Core.Character.BindConfig.Events");

        [RemoteEvent("bindConfigSave")]
        public void Save(ExtPlayer player, byte key, byte value)
        {
            Repository.Update(player, key, value);
        }
    }
}