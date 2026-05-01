using GTANetworkAPI;
using NeptuneEvo.Players.Models;

namespace NeptuneEvo.Handles
{
    public class ExtColShape : ColShape
    {
        public ExtColShapeData ColShapeData;

        public ExtColShape(NetHandle handle) : base(handle)
        {
        }

        public void SetColShapeData(ExtColShapeData сolShapeData)
        {
            ColShapeData = сolShapeData;
        }
    }
}