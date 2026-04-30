using System;
using System.Collections.Generic;
using System.Linq;
using GTANetworkAPI;
using NeptuneEvo.Handles;
using NeptuneEvo.PedSystem.LivingCity.Models;
using NeptuneEvo.Players;
using NeptuneEvo.Players.Models;
using NeptuneEvo.SDK;

namespace NeptuneEvo.PedSystem.LivingCity
{
    internal class Repository : Script
    {
        private const byte MAX_NPC_PER_PLAYER = 6;
        private const byte MAX_NPC_IN_ONE_LOCATION = MAX_NPC_PER_PLAYER * 3;
        private const float MAX_CONTROLLER_DISTANCE = 300.0f;
        private const float MAX_NEW_CONTROLLER_DISTANCE = 275.0f;
        private const float MIN_CONTROLLER_DISTANCE = 150.0f;
        private static readonly nLog Log = new nLog("PedSystem.LivingCity");

        private static readonly List<uint> DriverHashes = new List<uint>();
        private static readonly List<uint> VehicleHashes = new List<uint>();
        private static readonly List<LivingPed> LivingCity = new List<LivingPed>();

        private static readonly Random Rnd = new Random();
        private static string Timer;
        private static readonly bool Enabled = false;

        private static void InitializeHashes()
        {
            AddDriverHashes((uint)PedHash.AfriAmer01AMM, (uint)PedHash.ArmGoon01GMM, (uint)PedHash.ArmGoon02GMY,
                (uint)PedHash.ArmLieut01GMM, (uint)PedHash.Baygor, (uint)PedHash.Bevhills01AFY,
                (uint)PedHash.Bevhills01AFM, (uint)PedHash.Hipster02AFY);
            AddVehicleHashes((uint)VehicleHash.Prairie, (uint)VehicleHash.Blista, (uint)VehicleHash.Asbo,
                (uint)VehicleHash.Felon, (uint)VehicleHash.Sentinel, (uint)VehicleHash.Akuma, (uint)VehicleHash.Bagger,
                (uint)VehicleHash.Blade, (uint)VehicleHash.Deviant, (uint)VehicleHash.Rancherxl,
                (uint)VehicleHash.Baller, (uint)VehicleHash.Landstalker, (uint)VehicleHash.Novak,
                (uint)VehicleHash.Ingot, (uint)VehicleHash.Glendale, (uint)VehicleHash.Bus,
                NAPI.Util.GetHashKey("emsnspeedo"));
        }

        [ServerEvent(Event.ResourceStart)]
        public void OnResourceStart()
        {
            if (!Enabled) return;

            InitializeHashes();
            Timer = Timers.Start(5000, SpawnNewNPCs, true);

            Trigger.SetAsyncTask(VehiclePositions.Initialize);
        }

        [ServerEvent(Event.ResourceStop)]
        public void OnResourceStop()
        {
            if (Timer == null) return;
            Timers.Stop(Timer);
            Timer = null;
        }

        public static void OnPlayerDisconnect(ExtPlayer player)
        {
            DestroyAllPlayersNPC(player);
        }

        private static int GetPedsCountNearPoint(Vector3 point, float maxDistance)
        {
            var count = 0;
            foreach (var ped in NAPI.Pools.GetAllPeds())
            {
                if (ped == null || ped.Dimension != 0) continue;
                if (ped.Position.DistanceTo2D(point) >= maxDistance) continue;
                count++;
            }

            return count;
        }

        private static void DestroyNPC(LivingPed ped)
        {
            if (!LivingCity.Contains(ped)) return;

            ped.Destroy();
            LivingCity.Remove(ped);
        }

        private static void DestroyAllPlayersNPC(ExtPlayer player)
        {
            var livingPeds = GetPlayerLivingPeds(player);
            if (livingPeds == null || livingPeds.Count == 0) return;

            foreach (var livingPed in livingPeds) DestroyNPC(livingPed);
        }

        private static void CreateNPC(ExtPlayer player, LivingVehiclePos position)
        {
            var randomDriver = GetRandomPedHash();
            var randomVehicle = GetRandomVehicleHash();

            var ped = (ExtPed)NAPI.Ped.CreatePed(randomDriver, position.Position.Around(2f), 0f, true,
                controlLocked: true, dimension: 0);
            var veh = (ExtVehicle)NAPI.Vehicle.CreateVehicle(randomVehicle, position.Position, position.Rotation,
                GetRandomVehicleColor(), GetRandomVehicleColor(), "LC0" + ped.Value, locked: true);
            VehiclePositions.RegisterVehiclePosAsSpawned(position);
            LivingCity.Add(new LivingPed(ped, veh, player));
        }

