using NeptuneEvo.Handles;
using NeptuneEvo.SDK;

namespace NeptuneEvo.PedSystem.LivingCity.Models
{
    public class LivingPed
    {
        public ExtPlayer Controller;
        private string InitTimer;
        public bool IsSpawned;
        public ExtPed Ped;
        public ExtVehicle Vehicle;

        public LivingPed(ExtPed ped, ExtVehicle vehicle, ExtPlayer controller)
        {
            Ped = ped;
            Ped.SetSharedData("LCNPC", vehicle.Value);
            Vehicle = vehicle;
            Controller = controller;
            InitTimer = Timers.StartOnce(2500, () =>
            {
                IsSpawned = true;
                if (Ped == null || !Ped.Exists) return;
                Ped.Controller = Controller;
            }, true);
        }

        public void Destroy()
        {
            DestroyTimer();
            IsSpawned = false;
            DestroyPed();
            DestroyVehicle();
            Controller = null;
        }

        private void DestroyTimer()
        {
            if (InitTimer == null) return;
            Timers.Stop(InitTimer);
            InitTimer = null;
        }

        private void DestroyPed()
        {
            if (Ped == null) return;
            Ped.SetSharedData("LCNPC", 0);
            Ped.Delete();
            Ped = null;
        }

        private void DestroyVehicle()
        {
            if (Vehicle == null) return;
            Vehicle.Delete();
            Vehicle = null;
        }
    }
}