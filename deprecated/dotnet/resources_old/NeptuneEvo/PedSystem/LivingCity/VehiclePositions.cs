using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Database;
using GTANetworkAPI;
using LinqToDB;
using NeptuneEvo.NewCasino;
using NeptuneEvo.PedSystem.LivingCity.Models;
using NeptuneEvo.SDK;

namespace NeptuneEvo.PedSystem.LivingCity
{
    internal class VehiclePositions
    {
        private static readonly nLog Log = new nLog("PedSystem.VehiclePositions");

        private static readonly List<LivingVehiclePos> LivingVehiclePositions = new List<LivingVehiclePos>();
        private static readonly Random Rnd = new Random();

        public static async Task Initialize()
        {
            await using var db = new ServerBD("MainDB");
            var livingCityVehPositions = await db.Livingcity.ToListAsync();
            foreach (var lcVehPos in livingCityVehPositions)
            {
                if (lcVehPos == null) continue;
                LivingVehiclePositions.Add(new LivingVehiclePos(lcVehPos.VehicleX, lcVehPos.VehicleY, lcVehPos.VehicleZ,
                    lcVehPos.VehicleR));
            }

            Log.Write($"Успешно загружено {LivingVehiclePositions.Count} позиций для NPC живого города.");
        }

        public static bool RegisterVehiclePosAsSpawned(LivingVehiclePos positionData)
        {
            var livingVehiclePos = LivingVehiclePositions.FirstOrDefault(x => x.Position == positionData.Position);
            if (livingVehiclePos == null) return false;

            livingVehiclePos.SpawnedNow();
            return true;
        }

        public static List<LivingVehiclePos> GetVehiclePositionsFromPoint(Vector3 point, float minDistance,
            float maxDistance)
        {
            var now = DateTime.Now;
            var newList = LivingVehiclePositions.Where(x => x.Position.DistanceTo2D(point) < maxDistance)
                .Where(x => x.Position.DistanceTo2D(point) >= minDistance)
                .Where(x => x.IsAllowedToSpawn(now))
                .ToList();
            return Horses.Shuffle(newList);
        }

        public static LivingVehiclePos GetRandomVehiclePositionFromPoint(Vector3 point, float minDistance,
            float maxDistance)
        {
            var newList = GetVehiclePositionsFromPoint(point, minDistance, maxDistance);
            if (newList.Count == 0) return null;
            return newList.First();
        }

        public static int GetCountOfVehiclePositions()
        {
            return LivingVehiclePositions.Count;
        }
    }
}