using GTANetworkAPI;

namespace NeptuneEvo.Table.Tasks.Patrolling.Models
{
    public class PatrollingData
    {
        public Fractions.Models.Fractions Fraction;
        public bool IsAir;
        public Vector3 Position;

        public PatrollingData(Vector3 position, Fractions.Models.Fractions fraction, bool isAir)
        {
            Position = position;
            Fraction = fraction;
            IsAir = isAir;
        }
    }
}