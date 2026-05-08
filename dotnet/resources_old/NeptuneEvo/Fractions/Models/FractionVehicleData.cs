using GTANetworkAPI;
using NeptuneEvo.VehicleData.Models;

namespace NeptuneEvo.Fractions.Models
{
    public class FractionVehicleData
    {
        public int color1;
        public int color2;
        public VehicleCustomization customization;
        public int defaultRank;
        public uint Dimension = 0;
        public string model = "";
        public Vector3 position = new Vector3();
        public int rank;
        public Vector3 rotation = new Vector3();

        public FractionVehicleData(string model, Vector3 position, Vector3 rotation, int rank, int defaultRank,
            int color1, int color2, VehicleCustomization customization)
        {
            this.model = model.ToLower();
            this.position = position;
            this.rotation = rotation;
            this.rank = rank;
            this.defaultRank = defaultRank;
            this.color1 = color1;
            this.color2 = color2;
            this.customization = customization;
        }
    }
}