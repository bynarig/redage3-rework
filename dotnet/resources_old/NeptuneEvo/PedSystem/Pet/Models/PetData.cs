using System;
using GTANetworkAPI;

namespace NeptuneEvo.PedSystem.Pet.Models
{
    public class PetData
    {
        public int AutoId { get; set; } = 0;
        public string Name { get; set; } = null;
        public int OwnerUUID { get; set; } = 0;
        public uint Model { get; set; } = 0;
        public int Health { get; set; } = 100;
        public DateTime Death { get; set; } = DateTime.MinValue;
        public bool InGame { get; set; } = false;
        public Vector3 Position { get; set; } = new Vector3();
        public Vector3 Rotation { get; set; } = new Vector3();
        public float Heading { get; set; } = 0f;
        public uint Dimension { get; set; } = 0;
    }
}