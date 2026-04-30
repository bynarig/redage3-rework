using GTANetworkAPI;
using NeptuneEvo.Handles;
using NeptuneEvo.Table.Tasks.Models;
using NeptuneEvo.Table.Tasks.Player;

namespace NeptuneEvo.Table.Tasks
{
    public class Events : Script
    {
        [Command("testtable")]
        public void testtable(ExtPlayer player)
        {
            if (Main.ServerNumber != 0)
                return;

            Repository.UpdateOrg();
        }

        [Command("ct")]
        public void cmyt(ExtPlayer player, int id)
        {
            if (Main.ServerNumber != 0)
                return;

            player.AddTableScore((TableTaskId)id);
        }

        [Command("t3")]
        public void t3(ExtPlayer player, int id, int victoryId)
        {
            if (Main.ServerNumber != 0)
                return;

            Organizations.FamilyZones.Repository.Update((byte)id, victoryId);
        }
    }
}