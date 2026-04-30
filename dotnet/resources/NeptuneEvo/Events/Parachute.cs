using System;
using GTANetworkAPI;
using NeptuneEvo.Character;
using NeptuneEvo.Handles;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Events
{
    internal class Parachute : Script
    {
        private static readonly nLog Log = new nLog("Events.Parachute");

        [RemoteEvent("server.parachute.state")]
        public static void ParachuteState(ExtPlayer player, int state)
        {
            try
            {
                if (!player.IsCharacterData()) return;
                Trigger.ClientEventInRange(player.Position, 250f, "client.parachute.state", player, state);
            }
            catch (Exception e)
            {
                Log.Write($"ParachuteState Exception: {e}");
            }
        }
    }
}