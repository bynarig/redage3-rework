using System;
using System.Linq;
using Database;
using LinqToDB;
using NeptuneEvo.Debugs;
using NeptuneEvo.VehicleData.Models;
using Newtonsoft.Json;

namespace NeptuneEvo.Organizations.Models
{
    public class OrganizationVehicleData
    {
        public VehicleCustomization customization;
        public float dirt;
        public byte garageId;
        public string model = "";
        public int petrol;
        public int rank;

        public OrganizationVehicleData(string model, int rank, byte garageId, float dirt, int petrol,
            VehicleCustomization customization)
        {
            this.model = model;
            this.rank = rank;
            this.garageId = garageId;
            this.dirt = dirt;
            this.petrol = petrol;
            this.customization = customization;
        }

        public void SaveCustomization(string number)
        {
            Trigger.SetTask(async () =>
            {
                try
                {
                    await using var db = new ServerBD("MainDB"); //В отдельном потоке

                    await db.Orgvehicles
                        .Where(o => o.Number == number)
                        .Set(o => o.Components, JsonConvert.SerializeObject(customization))
                        .UpdateAsync();
                }
                catch (Exception e)
                {
                    Repository.Exception(e);
                }
            });
        }
    }
}