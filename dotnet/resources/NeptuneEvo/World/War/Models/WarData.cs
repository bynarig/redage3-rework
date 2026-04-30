using System;
using System.Collections.Generic;
using System.Linq;
using Database;
using GTANetworkAPI;
using LinqToDB;
using Newtonsoft.Json;

namespace NeptuneEvo.World.War.Models
{
    public class WarData
    {
        public ushort AttackingCount = 0;
        public ushort AttackingId = 0;
        public sbyte AttackingPlayersInZone = 0; //Состав участников в зону
        public sbyte AttackingPlayersInZoneCount = 0; //Состав участников в зону
        public sbyte Composition = 0;

        public ushort Counting;

        //
        public WarGripType GripType; //Тип битвы
        public ushort Id;
        public bool IsStartWar = false;
        public ushort MapId;
        public string MapName;
        public ushort ObjectId;
        public Vector3 Position; //Место проведения битвы
        public ushort ProtectingCount = 0;
        public ushort ProtectingId = 0;
        public sbyte ProtectingPlayersInZone = 0; //Состав участников в зону
        public sbyte ProtectingPlayersInZoneCount = 0; //Состав участников в зону

        public float Range; //Место проведения битвы

        //
        public List<int> RetiredUuId = new List<int>();

        //
        public WarStatus Status;
        public DateTime Time;
        public WarType Type;
        public sbyte WeaponsCategory = 0; //Тип оружия

        public uint GetDimension()
        {
            return Id + Repository.DefaultDimension;
        }

        public void Insert()
        {
            Trigger.SetTask(async () =>
            {
                try
                {
                    await using var db = new ServerBD("MainDB"); //В отдельном потоке

                    await db.InsertAsync(new Wars
                    {
                        Id = Convert.ToInt16(Id),
                        ObjectId = Convert.ToInt16(ObjectId),
                        Type = Convert.ToSByte(Type),
                        AttackingId = Convert.ToInt16(AttackingId),
                        ProtectingId = Convert.ToInt16(ProtectingId),
                        MapName = MapName,
                        MapId = Convert.ToInt16(MapId),
                        Position = JsonConvert.SerializeObject(Position),
                        Range = Range,
                        GripType = Convert.ToSByte(GripType),
                        Composition = Convert.ToSByte(Composition),
                        WeaponsCategory = Convert.ToSByte(WeaponsCategory),
                        Time = Time
                    });
                }
                catch (Exception e)
                {
                    Debugs.Repository.Exception(e);
                }
            });
        }

        public void Update()
        {
            Trigger.SetTask(async () =>
            {
                try
                {
                    await using var db = new ServerBD("MainDB"); //В отдельном потоке

                    await db.Wars
                        .Where(w => w.Id == Id)
                        .Set(w => w.AttackingId, Convert.ToInt16(AttackingId))
                        .UpdateAsync();
                }
                catch (Exception e)
                {
                    Debugs.Repository.Exception(e);
                }
            });
        }

        public void Delete()
        {
            Trigger.SetTask(async () =>
            {
                try
                {
                    await using var db = new ServerBD("MainDB"); //В отдельном потоке

                    await db.Wars
                        .DeleteAsync(w => w.Id == Id);
                }
                catch (Exception e)
                {
                    Debugs.Repository.Exception(e);
                }
            });
        }
    }
}