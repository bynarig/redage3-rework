using GTANetworkAPI;
using NeptuneEvo.VehicleData.LocalData.Models;

namespace NeptuneEvo.Handles
{
    public class ExtVehicle : Vehicle
    {
        public VehicleLocalData VehicleLocalData;

        public VehicleLocalStateData VehicleLocalStateData;

        public ExtVehicle(NetHandle handle) : base(handle)
        {
        }

        public void SetVehicleLocalData(VehicleLocalData vehicleLocalData)
        {
            VehicleLocalData = vehicleLocalData;
        }

        public void SetVehicleLocalStateData(VehicleLocalStateData vehicleLocalStateData)
        {
            VehicleLocalStateData = vehicleLocalStateData;
        }
    }
}