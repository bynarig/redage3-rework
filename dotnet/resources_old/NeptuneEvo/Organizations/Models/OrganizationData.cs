using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Database;
using GTANetworkAPI;
using LinqToDB;
using NeptuneEvo.Debugs;
using NeptuneEvo.Handles;
using NeptuneEvo.Table.Models;
using Newtonsoft.Json;

namespace NeptuneEvo.Organizations.Models
{
    public class OrganizationData : TableData
    {
        public Dictionary<int, byte> AttackingCount = new Dictionary<int, byte>();

        public Color Color = new Color();
        public DateTime Date;
        public Dictionary<int, byte> ProtectingCount = new Dictionary<int, byte>();

        public byte Salary = 0;
        public string Slogan = "";

        public Dictionary<string, OrganizationVehicleData> Vehicles =
            new Dictionary<string, OrganizationVehicleData>();

        public int OwnerUUID { get; set; } = -1;
        public byte OfficeUpgrade { get; set; } = 0;
        public bool Stock { get; set; } = false;
        public bool CrimeOptions { get; set; } = false;

        public Dictionary<string, bool> Schemes { get; set; } = new Dictionary<string, bool>
        {
            { "Pistol", false },
            { "PistolMk2", false },
            { "Pistol50", false },
            { "HeavyPistol", false },
            { "PumpShotgun", false },
            { "DoubleBarrelShotgun", false },
            { "SawnOffShotgun", false },
            { "MiniSMG", false },
            { "SMGMk2", false },
            { "MachinePistol", false },
            { "MicroSMG", false },
            { "CombatPDW", false },
            { "CompactRifle", false },
            { "AssaultRifle", false },
            { "Armor", false }
        };

        public bool Status { get; set; }

        public bool[] Used { get; set; } = new bool[15]
            { false, false, false, false, false, false, false, false, false, false, false, false, false, false, false };

        public ExtBlip Blip { get; set; } = null;
        public int BlipId { get; set; } = -1;
        public byte BlipColor { get; set; } = 0;
        public Vector3 BlipPosition { get; set; } = new Vector3();

        public async Task Save(ServerBD db)
        {
            await db.Organizations
                .Where(o => o.Organization == Id)
                .Set(o => o.Drugs, Drugs)
                .Set(o => o.Mats, Materials)
                .Set(o => o.MedKits, MedKits)
                .Set(o => o.Money, Money)
                .Set(o => o.IsOpen, Convert.ToSByte(IsOpenStock))
                .Set(o => o.AttackingCount, JsonConvert.SerializeObject(AttackingCount))
                .Set(o => o.ProtectingCount, JsonConvert.SerializeObject(ProtectingCount))
                .UpdateAsync();
        }

        public void SaveRank()
        {
            Trigger.SetTask(async () =>
            {
                try
                {
                    await using var db = new ServerBD("MainDB"); //В отдельном потоке

                    await db.Organizations
                        .Where(v => v.Organization == Id)
                        .Set(v => v.Ranks, JsonConvert.SerializeObject(Ranks))
                        .UpdateAsync();
                }
                catch (Exception e)
                {
                    Repository.Exception(e);
                }
            });
        }

        public void SaveLeader()
        {
            Trigger.SetTask(async () =>
            {
                try
                {
                    await using var db = new ServerBD("MainDB"); //В отдельном потоке

                    await db.Organizations
                        .Where(v => v.Organization == Id)
                        .Set(v => v.OwnerUUID, OwnerUUID)
                        .UpdateAsync();
                }
                catch (Exception e)
                {
                    Repository.Exception(e);
                }
            });
        }

        public uint GetDimension()
        {
            return (uint)(Manager.DefaultDimension + Id);
        }

        public void SaveDepartment()
        {
            Trigger.SetTask(async () =>
            {
                try
                {
                    await using var db = new ServerBD("MainDB"); //В отдельном потоке

                    await db.Organizations
                        .Where(v => v.Organization == Id)
                        .Set(v => v.Departments, JsonConvert.SerializeObject(Departments))
                        .UpdateAsync();
                }
                catch (Exception e)
                {
                    Repository.Exception(e);
                }
            });
        }

