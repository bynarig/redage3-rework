using GTANetworkAPI;
using NeptuneEvo.World.War.Models;

namespace NeptuneEvo.Players.Models
{
    public class WarData
    {
        public ushort AttackingId;
        public bool IsAttacking;
        public bool IsWarZone;
        public ushort MapId;
        public string MapName;
        public ushort ObjectId;
        public Vector3 Position; //Место проведения битвы
        public ushort ProtectingId;
        public float Range; //Место проведения битвы
        public WarType Type;

        //
        public ushort WarId;
    }
}