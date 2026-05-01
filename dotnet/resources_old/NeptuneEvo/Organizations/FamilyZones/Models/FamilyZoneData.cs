using System;
using System.Linq;
using Database;
using GTANetworkAPI;
using LinqToDB;

namespace NeptuneEvo.Organizations.FamilyZones.Models
{
    public class FamilyZoneData
    {
        public byte Id;
        public string Name;
        public int OrganizationId;
        public Vector3 Position;

        public FamilyZoneData(byte id, string name, int organizationId, Vector3 position)
        {
            Id = id;
            Name = name;
            OrganizationId = organizationId;
            Position = position;
        }

        public void Save()
        {
            Trigger.SetTask(async () =>
            {
                try
                {
                    await using var db = new ServerBD("MainDB"); //В отдельном потоке

                    await db.Familyzones
                        .Where(v => v.Id == Id)
                        .Set(v => v.Orgid, Convert.ToInt16(OrganizationId))
                        .UpdateAsync();
                }
                catch (Exception e)
                {
                    Debugs.Repository.Exception(e);
                }
            });
        }
    }
}