        private static void SpawnNewNPCs()
        {
            if (VehiclePositions.GetCountOfVehiclePositions() == 0) return;

            int controllerCityCount;
            Vector3 playerPosition;
            SessionData playerSession;
            List<LivingVehiclePos> vehiclePositions;
            List<LivingPed> livingPeds;
            Player pedActualController;
            foreach (var player in Character.Repository.GetPlayers())
            {
                playerSession = player.GetSessionData();
                if (playerSession == null || !playerSession.LoggedIn) continue;

                livingPeds = GetPlayerLivingPeds(player);
                foreach (var ped in livingPeds)
                {
                    if (ped == null) continue;
                    if (ped.Ped == null || ped.Ped.Controller == null)
                    {
                        DestroyNPC(ped);
                        continue;
                    }

                    if (!ped.IsSpawned) continue;
                    pedActualController = ped.Ped.Controller;
                    if (pedActualController.Position.DistanceTo2D(ped.Ped.Position) >= MAX_CONTROLLER_DISTANCE)
                    {
                        DestroyNPC(ped);
                        continue;
                    }

                    if (pedActualController != player) ped.Controller = (ExtPlayer)pedActualController;
                    if (NAPI.Vehicle.GetVehicleDriver(ped.Vehicle) == null) DestroyNPC(ped);
                }

                if (playerSession.Dimension != 0 || (player.Vehicle != null && (player.Vehicle.Class == 16 ||
                        player.Vehicle.Class == 15 || player.Vehicle.Class == 14))) continue;

                controllerCityCount = livingPeds.Count();
                if (controllerCityCount >= MAX_NPC_PER_PLAYER) continue;

                playerPosition = player.Position;
                if (GetPedsCountNearPoint(playerPosition, MAX_NEW_CONTROLLER_DISTANCE) >=
                    MAX_NPC_IN_ONE_LOCATION) continue;

                vehiclePositions = VehiclePositions.GetVehiclePositionsFromPoint(playerPosition,
                    MIN_CONTROLLER_DISTANCE, MAX_NEW_CONTROLLER_DISTANCE);
                foreach (var vehiclePosition in vehiclePositions)
                {
                    if (controllerCityCount >= MAX_NPC_PER_PLAYER) break;
                    if (NAPI.Player.GetPlayersInRadiusOfPosition(MIN_CONTROLLER_DISTANCE, vehiclePosition.Position)
                            .Count() >= 1) continue;
                    CreateNPC(player, vehiclePosition);
                    controllerCityCount++;
                }
            }
        }

        private static bool ChangeNPCController(LivingPed livingPed, Player newController, bool force = true)
        {
            if (!LivingCity.Contains(livingPed)) return false;

            var extNewController = (ExtPlayer)newController;
            if (GetCountOfPlayerLivingPeds(extNewController) >= MAX_NPC_PER_PLAYER) return false;
            livingPed.Controller = extNewController;
            return true;
        }

        public static bool AddVehicleHash(uint vehicle)
        {
            if (VehicleHashes.Contains(vehicle)) return false;
            VehicleHashes.Add(vehicle);
            return true;
        }

        public static bool RemoveVehicleHash(uint vehicle)
        {
            if (!VehicleHashes.Contains(vehicle)) return false;
            VehicleHashes.Remove(vehicle);
            return true;
        }

        private static void AddVehicleHashes(params uint[] vehicles)
        {
            foreach (var vehicle in vehicles)
            {
                if (VehicleHashes.Contains(vehicle)) continue;
                VehicleHashes.Add(vehicle);
            }
        }

        public static bool AddDriverHash(uint driver)
        {
            if (DriverHashes.Contains(driver)) return false;
            DriverHashes.Add(driver);
            return true;
        }

        public static bool RemoveDriverHash(uint driver)
        {
            if (!DriverHashes.Contains(driver)) return false;
            DriverHashes.Remove(driver);
            return true;
        }

        private static void AddDriverHashes(params uint[] drivers)
        {
            foreach (var driver in drivers)
            {
                if (DriverHashes.Contains(driver)) continue;
                DriverHashes.Add(driver);
            }
        }

        private static List<LivingPed> GetPlayerLivingPeds(ExtPlayer player)
        {
            return LivingCity.Where(x => x.Controller == player).ToList();
        }

        private static int GetCountOfPlayerLivingPeds(ExtPlayer player)
        {
            return LivingCity.Where(x => x.Controller == player).Count();
        }

        private static uint GetRandomPedHash()
        {
            return DriverHashes[Rnd.Next(DriverHashes.Count)];
        }

        private static uint GetRandomVehicleHash()
        {
            return VehicleHashes[Rnd.Next(VehicleHashes.Count)];
        }

        private static int GetRandomVehicleColor()
        {
            return Rnd.Next(250);
        }
    }
}