        public void SaveSettings()
        {
            Trigger.SetTask(async () =>
            {
                try
                {
                    await using var db = new ServerBD("MainDB"); //В отдельном потоке

                    await db.Organizations
                        .Where(v => v.Organization == Id)
                        .Set(v => v.Discord, Discord)
                        .Set(v => v.Salary, Convert.ToSByte(Salary))
                        .Set(v => v.Color, JsonConvert.SerializeObject(Color))
                        .Set(v => v.Slogan, Slogan)
                        .UpdateAsync();
                }
                catch (Exception e)
                {
                    Repository.Exception(e);
                }
            });
        }

        public void SaveCrimeOptions()
        {
            Trigger.SetTask(async () =>
            {
                try
                {
                    await using var db = new ServerBD("MainDB"); //В отдельном потоке

                    await db.Organizations
                        .Where(o => o.Organization == Id)
                        .Set(o => o.CrimeOptions, Convert.ToSByte(CrimeOptions))
                        .UpdateAsync();
                }
                catch (Exception e)
                {
                    Repository.Exception(e);
                }
            });
        }

        public bool IsLeader(int uuid)
        {
            return uuid == OwnerUUID;
        }
        //

        public int MoneyMultiplier()
        {
            if (!Status)
                return 0;

            if (Money < 50000) return 0; // 0-50
            if (Money < 100000) return 1; // 50-100
            if (Money < 150000) return 2; // 100-150
            if (Money < 200000) return 3; // 150-200
            if (Money < 250000) return 4; // 200-250
            if (Money < 300000) return 5; // 250-300
            if (Money < 350000) return 6; // 300-350
            if (Money < 400000) return 7; // 350-400
            if (Money < 450000) return 8; // 400-450
            if (Money < 500000) return 9; // 450-500
            if (Money < 550000) return 10; // 500-550
            if (Money < 600000) return 11; // 550-600
            if (Money < 650000) return 12; // 600-650
            if (Money < 700000) return 13; // 650-700
            if (Money < 750000) return 14; // 700-750
            if (Money < 800000) return 15; // 750-800
            if (Money < 850000) return 16; // 800-850
            if (Money < 900000) return 17; // 850-900
            if (Money < 950000) return 18; // 900-950
            if (Money < 1000000) return 19; // 950-1
            if (Money < 2000000) return 20; // 1-2
            if (Money < 3000000) return 21; // 2-3
            if (Money < 4000000) return 22; // 3-4
            if (Money < 5000000) return 23; // 4-5
            return 24; // 5+
        }

        public int DrugsMultiplier()
        {
            if (!Status)
                return 0;

            if (Drugs < 100) return 0; // 0-100
            if (Drugs < 250) return 1; // 100-250
            if (Drugs < 500) return 2; // 250-500
            if (Drugs < 1000) return 3; // 500-1000
            if (Drugs < 2500) return 4; // 1000-2500
            if (Drugs < 5000) return 5; // 2500-5000

            return 6; // 5000+
        }

        public int MaterialsMultiplier()
        {
            if (!Status)
                return 0;

            if (Materials < 5000) return 0; // 0-5000
            if (Materials < 25000) return 1; // 5000-25000
            if (Materials < 45000) return 2; // 25000-45000

            return 3; // 45000+
        }

        public int MedKitsMultiplier()
        {
            if (!Status)
                return 0;

            if (MedKits < 100) return 0; // 0-100
            if (MedKits < 250) return 1; // 100-250
            if (MedKits < 500) return 2; // 250-500
            if (MedKits < 1000) return 3; // 500-1000
            if (MedKits < 2500) return 4; // 1000-2500
            if (MedKits < 5000) return 5; // 2500-5000

            return 6; // 5000+
        }
    }
}