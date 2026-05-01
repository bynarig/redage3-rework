using System;
using GTANetworkAPI;
using NeptuneEvo.BattlePass;
using NeptuneEvo.Handles;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Core
{
    internal class Fingerpointing : Script
    {
        private static readonly nLog Log = new nLog("Core.Finger");

        [RemoteEvent("server.fpsync.update")]
        public void FingerSyncUpdate(ExtPlayer player, float camPitch, float camHeading)
        {
            try
            {
                if (player == null) return;
                Repository.UpdateReward(player, 89);
                Trigger.ClientEventInRange(player.Position, 250f, "client.fpsync.update", player.Value, camPitch,
                    camHeading);
            }
            catch (Exception e)
            {
                Log.Write($"FingerSyncUpdate Exception: {e}");
            }
        }
    }
}