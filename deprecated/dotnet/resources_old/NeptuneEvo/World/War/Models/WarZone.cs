using GTANetworkAPI;

namespace NeptuneEvo.World.War.Models
{
    public class WarZone
    {
        public int Id;
        public string Name;
        public Vector3 Position;
        public float Range;

        public WarZone(int id, string name, Vector3 position, float range)
        {
            Id = id;
            Name = name;
            Position = position;
            Range = range;
        }
    }
}