using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using GTANetworkAPI;
using NeptuneEvo.Localization;
using NeptuneEvo.Character;
using NeptuneEvo.Character.Models;
using NeptuneEvo.Chars;
using NeptuneEvo.Chars.Models;
using NeptuneEvo.Fractions;
using NeptuneEvo.Fractions.Models;
using NeptuneEvo.Fractions.Player;
using NeptuneEvo.Functions;
using NeptuneEvo.Handles;
using NeptuneEvo.Houses;
using NeptuneEvo.Jobs;
using NeptuneEvo.MoneySystem;
using NeptuneEvo.Organizations.Player;
using NeptuneEvo.Players;
using NeptuneEvo.Players.Models;
using NeptuneEvo.Table.Models;
using NeptuneEvo.Table.Tasks.Models;
using NeptuneEvo.Table.Tasks.Player;
using NeptuneEvo.VehicleData.LocalData;
using NeptuneEvo.VehicleData.LocalData.Models;
using NeptuneEvo.VehicleModel;
using Newtonsoft.Json;
using NeptuneEvo.SDK;
using Object = GTANetworkAPI.Object;
using Repository = NeptuneEvo.Chars.Repository;

namespace NeptuneEvo.Core
{
    internal class Selecting : Script
    {
        private static readonly nLog Log = new nLog("Core.Selecting");

        public static ConcurrentDictionary<int, ObjData> Objects = new ConcurrentDictionary<int, ObjData>();
        public static readonly int DeleteTime = 1000 * 60 * 30;
        private static readonly Random rnd = new Random();

        public static object Where { get; internal set; }

        public static void DeleteObject(int entityid)
        {
            try
            {
                if (!Objects.ContainsKey(entityid)) return;
                var odata = Objects[entityid];
                if (odata.DeleteTimer != null)
                {
                    Timers.Stop(odata.DeleteTimer);
                    odata.DeleteTimer = null;
                }

                if (odata.entity != null && odata.entity.Exists) odata.entity.Delete();
                Objects.TryRemove(entityid, out _);
            }
            catch (Exception e)
            {
                Log.Write($"DeleteObject Exception: {e}");
            }
        }

        public static ObjData FindObjectByID(int entityid)
        {
            try
            {
                if (!Objects.ContainsKey(entityid)) return null;
                return Objects[entityid];
            }
            catch (Exception e)
            {
                Log.Write($"FindObjectByID Exception: {e}");
                return null;
            }
        }

        [RemoteEvent("oSelected")]
        public static void objectSelected(ExtPlayer player, string entityidString)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                if (characterData.DemorganTime >= 1 || sessionData.CuffedData.Cuffed || sessionData.DeathData.InDeath ||
                    sessionData.AntiAnimDown || !characterData.IsAlive) return;

                var entityid = Convert.ToInt32(entityidString);

                var odata = FindObjectByID(entityid);
                if (odata == null || odata.entity == null || !odata.entity.Exists) return;
                if (odata.entity.Position.DistanceTo(player.Position) >= 5)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.TooFar), 1500);
                    return;
                }

                if (odata.PickedTemp) return;
                var objType = odata.Type;
                switch (objType)
                {
                    case "WeaponSafe":
                    case "SubjectSafe":
                    case "ClothesSafe":
                    case "BurglarProofSafe":
                        if (!FunctionsAccess.IsWorking("lockpick"))
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.FunctionOffByAdmins), 3000);
                            return;
                        }

                        if (characterData.InsideHouseID == -1) return;
                        var houseID = characterData.InsideHouseID;
                        var house = HouseManager.Houses.FirstOrDefault(h => h.ID == houseID);
                        if (house == null) return;
                        if (!house.Owner.Equals(player.Name) &&
                            (!house.Roommates.ContainsKey(player.Name) || !house.Roommates[player.Name].isFurniture) &&
                            characterData.AdminLVL < 6)
                        {
                            var lockpick = Repository.isItem(player, "inventory", ItemId.Lockpick);
                            var count = lockpick == null ? 0 : lockpick.Item.Count;
                            if (count == 0)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.LockpickNeedForHijackMebel), 3000);
                            }
                            else
                            {
                                if (objType == "BurglarProofSafe")
                                {
                                    Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                        LangFunc.GetText(LangType.Ru, DataName.SafeCantHijacked), 5000);
                                    return;
                                }

                                var memberFractionData = player.GetFractionMemberData();
                                if (memberFractionData != null)
                                    switch (Manager.FractionTypes[memberFractionData.Id])
                                    {
                                        case FractionsType.Mafia: // Mafia
                                        case FractionsType.Gangs: // Gangs
                                        case FractionsType.Bikers: // Bikers
                                            if (memberFractionData.Rank < 3)
                                            {
                                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                    LangFunc.GetText(LangType.Ru, DataName.HijackFrom3Rank), 3000);
                                                return;
                                            }

                                            break;
                                        default: // Организации с улучшением крайм-принадлежностей
                                            if (!player.IsOrganizationAccess(RankToAccess.OrgCrime))
                                                return;
                                            break;
                                    }

                                if (house.ItemsGot <= 0)
                                {
                                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                        LangFunc.GetText(LangType.Ru, DataName.MebelEmpty), 3000);
                                    return;
                                }

                                if (sessionData.IsHicjacking) return;
                                sessionData.IsHicjacking = true;
                                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.StartHijackMebel), 5000);
                                Trigger.PlayAnimation(player, "amb@code_human_wander_texting@male@base", "static", 39);
                                // Trigger.ClientEventInRange(player.Position, 250f, "PlayAnimToKey", player, false, "vzlommeb");
                                Main.OnAntiAnim(player);
                                Trigger.ClientEvent(player, "fullblockMove", true);
                                Trigger.ClientEvent(player, "freeze", true);
                                NAPI.Task.Run(() =>
                                {
                                    try
                                    {
                                        if (!player.IsCharacterData() || !sessionData.IsHicjacking) return;
                                        Trigger.StopAnimation(player);
                                        Main.OffAntiAnim(player);
                                        Trigger.ClientEvent(player, "fullblockMove", false);
                                        Trigger.ClientEvent(player, "freeze", false);
                                        sessionData.IsHicjacking = false;
                                        odata = FindObjectByID(entityid);
                                        if (odata == null || odata.entity == null || !odata.entity.Exists ||
                                            odata.entity.Position.DistanceTo(player.Position) >= 10)
                                        {
                                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                LangFunc.GetText(LangType.Ru, DataName.MebelTooFar), 3000);
                                            return;
                                        }

                                        lockpick = Repository.isItem(player, "inventory", ItemId.Lockpick);
                                        count = lockpick == null ? 0 : lockpick.Item.Count;
                                        if (count == 0)
                                        {
                                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                LangFunc.GetText(LangType.Ru, DataName.LockpickNeedForHijackMebel),
                                                3000);
                                            return;
                                        }

                                        house = HouseManager.Houses.FirstOrDefault(h =>
                                            h.ID == characterData.InsideHouseID);
                                        if (house == null)
                                        {
                                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                LangFunc.GetText(LangType.Ru, DataName.YouNotInHouse), 3000);
                                            return;
                                        }

                                        if (house.ItemsGot <= 0)
                                        {
                                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                LangFunc.GetText(LangType.Ru, DataName.MebelEmpty), 3000);
                                            return;
                                        }

                                        Repository.Remove(player, $"char_{characterData.UUID}", "inventory",
                                            ItemId.Lockpick);
                                        var luck = Main.rnd.Next(0, 100);
                                        switch (objType)
                                        {
                                            case "WeaponSafe": // Сейф с оружиями
                                                if (luck < 20)
                                                {
                                                    HouseHiJackItem(player, house, 0, odata.Id.ToString());
                                                    player.AddTableScore(TableTaskId.Item29);
                                                }
                                                else
                                                {
                                                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                        LangFunc.GetText(LangType.Ru, DataName.LockpickBroken), 3000);
                                                }

                                                break;
                                            case "SubjectSafe": // Мебель с патронами
                                                if (luck < 30)
                                                {
                                                    HouseHiJackItem(player, house, 1, odata.Id.ToString());
                                                    player.AddTableScore(TableTaskId.Item29);
                                                }
                                                else
                                                {
                                                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                        LangFunc.GetText(LangType.Ru, DataName.LockpickBroken), 3000);
                                                }

                                                break;
                                            case "ClothesSafe": // Мебель со шмотьём
                                                if (luck < 50)
                                                {
                                                    HouseHiJackItem(player, house, 2, odata.Id.ToString());
                                                    player.AddTableScore(TableTaskId.Item29);
                                                }
                                                else
                                                {
                                                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                        LangFunc.GetText(LangType.Ru, DataName.LockpickBroken), 3000);
                                                }

                                                break;
                                            default:
                                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                    LangFunc.GetText(LangType.Ru, DataName.LickpickError), 3000);
                                                return;
                                        }
                                    }
                                    catch (Exception e)
                                    {
                                        Log.Write($"objectSelected Task Exception: {e}");
                                    }
                                }, 10000);
                            }

                            return;
                        }

                        Repository.LoadOtherItemsData(player, $"furniture_{house.ID}", odata.Id.ToString(),
                            objType == "WeaponSafe" || objType == "BurglarProofSafe" ? 2 :
                            objType == "SubjectSafe" ? 3 : 4,
                            objType == "BurglarProofSafe" ? 50 : Repository.InventoryMaxSlots["furniture"]);
                        return;
                }
            }
            catch (Exception e)
            {
                Log.Write($"objectSelected Exception: {e}");
            }
        }

        public static void HouseHiJackItem(ExtPlayer player, House house, byte typesafe, string id)
        {
            try
            {
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                if (house == null || house.ID != characterData.InsideHouseID) return;
                if (house.ItemsGot <= 0)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.MebelEmpty), 3000);
                    return;
                }

                house.ItemsGot -= 1;
                var locationName = $"furniture_{house.ID}_{id}";

                if (Repository.ItemsData.ContainsKey(locationName))
                {
                    var _ItemsData = new List<InventoryItemData>();
                    foreach (var _InventoryItemsData in Repository.ItemsData[locationName].Values)
                    foreach (var itemData in _InventoryItemsData)
                    {
                        if (itemData.Value.ItemId == ItemId.Debug || itemData.Value.ItemId == ItemId.GasCan) continue;
                        _ItemsData.Add(itemData.Value);
                    }

                    InventoryItemData item = null;
                    if (_ItemsData.Count >= 1 && rnd.Next(0, 5) == 0)
                    {
                        if (_ItemsData.Count == 1)
                        {
                            item = _ItemsData[0];
                        }
                        else
                        {
                            var rndint = Main.rnd.Next(0, _ItemsData.Count);
                            if (rndint < _ItemsData.Count) item = _ItemsData[rndint];
                        }
                    }

                    switch (typesafe)
                    {
                        case 0:
                            GameLog.Money("system", $"player({characterData.UUID})", 1200,
                                $"hijackWeaponSafe({house.ID})");
                            Wallet.Change(player, 1200);
                            if (item != null)
                                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.SuccHijackWeaponSafeW), 5000);
                            else
                                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.SuccHijackWeaponSafe), 5000);
                            break;
                        case 1:
                            GameLog.Money("system", $"player({characterData.UUID})", 900,
                                $"hijackSubjectSafe({house.ID})");
                            Wallet.Change(player, 900);
                            if (item != null)
                                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.SuccHijackItemSafeW), 5000);
                            else
                                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.SuccHijackItemSafe), 5000);
                            break;
                        case 2:
                            GameLog.Money("system", $"player({characterData.UUID})", 600,
                                $"hijackClothesSafe({house.ID})");
                            Wallet.Change(player, 600);
                            if (item != null)
                                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.SuccHijackClothesSafeW), 5000);
                            else
                                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.SuccHijackClothesSafe), 5000);
                            break;
                        default:
                            Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.HijackError, house.ID), 5000);
                            return;
                    }

                    if (item != null)
                    {
                        Repository.ItemsDrop(player, new InventoryItemData(0, item.ItemId, item.Count, item.Data));
                        if (Repository.ItemsData.ContainsKey(locationName) &&
                            Repository.ItemsData[locationName].ContainsKey("furniture") &&
                            Repository.ItemsData[locationName]["furniture"].ContainsKey(item.Index))
                        {
                            var ItemIdDell = Repository.ItemsData[locationName]["furniture"][item.Index].ItemId;
                            Repository.ItemsData[locationName]["furniture"][item.Index].ItemId = ItemId.Debug;
                            Repository.UpdateSqlItemData(locationName, "furniture", item.Index,
                                Repository.ItemsData[locationName]["furniture"][item.Index], ItemIdDell);
                            Repository.ItemsData[locationName]["furniture"].TryRemove(item.Index, out _);
                        }
                    }
                }
                else
                {
                    GameLog.Money("system", $"player({characterData.UUID})", 600, $"hijackEmptySafe({house.ID})");
                    Wallet.Change(player, 600);
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.HijackEmptyMebel), 3000);
                }
            }
            catch (Exception e)
            {
                Log.Write($"HouseHiJackItem Exception: {e}");
            }
        }

        [RemoteEvent("beltSelected")]
        public static void BeltSelected(ExtPlayer player, bool toggle)
        {
            try
            {
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                if (!toggle)
                    Commands.RPChat("sme", player,
                        "пристегнул" + (characterData.Gender ? "" : "а") + " ремень безопасности");
                else
                    Commands.RPChat("sme", player,
                        "отстегнул" + (characterData.Gender ? "" : "а") + " ремень безопасности");
                BattlePass.Repository.UpdateReward(player, 86);
            }
            catch (Exception e)
            {
                Log.Write($"BeltSelected Exception: {e}");
            }
        }

        [RemoteEvent("vehicleSelected")]
        public static void vehicleSelected(ExtPlayer player, ExtVehicle vehicle, int index)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                if (Main.IHaveDemorgan(player)) return;
                if (VehicleManager.IsVehicleDeath(vehicle)) return;
                if (vehicle == null || player.Position.DistanceTo(vehicle.Position) > 5)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.CarTooFar), 3000);
                    return;
                }

                var access = true;
                switch (index)
                {
                    case 0:
                        if (characterData.DemorganTime >= 1 || characterData.ArrestTime >= 1) return;
                        access = VehicleManager.canAccessByNumber(player, vehicle.NumberPlate);
                        if (!access && characterData.AdminLVL < 3)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.NoKeysFromVeh), 3000);
                            return;
                        }

                        if (VehicleStreaming.GetDoorState(vehicle, DoorId.DoorHood) == DoorState.DoorClosed)
                        {
                            if (VehicleStreaming.GetLockState(vehicle))
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.NoCapotClosedCar), 3000);
                                return;
                            }

                            VehicleStreaming.SetDoorState(vehicle, DoorId.DoorHood, DoorState.DoorOpen);
                            BattlePass.Repository.UpdateReward(player, 87);
                        }
                        else
                        {
                            VehicleStreaming.SetDoorState(vehicle, DoorId.DoorHood, DoorState.DoorClosed);
                        }

                        return;
                    case 1:
                        if (characterData.DemorganTime >= 1 || characterData.ArrestTime >= 1) return;
                        if (VehicleStreaming.GetDoorState(vehicle, DoorId.DoorTrunk) == DoorState.DoorOpen)
                        {
                            Commands.RPChat("sme", player, "закрыл" + (characterData.Gender ? "" : "а") + " багажник");
                            VehicleStreaming.SetDoorState(vehicle, DoorId.DoorTrunk, DoorState.DoorClosed);
                            Repository.ItemsAllClose(VehicleManager.GetVehicleToInventory(vehicle.NumberPlate));
                        }
                        else
                        {
                            var fracId = player.GetFractionId();
                            var vehicleLocalData1 = vehicle.GetVehicleLocalData();
                            if (vehicleLocalData1 != null)
                            {
                                if (vehicleLocalData1.Access == VehicleAccess.Personal ||
                                    vehicleLocalData1.Access == VehicleAccess.Garage)
                                {
                                    access = VehicleManager.canAccessByNumber(player, vehicle.NumberPlate);
                                    if (!access && characterData.AdminLVL < 3)
                                    {
                                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                            LangFunc.GetText(LangType.Ru, DataName.NoKeysFromVeh), 3000);
                                        return;
                                    }
                                }
                                else if (vehicleLocalData1.Access == VehicleAccess.Fraction &&
                                         vehicleLocalData1.Fraction != fracId)
                                {
                                    if (!Configs.IsFractionPolic(fracId))
                                    {
                                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                            LangFunc.GetText(LangType.Ru, DataName.NoBagazhnikCar), 3000);
                                        return;
                                    }
                                }
                                else if (vehicleLocalData1.Access == VehicleAccess.Organization)
                                {
                                    var memberOrganizationData = player.GetOrganizationMemberData();
                                    if (memberOrganizationData == null ||
                                        vehicleLocalData1.Fraction != memberOrganizationData.Id)
                                    {
                                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                            LangFunc.GetText(LangType.Ru, DataName.NoBagazhnikCar), 3000);
                                        return;
                                    }

                                    if (vehicleLocalData1.MinRank > memberOrganizationData.Rank)
                                    {
                                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                            LangFunc.GetText(LangType.Ru, DataName.NoAccessToVeh), 3000);
                                        return;
                                    }
                                }
                                else if (vehicleLocalData1.Access == VehicleAccess.Admin && characterData.AdminLVL < 3)
                                {
                                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                        LangFunc.GetText(LangType.Ru, DataName.NoKeysFromVeh), 3000);
                                    return;
                                }

                                VehicleStreaming.SetDoorState(vehicle, DoorId.DoorTrunk, DoorState.DoorOpen);

                                Commands.RPChat("sme", player,
                                    "открыл" + (characterData.Gender ? "" : "а") + " багажник");
                            }
                        }

                        return;
                    case 2:
                        VehicleManager.ChangeVehicleDoors(player, vehicle);
                        return;
                    case 3:
                        var vehicleLocalData = vehicle.GetVehicleLocalData();
                        if (vehicleLocalData != null)
                        {
                            if (characterData.DemorganTime >= 1 || characterData.ArrestTime >= 1) return;
                            if (vehicle.Class == 13 || (vehicleLocalData.Access != VehicleAccess.Garage &&
                                                        vehicleLocalData.Access != VehicleAccess.Personal &&
                                                        vehicleLocalData.Access != VehicleAccess.Fraction &&
                                                        vehicleLocalData.Access != VehicleAccess.Organization &&
                                                        vehicleLocalData.Access != VehicleAccess.OrganizationGarage))
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.VehNoInventory), 3000);
                                return;
                            }

                            if (characterData.AdminLVL == 0 &&
                                VehicleStreaming.GetDoorState(vehicle, DoorId.DoorTrunk) == DoorState.DoorClosed)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.NoBagazhnikCarClosed), 3000);
                                return;
                            }

                            var number = vehicle.NumberPlate;
                            var vehicleData = VehicleManager.GetVehicleToNumber(number);
                            if (vehicleData != null && vehicleData.Health == 0)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.CarDead), 3000);
                                return;
                            }

                            if (vehicleLocalData.BagInUse)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.OtherUsingBagazh), 3000);
                                return;
                            }

                            vehicleLocalData.BagInUse = true;
                            sessionData.SelectData.SelectedVeh = vehicle;
                            var isArmyCar = vehicleLocalData.Fraction == (int)Fractions.Models.Fractions.ARMY;
                            Repository.LoadOtherItemsData(player, "vehicle",
                                vehicleData != null ? vehicleData.SqlId.ToString() : number, 1,
                                vMain.GetMaxSlots(vehicle.Model), "", isArmyCar);
                        }

                        return;
                    case 5:
                        Ticket.OpenTicket(player, vehicle);
                        return;
                    case 6:
                        vehicleLocalData = vehicle.GetVehicleLocalData();
                        if (vehicleLocalData != null)
                        {
                            var memberFractionData = player.GetFractionMemberData();
                            if (memberFractionData != null)
                                switch (Manager.FractionTypes[memberFractionData.Id])
                                {
                                    case FractionsType.Mafia: // Mafia
                                    case FractionsType.Gangs: // Gangs
                                    case FractionsType.Bikers: // Bikers
                                        if (memberFractionData.Rank < 3)
                                        {
                                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                LangFunc.GetText(LangType.Ru, DataName.HijackBagazh3Rank), 3000);
                                            return;
                                        }

                                        break;
                                    default: // Организации с улучшением крайм-принадлежностей
                                        if (!player.IsOrganizationAccess(RankToAccess.OrgCrime)) return;
                                        break;
                                }

                            if (characterData.DemorganTime >= 1 || characterData.ArrestTime >= 1 ||
                                sessionData.IsHicjacking) return;
                            if (sessionData.InsideSafeZone != -1)
                            {
                                Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.HijackSafeZone), 3000);
                                return;
                            }

                            if (vehicleLocalData.Access != VehicleAccess.Personal &&
                                vehicleLocalData.Access != VehicleAccess.Fraction &&
                                vehicleLocalData.Access != VehicleAccess.Organization)
                            {
                                Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.VehEmptyBagazh), 3000);
                                return;
                            }

                            if (!FunctionsAccess.IsWorking("lockpick"))
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.FunctionOffByAdmins), 3000);
                                return;
                            }

                            var lockpick = Repository.isItem(player, "inventory", ItemId.Lockpick);
                            var count = lockpick == null ? 0 : lockpick.Item.Count;
                            if (count == 0)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.HijackBagazhWithLockpickOnly), 7000);
                                return;
                            }

                            var number = vehicle.NumberPlate;
                            var vehicleData = VehicleManager.GetVehicleToNumber(number);
                            if (vehicleData != null)
                            {
                                if (vehicleData.Holder.Equals(player.Name)) return;
                                if (vehicleData.HijackTime > DateTime.Now)
                                {
                                    Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                                        LangFunc.GetText(LangType.Ru, DataName.VehEmptyBagazh), 3000);
                                    return;
                                }
                            }
                            else if (vehicleLocalData.VehHijackTime > DateTime.Now)
                            {
                                Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.VehEmptyBagazh), 3000);
                                return;
                            }

                            sessionData.IsHicjacking = true;
                            Repository.Remove(player, $"char_{characterData.UUID}", "inventory", ItemId.Lockpick);
                            CallPoliceHijack(player, 1, Convert.ToString(vehicle.Value));
                            Trigger.PlayAnimation(player, "mini@safe_cracking", "idle_base", 39);
                            // Trigger.ClientEventInRange(player.Position, 250f, "PlayAnimToKey", player, false, "vzlomsafe");
                            Commands.RPChat("sme", player, LangFunc.GetText(LangType.Ru, DataName.breakingbagazhnik));
                            Trigger.ClientEvent(player, "fullblockMove", true);
                            Trigger.ClientEvent(player, "freeze", true);
                            NAPI.Task.Run(() =>
                            {
                                try
                                {
                                    if (!player.IsCharacterData() || !sessionData.IsHicjacking) return;
                                    Trigger.StopAnimation(player);
                                    Trigger.ClientEvent(player, "fullblockMove", false);
                                    Trigger.ClientEvent(player, "freeze", false);
                                    sessionData.IsHicjacking = false;
                                    if (vehicle == null || !vehicle.Exists ||
                                        vehicle.Position.DistanceTo(player.Position) > 10 ||
                                        UpdateData.GetVehicleDimension(vehicle) !=
                                        UpdateData.GetPlayerDimension(player) || vehicleLocalData == null) return;
                                    var random = new Random().Next(0, 100);
                                    if (random >= 85)
                                    {
                                        vehicleLocalData = vehicle.GetVehicleLocalData();
                                        number = vehicle.NumberPlate;

                                        var vehicleData = VehicleManager.GetVehicleToNumber(number);
                                        if (vehicleData != null)
                                        {
                                            if (vehicleData.HijackTime > DateTime.Now)
                                            {
                                                Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                                                    LangFunc.GetText(LangType.Ru, DataName.VehEmptyBagazh), 3000);
                                                return;
                                            }

                                            vehicleData.HijackTime = DateTime.Now.AddMinutes(30);
                                        }
                                        else
                                        {
                                            if (vehicleLocalData.VehHijackTime > DateTime.Now)
                                            {
                                                Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                                                    LangFunc.GetText(LangType.Ru, DataName.VehEmptyBagazh), 3000);
                                                return;
                                            }

                                            vehicleLocalData.VehHijackTime = DateTime.Now.AddMinutes(30);
                                        }

                                        var locationName = VehicleManager.GetVehicleToInventory(number);
                                        var _ItemsData = new List<InventoryItemData>();
                                        GameLog.Money("system", $"player({characterData.UUID})", 600,
                                            $"hijackVehicle({number})");
                                        Wallet.Change(player, 600);
                                        if (Repository.ItemsData.ContainsKey(locationName))
                                        {
                                            foreach (var _InventoryItemsData in Repository.ItemsData[locationName]
                                                         .Values)
                                            foreach (var itemData in _InventoryItemsData)
                                            {
                                                if (itemData.Value.ItemId == ItemId.Debug ||
                                                    itemData.Value.ItemId == ItemId.GasCan) continue;
                                                _ItemsData.Add(itemData.Value);
                                            }

                                            InventoryItemData item = null;
                                            if (_ItemsData.Count >= 1 && rnd.Next(0, 5) == 0)
                                            {
                                                if (_ItemsData.Count == 1)
                                                {
                                                    item = _ItemsData[0];
                                                }
                                                else
                                                {
                                                    random = new Random().Next(0, _ItemsData.Count);
                                                    if (random < _ItemsData.Count) item = _ItemsData[random];
                                                }
                                            }

                                            if (item != null)
                                            {
                                                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                                    "Вы успешно взломали авто и нашли в нём 600$, предмет а так же завели его.",
                                                    8000);
                                                VehicleStreaming.SetEngineState(vehicle, true);
                                                VehicleStreaming.SetLockStatus(vehicle, false);
                                                Repository.ItemsDrop(player,
                                                    new InventoryItemData(0, item.ItemId, item.Count, item.Data));
                                                if (Repository.ItemsData.ContainsKey(locationName) &&
                                                    Repository.ItemsData[locationName].ContainsKey("vehicle") &&
                                                    Repository.ItemsData[locationName]["vehicle"]
                                                        .ContainsKey(item.Index))
                                                {
                                                    var ItemIdDell =
                                                        Repository.ItemsData[locationName]["vehicle"][item.Index]
                                                            .ItemId;
                                                    Repository.ItemsData[locationName]["vehicle"][item.Index].ItemId =
                                                        ItemId.Debug;
                                                    Repository.UpdateSqlItemData(locationName, "vehicle", item.Index,
                                                        Repository.ItemsData[locationName]["vehicle"][item.Index],
                                                        ItemIdDell);
                                                    Repository.ItemsData[locationName]["vehicle"]
                                                        .TryRemove(item.Index, out _);
                                                }
                                            }
                                            else
                                            {
                                                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                                    LangFunc.GetText(LangType.Ru, DataName.BagazhSuccess), 8000);
                                            }

                                            VehicleStreaming.SetEngineState(vehicle, true);
                                            VehicleStreaming.SetLockStatus(vehicle, false);
                                            player.AddTableScore(TableTaskId.Item28);
                                        }
                                        else
                                        {
                                            Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                                LangFunc.GetText(LangType.Ru, DataName.BugazhSuccessEmpty), 8000);
                                            VehicleStreaming.SetEngineState(vehicle, true);
                                            VehicleStreaming.SetLockStatus(vehicle, false);
                                            player.AddTableScore(TableTaskId.Item28);
                                        }
                                    }
                                    else
                                    {
                                        Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                                            LangFunc.GetText(LangType.Ru, DataName.LockpickBroken), 3000);
                                    }
                                }
                                catch (Exception e)
                                {
                                    Log.Write($"vehicleSelected Task #1 Exception: {e}");
                                }
                            }, 10000);
                        }

                        break;
                    case 7:
                        vehicleLocalData = vehicle.GetVehicleLocalData();
                        if (vehicleLocalData != null)
                        {
                            if (characterData.DemorganTime >= 1 || characterData.ArrestTime >= 1 ||
                                player.IsInVehicle || sessionData.AntiAnimDown) return;
                            if (player.Position.DistanceTo(vehicle.Position) > 2)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.CarTooFar), 5000);
                                return;
                            }

                            if (sessionData.ActiveWeap.Item != null)
                            {
                                if (sessionData.ActiveWeap.Index == -1)
                                {
                                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                        LangFunc.GetText(LangType.Ru, DataName.MustWrench), 2000);
                                    return;
                                }

                                var Item = Repository.GetItemData(player, "fastSlots", sessionData.ActiveWeap.Index);
                                if (Item.ItemId == ItemId.Debug)
                                {
                                    sessionData.ActiveWeap = new ItemStruct("", -1, null);
                                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                        LangFunc.GetText(LangType.Ru, DataName.MustWrench), 2000);
                                }
                                else if (Item.ItemId == ItemId.Wrench)
                                {
                                    player.Rotation = new Vector3(player.Rotation.X, player.Rotation.Y,
                                        player.Rotation.Z - 180);
                                    Trigger.ClientEvent(player, "blockMove", true);
                                    Main.OnAntiAnim(player);
                                    Trigger.PlayAnimation(player, "anim@amb@garage@chassis_repair@",
                                        "base_amy_skater_01", 39);
                                    // Trigger.ClientEventInRange(player.Position, 250f, "PlayAnimToKey", player, false, "repaircar");
                                    Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                                        LangFunc.GetText(LangType.Ru, DataName.StartRepairing, vehicle.NumberPlate),
                                        5000);
                                    NAPI.Task.Run(() =>
                                    {
                                        try
                                        {
                                            if (!player.IsCharacterData()) return;
                                            Main.OffAntiAnim(player);
                                            Trigger.ClientEvent(player, "blockMove", false);
                                            Trigger.StopAnimation(player);
                                            NAPI.Entity.SetEntityPosition(player,
                                                player.Position + new Vector3(0, 0, 0.2));
                                            if (vehicle == null || vehicleLocalData == null ||
                                                player.Position.DistanceTo(vehicle.Position) > 3)
                                            {
                                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                    LangFunc.GetText(LangType.Ru, DataName.CarTooFar), 3000);
                                                return;
                                            }

                                            if (sessionData.ActiveWeap.Item != null)
                                            {
                                                if (sessionData.ActiveWeap.Index == -1) return;
                                                Item = Repository.GetItemData(player, "fastSlots",
                                                    sessionData.ActiveWeap.Index);
                                                if (Item.ItemId != ItemId.Wrench)
                                                {
                                                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                                        LangFunc.GetText(LangType.Ru, DataName.MustWrench), 2000);
                                                    return;
                                                }
                                            }
                                            else
                                            {
                                                return;
                                            }

                                            VehicleManager.RepairCar(vehicle);
                                            NAPI.Entity.SetEntityPosition(vehicle,
                                                vehicle.Position + new Vector3(0, 0, 0.5f));
                                            NAPI.Entity.SetEntityRotation(vehicle,
                                                new Vector3(0, 0, vehicle.Rotation.Z));
                                            var ItemStruct = sessionData.ActiveWeap;
                                            Repository.RemoveIndex(player, "fastSlots", ItemStruct.Index);
                                            Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                                LangFunc.GetText(LangType.Ru, DataName.SucRepair), 3000);
                                            BattlePass.Repository.UpdateReward(player, 12);
                                        }
                                        catch (Exception e)
                                        {
                                            Log.Write($"vehicleSelected Task #2 Exception: {e}");
                                        }
                                    }, 15000);
                                }
                                else
                                {
                                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                        LangFunc.GetText(LangType.Ru, DataName.MustWrench), 2000);
                                }
                            }
                            else
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.MustWrench), 2000);
                            }
                        }

                        break;
                    case 10:
                        vehicleLocalData = vehicle.GetVehicleLocalData();
                        if (vehicleLocalData != null)
                        {
                            if (characterData.DemorganTime >= 1 || characterData.ArrestTime >= 1 ||
                                sessionData.Following != null || sessionData.CarryPlayer != null ||
                                sessionData.Follower != null || UpdateData.GetPlayerDimension(player) != 0) return;
                            if (sessionData.CuffedData.Cuffed)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.IsCuffed), 3000);
                                return;
                            }

                            if (vehicleLocalData.AttachToPlayer != null)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.SomebodyInBagazh), 3000);
                                return;
                            }

                            if (VehicleStreaming.GetDoorState(vehicle, DoorId.DoorTrunk) == DoorState.DoorClosed)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.BagazhClosed), 3000);
                                return;
                            }

                            sessionData.AttachToVehicle = vehicle;
                            vehicleLocalData.AttachToPlayer = player;
                            Trigger.ClientEventInRange(player.Position, 250f, "client.vehicle.trunk.attachPlayer",
                                player.Value, vehicle.Value);
                            Trigger.PlayAnimation(player, "timetable@floyd@cryingonbed@base", "base", 33);
                            // Trigger.ClientEventInRange(player.Position, 250f, "PlayAnimToKey", player, false, "bagazhnik");
                            player.SetSharedData("AttachToVehicle", vehicle.Value);
                            Trigger.ClientEvent(player, "setPocketEnabled", true);
                            Commands.RPChat("sme", player,
                                "залез" + (characterData.Gender ? "" : "ла") + " в багажник");
                            BattlePass.Repository.UpdateReward(player, 88);
                        }

                        return;
                    case 11:
                        vehicleLocalData = vehicle.GetVehicleLocalData();
                        if (vehicleLocalData != null)
                        {
                            if (characterData.DemorganTime >= 1 || characterData.ArrestTime >= 1) return;
                            if (vehicleLocalData.AttachToPlayer == null)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.NobodyInBagazh), 3000);
                                return;
                            }

                            if (VehicleStreaming.GetDoorState(vehicle, DoorId.DoorTrunk) == DoorState.DoorClosed)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.BagazhClosed), 3000);
                                return;
                            }

                            var target = vehicleLocalData.AttachToPlayer;
                            vehicleLocalData.AttachToPlayer = null;
                            if (!target.IsCharacterData()) return;
                            var targetSessionData = target.GetSessionData();
                            if (targetSessionData == null) return;
                            targetSessionData.AttachToVehicle = null;
                            Trigger.ClientEventInRange(target.Position, 250f, "client.vehicle.trunk.detachPlayer",
                                target.Value, vehicle.Value);
                            Trigger.StopAnimation(target);
                            target.ResetSharedData("AttachToVehicle");
                            Trigger.ClientEvent(target, "setPocketEnabled", false);
                            Commands.RPChat("sme", player,
                                "вытащил" + (characterData.Gender ? "" : "а") + $" {target.Name} из багажника");
                        }

                        return;
                    case 12:
                        vehicleLocalData = vehicle.GetVehicleLocalData();
                        if (vehicleLocalData != null)
                        {
                            var number = vehicleLocalData.NumberPlate;
                            var vehicleData = VehicleManager.GetVehicleToNumber(number);
                            if (vehicleData == null || !vehicleData.Holder.Equals(player.Name))
                            {
                                Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                                    "Сменить можно только на своем авто", 3000);
                                return;
                            }

                            if (sessionData.ActiveWeap.Item == null || sessionData.ActiveWeap.Index == -1)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    "В руках должен быть номерной знак", 2000);
                                return;
                            }

                            var Item = Repository.GetItemData(player, "fastSlots", sessionData.ActiveWeap.Index);
                            if (Item.ItemId != ItemId.VehicleNumber)
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    "В руках должен быть номерной знак", 2000);
                                return;
                            }

                            var newNum = Item.Data;

                            Item.Data = number;
                            Repository.SetItemData(player, "fastSlots", sessionData.ActiveWeap.Index, Item, true);

                            NAPI.Vehicle.SetVehicleNumberPlate(vehicle, newNum);

                            if (VehicleManager.Vehicles.ContainsKey(number))
                                VehicleManager.Vehicles.TryRemove(number, out _);

                            vehicleData.Number = newNum;
                            VehicleManager.Vehicles[newNum] = vehicleData;

                            VehicleManager.VehiclesSqlIdToNumber[vehicleData.SqlId] = newNum;

                            VehicleData.LocalData.Repository.Delete(vehicleLocalData.Access, number);
                            VehicleData.LocalData.Repository.VehicleNumberToHandle[vehicleLocalData.Access][newNum] =
                                vehicle;

                            vehicleLocalData.NumberPlate = newNum;

                            VehicleManager.SaveNumber(newNum);

                            Trigger.PlayAnimation(player, "mini@safe_cracking", "idle_base", 39);
                            // Trigger.ClientEventInRange(player.Position, 250f, "PlayAnimToKey", player, false, "vzlomsafe");
                            Commands.RPChat("sme", player, "меняет номера");
                            Trigger.ClientEvent(player, "fullblockMove", true);
                            Trigger.ClientEvent(player, "freeze", true);
                            NAPI.Task.Run(() =>
                            {
                                if (!player.IsCharacterData()) return;
                                Trigger.StopAnimation(player);
                                Trigger.ClientEvent(player, "fullblockMove", false);
                                Trigger.ClientEvent(player, "freeze", false);
                            }, 3500);
                        }

                        break;
                }
            }
            catch (Exception e)
            {
                Log.Write($"vehicleSelected Exception: {e}");
            }
        }

        public static void onPlayerDisconnectedhandler(ExtPlayer player)
        {
            try
            {
                if (Police.PoliceCalls.ContainsKey(player))
                {
                    var blip = Police.PoliceCalls[player];
                    if (blip != null && blip.Exists) blip.Delete();
                    Police.PoliceCalls.Remove(player);
                }
            }
            catch (Exception e)
            {
                Log.Write($"onPlayerDisconnectedhandler Exception: {e}");
            }
        }

        public static void CallPoliceHijack(ExtPlayer player, byte type, string vnumber)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                onPlayerDisconnectedhandler(player);
                var Blip = (ExtBlip)NAPI.Blip.CreateBlip(0, player.Position, 1, 70, alpha: 0, drawDistance: 0,
                    shortRange: true, rotation: 0, dimension: 0);
                if (type == 0)
                {
                    Manager.sendFractionMessage((int)Fractions.Models.Fractions.POLICE,
                        "!{#F08080}[F] " + LangFunc.GetText(LangType.Ru, DataName.SignalHouse, sessionData.HouseID),
                        true);
                    Manager.sendFractionMessage((int)Fractions.Models.Fractions.SHERIFF,
                        "!{#F08080}[F] " + LangFunc.GetText(LangType.Ru, DataName.SignalHouse, sessionData.HouseID),
                        true);
                    Manager.sendFractionMessage((int)Fractions.Models.Fractions.FIB,
                        "!{#F08080}[F] " + LangFunc.GetText(LangType.Ru, DataName.SignalHouse, sessionData.HouseID),
                        true);

                    Blip.Name = $"Сигнализация дома {sessionData.HouseID}";
                    Blip.Transparency = 0;
                    Police.PoliceHouseCalls.Add(sessionData.HouseID, Blip);

                    var target = (ExtPlayer)NAPI.Player.GetPlayerFromName(vnumber);
                    if (target.IsCharacterData())
                        Notify.Send(target, NotifyType.Warning, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.YouHouseSignal), 5000);

                    try
                    {
                        var house = HouseManager.GetHouse(vnumber);
                        if (house.Roommates.Count > 0)
                            foreach (var foreachPlayer in Character.Repository.GetPlayers())
                            {
                                if (!foreachPlayer.IsCharacterData()) continue;
                                if (house.Roommates.ContainsKey(foreachPlayer.Name))
                                    Notify.Send(foreachPlayer, NotifyType.Warning, NotifyPosition.BottomCenter,
                                        LangFunc.GetText(LangType.Ru, DataName.YouHouseSignal), 5000);
                            }
                    }
                    catch (Exception e)
                    {
                        Log.Write($"RoommatesNotify Exception: {e}");
                    }

                    if (player.HasSharedData("IS_MASK") && !player.GetSharedData<bool>("IS_MASK") &&
                        (characterData.WantedLVL == null || characterData.WantedLVL.Level != 5))
                    {
                        Police.setPlayerWantedLevel(player,
                            new WantedLevel(5, LangFunc.GetText(LangType.Ru, DataName.Police), DateTime.Now,
                                LangFunc.GetText(LangType.Ru, DataName.ReasonHijackHouse)));
                        Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.SignalSrabotalWanted), 3000);
                    }
                    else
                    {
                        Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.SignalSrabotal), 1000);
                    }
                }
                else
                {
                    Manager.sendFractionMessage((int)Fractions.Models.Fractions.POLICE,
                        "!{#F08080}[F] " + LangFunc.GetText(LangType.Ru, DataName.SignalVeh, vnumber), true);
                    Manager.sendFractionMessage((int)Fractions.Models.Fractions.SHERIFF,
                        "!{#F08080}[F] " + LangFunc.GetText(LangType.Ru, DataName.SignalVeh, vnumber), true);
                    Manager.sendFractionMessage((int)Fractions.Models.Fractions.FIB,
                        "!{#F08080}[F] " + LangFunc.GetText(LangType.Ru, DataName.SignalVeh, vnumber), true);

                    Blip.Name = $"Сигнализация машины {vnumber}";
                    Blip.Transparency = 0;
                    if (Police.PoliceCarsCalls.ContainsKey(Convert.ToInt32(vnumber)))
                    {
                        Blip blip = Police.PoliceCarsCalls[Convert.ToInt32(vnumber)];

                        if (blip != null && blip.Exists)
                            blip.Delete();
                    }

                    Police.PoliceCarsCalls[Convert.ToInt32(vnumber)] = Blip;

                    var maskItem = Repository.isItem(player, "accessories", ItemId.Mask);
                    if ((maskItem == null || !Repository.IsBeard(characterData.Gender, maskItem.Item)) &&
                        (!player.HasSharedData("IS_MASK") ||
                         (player.HasSharedData("IS_MASK") && !player.GetSharedData<bool>("IS_MASK"))) &&
                        (characterData.WantedLVL == null || characterData.WantedLVL.Level != 5))
                    {
                        Police.setPlayerWantedLevel(player,
                            new WantedLevel(5, LangFunc.GetText(LangType.Ru, DataName.Police), DateTime.Now,
                                LangFunc.GetText(LangType.Ru, DataName.ReasonHijackVeh)));
                        Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.SignalSrabotalWanted), 3000);
                    }
                    else
                    {
                        Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.SignalSrabotal), 1000);
                    }
                }

                NAPI.Task.Run(() =>
                {
                    try
                    {
                        onPlayerDisconnectedhandler(player);
                    }
                    catch (Exception e)
                    {
                        Log.Write($"CallPoliceHijack Task Exception: {e}");
                    }
                }, 60000);
            }
            catch (Exception e)
            {
                Log.Write($"CallPoliceHijack Exception: {e}");
            }
        }

        [ServerEvent(Event.PlayerDeath)]
        public void onPlayerDeathHandler(ExtPlayer player, ExtPlayer entityKiller, uint weapon)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                if (!player.IsCharacterData()) return;
                if (sessionData.AttachToVehicle != null)
                {
                    var vehicle = sessionData.AttachToVehicle;
                    var vehicleLocalData = vehicle.GetVehicleLocalData();
                    if (vehicleLocalData != null) vehicleLocalData.AttachToPlayer = null;
                    sessionData.AttachToVehicle = null;
                    Trigger.ClientEventInRange(player.Position, 250f, "client.vehicle.trunk.detachPlayer", player.Value,
                        vehicle.Value, false);
                    Trigger.StopAnimation(player);
                    player.ResetSharedData("AttachToVehicle");
                    Trigger.ClientEvent(player, "setPocketEnabled", false);
                }
            }
            catch (Exception e)
            {
                Log.Write($"onPlayerDeathHandler Exception: {e}");
            }
        }

        [RemoteEvent("server.vehicle.detachPlayer")]
        public static void DetachPlayer(ExtPlayer player)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                var vehicle = sessionData.AttachToVehicle;
                if (vehicle == null) return;
                var vehicleLocalData = vehicle.GetVehicleLocalData();
                if (vehicleLocalData != null)
                {
                    if (vehicleLocalData.AttachToPlayer == null)
                    {
                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.NobodyInBagazh), 3000);
                        return;
                    }

                    if (VehicleStreaming.GetDoorState(vehicle, DoorId.DoorTrunk) == DoorState.DoorClosed)
                    {
                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.BagazhClosed), 3000);
                        return;
                    }

                    vehicleLocalData.AttachToPlayer = null;
                }

                sessionData.AttachToVehicle = null;
                Trigger.ClientEventInRange(player.Position, 250f, "client.vehicle.trunk.detachPlayer", player.Value,
                    vehicle.Value);
                Trigger.StopAnimation(player);
                player.ResetSharedData("AttachToVehicle");
                Trigger.ClientEvent(player, "setPocketEnabled", false);
                Commands.RPChat("sme", player, "вылез" + (characterData.Gender ? "" : "ла") + " из багажника");
            }
            catch (Exception e)
            {
                Log.Write($"DetachPlayer Exception: {e}");
            }
        }

        [RemoteEvent("pSelected")]
        public static void playerSelected(ExtPlayer player, ExtPlayer target, string action)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                var targetSessionData = target.GetSessionData();
                if (targetSessionData == null) return;
                var targetCharacterData = target.GetCharacterData();
                if (targetCharacterData == null) return;
                if (player.Position.DistanceTo(target.Position) > 3)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerTooFar), 3000);
                    return;
                }

                if (characterData.DemorganTime >= 1) return;
                if (targetCharacterData.DemorganTime >= 1) return;
                sessionData.SelectData.SelectedPlayer = target;
                switch (action)
                {
                    case "handshake":
                        if (player.IsInVehicle) return;
                        playerHandshakeTarget(player, target);
                        return;
                    case "leadaway":
                        if (player.IsInVehicle) return;
                        FractionCommands.targetFollowPlayer(player, target);
                        return;
                    case "givemoney":
                        if (characterData.LVL < 1)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.flvltotransact), 3000);
                            return;
                        }

                        if (!FunctionsAccess.IsWorking("transfer"))
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.FunctionOffByAdmins), 3000);
                            return;
                        }

                        Trigger.ClientEvent(player, "openInput", LangFunc.GetText(LangType.Ru, DataName.GiveMoney),
                            LangFunc.GetText(LangType.Ru, DataName.SumBucks), 4, "player_givemoney");
                        return;
                    case "handsup":
                        if (player.IsInVehicle) return;
                        FractionCommands.playerHandsupOffer(player, target);
                        return;
                    case "rob":
                        if (player.IsInVehicle) return;
                        FractionCommands.robberyTarget(player, target);
                        return;
                    case "Отпустить":
                        if (player.IsInVehicle) return;

                        if (targetSessionData.Following == null)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.PlayerNoFollowing), 3000);
                            return;
                        }

                        if (sessionData.Follower != target)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.SomebodyFollowing), 3000);
                            return;
                        }

                        FractionCommands.unFollow(player, target);
                        return;
                    case "search":
                    {
                        if (player.IsInVehicle) return;

                        var memberFractionData = player.GetFractionMemberData();
                        if (memberFractionData == null)
                            return;

                        if (!sessionData.WorkData.OnDuty &&
                            Manager.FractionTypes[memberFractionData.Id] == FractionsType.Gov)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.WorkDayNotStarted), 3000);
                            return;
                        }

                        switch (memberFractionData.Id)
                        {
                            case 6:
                                switch (memberFractionData.Rank)
                                {
                                    case 4:
                                    case 7:
                                    case 10:
                                    case 13:
                                    case 16:
                                        break;
                                    default:
                                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                            LangFunc.GetText(LangType.Ru, DataName.NoDostup), 3000);
                                        return;
                                }

                                break;
                            case 14:
                                if (memberFractionData.Rank <= 9)
                                {
                                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                        LangFunc.GetText(LangType.Ru, DataName.NoDostup), 3000);
                                    return;
                                }

                                break;
                        }

                        if (!targetSessionData.CuffedData.Cuffed)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.NoCuffed), 3000);
                            return;
                        }

                        Commands.RPChat("sme", player, LangFunc.GetText(LangType.Ru, DataName.SearchingTarget), target);
                        player.AddTableScore(TableTaskId.Item13);

                        var _ItemNames = new List<string>();
                        var _Weapons = new List<string>();


                        var locationName = $"char_{targetCharacterData.UUID}";
                        ItemsInfo ItemInfo;
                        if (Repository.ItemsData.ContainsKey(locationName))
                            foreach (var _InventoryItemsData in Repository.ItemsData[locationName].Values)
                            foreach (var itemData in _InventoryItemsData)
                            {
                                ItemInfo = Repository.ItemsInfo[itemData.Value.ItemId];
                                if (itemData.Value.ItemId == ItemId.Debug) continue;
                                if (ItemInfo.functionType == newItemType.Clothes && itemData.Value.ItemId != ItemId.Bag)
                                    continue;
                                if (ItemInfo.functionType == newItemType.Weapons)
                                    _Weapons.Add($"{ItemInfo.Name} {itemData.Value.Data}");
                                else if (itemData.Value.ItemId != ItemId.Bag)
                                    _ItemNames.Add($"{ItemInfo.Name} x{itemData.Value.Count}");
                            }

                        var BagsSqlId = Repository.isBackpackItemsData(target);
                        if (BagsSqlId != 0 && Repository.ItemsData.ContainsKey($"backpack_{BagsSqlId}") &&
                            Repository.ItemsData[$"backpack_{BagsSqlId}"].ContainsKey("backpack"))
                            foreach (var itemData in Repository.ItemsData[$"backpack_{BagsSqlId}"]["backpack"])
                            {
                                ItemInfo = Repository.ItemsInfo[itemData.Value.ItemId];
                                if (itemData.Value.ItemId == ItemId.Debug) continue;
                                if (ItemInfo.functionType == newItemType.Clothes) continue;
                                if (ItemInfo.functionType == newItemType.Weapons)
                                    _Weapons.Add(LangFunc.GetText(LangType.Ru, DataName.inabag, ItemInfo.Name,
                                        itemData.Value.Data));
                                else
                                    _ItemNames.Add(LangFunc.GetText(LangType.Ru, DataName.inabag, ItemInfo.Name,
                                        itemData.Value.Count));
                            }

                        var data1 = new SearchObject();
                        data1.Name = target.Name.Replace('_', ' ');
                        data1.Weapons = _Weapons;
                        data1.Items = _ItemNames;

                        Trigger.ClientEvent(player, "newPassport", target, targetCharacterData.UUID);
                        Trigger.ClientEvent(player, "bsearchOpen", JsonConvert.SerializeObject(data1));
                    }
                        return;
                    case "Посмотреть паспорт":
                    {
                        if (player.IsInVehicle) return;

                        var targetFracId = target.GetFractionId();

                        if (!sessionData.WorkData.OnDuty && Manager.FractionTypes[targetFracId] == FractionsType.Gov)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.WorkDayNotStarted), 3000);
                            return;
                        }

                        if (!targetSessionData.CuffedData.Cuffed)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.NoCuffed), 3000);
                            return;
                        }

                        Commands.RPChat("sme", player, LangFunc.GetText(LangType.Ru, DataName.LooksPassport), target);

                        var fraction = targetFracId > (int)Fractions.Models.Fractions.None
                            ? Manager.FractionNames[targetFracId]
                            : LangFunc.GetText(LangType.Ru, DataName.No);
                        if ((targetFracId >= (int)Fractions.Models.Fractions.FAMILY &&
                             targetFracId <= (int)Fractions.Models.Fractions.BLOOD) ||
                            (targetFracId >= (int)Fractions.Models.Fractions.LCN &&
                             targetFracId <= (int)Fractions.Models.Fractions.ARMENIAN))
                            fraction = LangFunc.GetText(LangType.Ru, DataName.No);
                        var work = targetCharacterData.WorkID > 0
                            ? WorkManager.JobStats[targetCharacterData.WorkID - 1]
                            : LangFunc.GetText(LangType.Ru, DataName.NoWorker);
                        var data2 = new List<object>
                        {
                            targetCharacterData.UUID,
                            targetCharacterData.FirstName,
                            targetCharacterData.LastName,
                            targetCharacterData.CreateDate.ToString("dd.MM.yyyy"),
                            targetCharacterData.Gender
                                ? LangFunc.GetText(LangType.Ru, DataName.Mans)
                                : LangFunc.GetText(LangType.Ru, DataName.Womens),
                            fraction,
                            work
                        };
                        var json = JsonConvert.SerializeObject(data2);
                        Trigger.ClientEvent(player, "passport", json);
                        Trigger.ClientEvent(player, "newPassport", target, targetCharacterData.UUID);
                    }
                        return;
                    case "Посмотреть лицензии":
                    {
                        if (player.IsInVehicle) return;

                        if (!sessionData.WorkData.OnDuty &&
                            Manager.FractionTypes[player.GetFractionId()] == FractionsType.Gov)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.WorkDayNotStarted), 3000);
                            return;
                        }

                        if (!targetSessionData.CuffedData.Cuffed)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.NoCuffed), 3000);
                            return;
                        }

                        Commands.RPChat("sme", player, LangFunc.GetText(LangType.Ru, DataName.LooksLic), target);

                        var lic = "";
                        for (var i = 0; i < targetCharacterData.Licenses.Count; i++)
                            if (targetCharacterData.Licenses[i])
                                lic += $"{Main.LicWords[i]} / ";
                        if (lic == "") lic = LangFunc.GetText(LangType.Ru, DataName.Nothing);

                        var data = new List<string>
                        {
                            targetCharacterData.FirstName,
                            targetCharacterData.LastName,
                            targetCharacterData.CreateDate.ToString("dd.MM.yyyy"),
                            targetCharacterData.Gender
                                ? LangFunc.GetText(LangType.Ru, DataName.Mans)
                                : LangFunc.GetText(LangType.Ru, DataName.Womens),
                            lic
                        };

                        var json = JsonConvert.SerializeObject(data);
                        Trigger.ClientEvent(player, "licenses", json);
                    }
                        return;
                    case "takegun":
                        if (player.IsInVehicle) return;

                        playerTakeGuns(player, target);
                        return;
                    case "takeillegal":
                        if (player.IsInVehicle) return;

                        playerTakeIlleagal(player, target);
                        return;
                    case "sellkit":

                        if (!sessionData.WorkData.OnDuty &&
                            Manager.FractionTypes[player.GetFractionId()] == FractionsType.Gov)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.WorkDayNotStarted), 3000);
                            return;
                        }

                        Trigger.ClientEvent(player, "openInput", LangFunc.GetText(LangType.Ru, DataName.OfferHealth),
                            LangFunc.GetText(LangType.Ru, DataName.SumBucks), 4, "player_medkit");
                        return;
                    case "offerheal":

                        if (!sessionData.WorkData.OnDuty &&
                            Manager.FractionTypes[player.GetFractionId()] == FractionsType.Gov)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.WorkDayNotStarted), 3000);
                            return;
                        }

                        Trigger.ClientEvent(player, "openInput", LangFunc.GetText(LangType.Ru, DataName.OfferHeal),
                            LangFunc.GetText(LangType.Ru, DataName.SumBucks), 4, "player_heal");
                        return;
                    case "heal":
                        if (player.IsInVehicle)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.CantHealveh), 3000);
                            return;
                        }

                        playerHealTarget(player, target);
                        return;
                    case "epinephrine":
                        if (player.IsInVehicle)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.CantHealveh), 3000);
                            return;
                        }

                        playerHealTarget(player, target, ItemId.Epinephrine);
                        return;
                    case "sellcar":
                        VehicleManager.sellCar(player, target);
                        return;
                    case "sellhouse":
                        var house = HouseManager.GetHouse(player, true);
                        if (house == null)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.NoHome), 3000);
                            return;
                        }

                        Trigger.ClientEvent(player, "openInput", LangFunc.GetText(LangType.Ru, DataName.OfferHouse),
                            LangFunc.GetText(LangType.Ru, DataName.SumBucks), 8, "player_offerhousesell");
                        return;
                    case "roommate":
                        HouseManager.InviteToRoom(player, target);
                        return;
                    case "invitehouse":
                        HouseManager.InvitePlayerToHouse(player, target);
                        return;
                    case "offer":
                        if (!FunctionsAccess.IsWorking("trade"))
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.FunctionOffByAdmins), 3000);
                            return;
                        }

                        if (targetSessionData.RequestData.IsRequested)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.PersonHavBeenBusy), 7000);
                            return;
                        }

                        if (targetSessionData.CuffedData.Cuffed || targetSessionData.DeathData.InDeath)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.PersonCantTrade), 3000);
                            return;
                        }

                        targetSessionData.RequestData.IsRequested = true;
                        targetSessionData.RequestData.Request = "OFFER_ITEMS";
                        targetSessionData.RequestData.From = player;
                        targetSessionData.RequestData.Time = DateTime.Now.AddSeconds(10);
                        //Notify.Send(target, NotifyType.Warning, NotifyPosition.BottomCenter, LangFunc.GetText(LangType.Ru, DataName.OfferTrade, player.Value), 10000);
                        EventSys.SendCoolMsg(target, "Предложение", "Обмен",
                            $"{LangFunc.GetText(LangType.Ru, DataName.OfferTrade, player.Value)}", "", 10000);
                        EventSys.SendCoolMsg(player, "Предложение", "Обмен",
                            $"{LangFunc.GetText(LangType.Ru, DataName.OfferedTrade, target.Value)}", "", 5000);
                        //Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter, LangFunc.GetText(LangType.Ru, DataName.OfferedTrade, target.Value), 3000);
                        return;
                    case "pocket":
                        if (player.IsInVehicle) return;
                        FractionCommands.playerChangePocket(player, target);
                        return;
                    case "takemask":
                        if (player.IsInVehicle) return;

                        FractionCommands.playerTakeoffMask(player, target);
                        return;
                    case "robguns":
                        if (player.IsInVehicle) return;
                        FractionCommands.playerTakeGuns(player, target);
                        return;
                    case "ticket":
                        if (player.IsInVehicle) return;

                        if (!sessionData.WorkData.OnDuty &&
                            Manager.FractionTypes[player.GetFractionId()] == FractionsType.Gov)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.WorkDayNotStarted), 3000);
                            return;
                        }

                        sessionData.TicketsData.Target = target;
                        Trigger.ClientEvent(player, "openInput", LangFunc.GetText(LangType.Ru, DataName.SendTicket),
                            LangFunc.GetText(LangType.Ru, DataName.Sum0to1000), 4, "player_ticketsum");
                        player.AddTableScore(TableTaskId.Item9);
                        return;
                    case "tinter":
                        if (player.IsInVehicle) return;
                        Animations.playerInteractionTarget(player, target);
                        return;
                    case "vmuted":
                        TriggerVoiceChange(player, target);
                        return;
                }
            }
            catch (Exception e)
            {
                Log.Write($"playerSelected Exception: {e}");
            }
        }

        [RemoteEvent("carryAnimations")]
        public static void carryAnimations(ExtPlayer player, ExtPlayer target, int action)
        {
            try
            {
                if (!FunctionsAccess.IsWorking("carryAnimations"))
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.FunctionOffByAdmins), 3000);
                    return;
                }

                var sessionData = player.GetSessionData();
                if (sessionData == null || sessionData.DeathData.InDeath || player.IsInVehicle)
                    return;

                var characterData = player.GetCharacterData();
                if (characterData == null || characterData.DemorganTime >= 1)
                    return;

                var targetSessionData = target.GetSessionData();
                if (targetSessionData == null || target.IsInVehicle)
                    return;
                var targetCharacterData = target.GetCharacterData();

                if (targetCharacterData == null || targetCharacterData.DemorganTime >= 1 ||
                    player.Position.DistanceTo(target.Position) > 5f)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerTooFar), 3000);
                    return;
                }

                if (sessionData.CarryPlayerTime > DateTime.Now ||
                    targetSessionData.CarryPlayerTime > DateTime.Now) return;
                if (targetCharacterData.ArrestTime >= 1 || characterData.ArrestTime >= 1) return;

                if (targetSessionData.DeathData.InDeath && (action == 0 || action == 2))
                {
                    StartCarry(player, target, $"carry_{action}");
                }
                else if (!sessionData.CuffedData.Cuffed && !sessionData.DeathData.InDeath &&
                         !targetSessionData.CuffedData.Cuffed && !targetSessionData.DeathData.InDeath &&
                         !sessionData.AntiAnimDown && !targetSessionData.AntiAnimDown)
                {
                    if (targetSessionData.RequestData.IsRequested)
                    {
                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.PersonHavBeenBusy), 7000);
                        return;
                    }

                    targetSessionData.RequestData.IsRequested = true;
                    targetSessionData.RequestData.Request = $"carry_{action}";
                    targetSessionData.RequestData.From = player;
                    targetSessionData.RequestData.Time = DateTime.Now.AddSeconds(10);

                    var action_name = "";

                    if (action == 0) action_name = LangFunc.GetText(LangType.Ru, DataName.YouActionNaRuki);
                    else if (action == 1) action_name = LangFunc.GetText(LangType.Ru, DataName.YouActionNaSheyu);
                    else if (action == 2) action_name = LangFunc.GetText(LangType.Ru, DataName.YouActionNaPlecho);
                    else if (action == 3) action_name = LangFunc.GetText(LangType.Ru, DataName.YouActionZalozhnik);

                    //Notify.Send(target, NotifyType.Warning, NotifyPosition.BottomCenter, LangFunc.GetText(LangType.Ru, DataName.PlayerWants, player.Value, action_name), 10000);
                    EventSys.SendCoolMsg(target, "Предложение", "Парная анимация",
                        $"{LangFunc.GetText(LangType.Ru, DataName.PlayerWants, player.Value, action_name)}", "", 12000);

                    if (action == 0) action_name = LangFunc.GetText(LangType.Ru, DataName.HeActionHands);
                    else if (action == 1) action_name = LangFunc.GetText(LangType.Ru, DataName.HeActionSheya);
                    else if (action == 2) action_name = LangFunc.GetText(LangType.Ru, DataName.HeActionPlecho);
                    else if (action == 3) action_name = LangFunc.GetText(LangType.Ru, DataName.HeActionZalozhnik);
                    Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.YouWant, target.Value, action_name), 5000);
                }
                else
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.CantInteractAtThisMoment), 4000);
                }
            }
            catch (Exception e)
            {
                Log.Write($"carryAnimations Exception: {e}");
            }
        }

        public static void StartCarry(ExtPlayer player, ExtPlayer target, string action)
        {
            try
            {
                var targetSessionData = target.GetSessionData();
                if (targetSessionData == null)
                    return;
                targetSessionData.RequestData = new RequestData();


                if (targetSessionData.CarryPlayer != null)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.AlreadyAnim), 3000);
                    return;
                }

                if (target.IsInVehicle)
                    return;

                var sessionData = player.GetSessionData();
                if (sessionData == null || sessionData.DeathData.InDeath || player.IsInVehicle)
                    return;
                if (sessionData.CarryPlayer != null)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.AlreadyAnim), 3000);
                    return;
                }

                var characterData = player.GetCharacterData();
                if (characterData == null || characterData.DemorganTime >= 1)
                    return;

                var targetCharacterData = target.GetCharacterData();

                if (targetCharacterData == null || targetCharacterData.DemorganTime >= 1 ||
                    player.Position.DistanceTo(target.Position) > 5f)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerTooFar), 3000);
                    return;
                }

                if (sessionData.CarryPlayerTime > DateTime.Now ||
                    targetSessionData.CarryPlayerTime > DateTime.Now) return;
                if (targetCharacterData.ArrestTime >= 1 || characterData.ArrestTime >= 1) return;

                if (!sessionData.CuffedData.Cuffed && !sessionData.DeathData.InDeath &&
                    !targetSessionData.CuffedData.Cuffed && !sessionData.AntiAnimDown &&
                    sessionData.AttachToVehicle == null && targetSessionData.AttachToVehicle == null)
                {
                    Animations.AnimationStop(player);
                    Animations.AnimationStop(target);
                    var index = 0;
                    switch (action)
                    {
                        case "carry_0":
                            index = 1;
                            break;
                        case "carry_1":
                            index = 2;
                            break;
                        case "carry_2":
                            index = 3;
                            break;
                        case "carry_3":
                            index = 4;
                            break;
                        default:
                            return;
                    }

                    var carryngData = new Dictionary<string, int>
                    {
                        { "id", target.Value },
                        { "type", index }
                    };
                    sessionData.CarryPlayer = target;
                    sessionData.CarryPlayerTime = DateTime.Now.AddSeconds(5);
                    BattlePass.Repository.UpdateReward(player, 30);
                    targetSessionData.CarryPlayer = player;
                    targetSessionData.CarryPlayerTime = DateTime.Now.AddSeconds(5);
                    BattlePass.Repository.UpdateReward(target, 30);
                    Trigger.ClientEventForAll("syncCarryng", player, carryngData);
                }
                else
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.CantInteractAtThisMoment), 3000);
                }
            }
            catch (Exception e)
            {
                Log.Write($"carryAnimations Exception: {e}");
            }
        }

        [RemoteEvent("carryng.stop")]
        public void server_weapon_damage(ExtPlayer player)
        {
            var sessionData = player.GetSessionData();
            if (sessionData == null || sessionData.DeathData.InDeath || player.IsInVehicle ||
                sessionData.CarryPlayer == null)
                return;

            if (sessionData.CarryPlayer != null)
            {
                var targetSessionData = sessionData.CarryPlayer.GetSessionData();

                if (targetSessionData != null)
                    targetSessionData.CarryPlayer = null;

                sessionData.CarryPlayer = null;
            }

            Trigger.ClientEventForAll("syncCarryng", player, null);
        }

        [RemoteEvent("pairedAnimations")]
        public static void pairedAnimations(ExtPlayer player, ExtPlayer target, string action)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null || player.IsInVehicle)
                    return;

                var characterData = player.GetCharacterData();
                if (characterData == null || characterData.DemorganTime >= 1)
                    return;

                var targetSessionData = target.GetSessionData();
                if (targetSessionData == null || target.IsInVehicle)
                    return;

                var targetCharacterData = target.GetCharacterData();

                if (targetCharacterData == null || targetCharacterData.DemorganTime >= 1 ||
                    player.Position.DistanceTo(target.Position) > 3.0)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerTooFar), 3000);
                    return;
                }

                var action_name = LangFunc.GetText(LangType.Ru, DataName.pairanim);
                if (action == "PAIRED_EMBRACE") action_name = LangFunc.GetText(LangType.Ru, DataName.hug);
                else if (action == "PAIRED_KISS") action_name = LangFunc.GetText(LangType.Ru, DataName.kiss);
                else if (action == "PAIRED_FIVE") action_name = LangFunc.GetText(LangType.Ru, DataName.hfive);
                else if (action == "PAIRED_SLAP") action_name = LangFunc.GetText(LangType.Ru, DataName.giveface);

                if (!sessionData.CuffedData.Cuffed && !sessionData.DeathData.InDeath &&
                    !targetSessionData.CuffedData.Cuffed && !targetSessionData.DeathData.InDeath &&
                    !sessionData.AntiAnimDown && !targetSessionData.AntiAnimDown)
                {
                    if (targetSessionData.RequestData.IsRequested)
                    {
                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.PersonHavBeenBusy), 7000);
                        return;
                    }

                    targetSessionData.RequestData.IsRequested = true;
                    targetSessionData.RequestData.Request = action;
                    targetSessionData.RequestData.From = player;
                    targetSessionData.RequestData.Time = DateTime.Now.AddSeconds(10);

                    if (action == "PAIRED_FIVE" || action == "PAIRED_SLAP")
                        EventSys.SendCoolMsg(target, "Предложение", "Парная анимация",
                            $"{LangFunc.GetText(LangType.Ru, DataName.PlayerWantInteractYou, player.Value, action_name)}",
                            "", 10000);
                    //Notify.Send(target, NotifyType.Warning, NotifyPosition.BottomCenter, LangFunc.GetText(LangType.Ru, DataName.PlayerWantInteractYou, player.Value, action_name), 3000);
                    else
                        EventSys.SendCoolMsg(target, "Предложение", "Парная анимация",
                            $"{LangFunc.GetText(LangType.Ru, DataName.YouWantInteract, player.Value, action_name)}", "",
                            10000);
                    //Notify.Send(target, NotifyType.Warning, NotifyPosition.BottomCenter, LangFunc.GetText(LangType.Ru, DataName.YouWantInteract, player.Value, action_name), 3000);

                    Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.YouWant, target.Value, action_name), 3000);
                }
                else
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.CantInteract, action_name), 3000);
                }
            }
            catch (Exception e)
            {
                Log.Write($"pairedAnimations Exception: {e}");
            }
        }

        public static void pairedAnimationAccept(ExtPlayer player, string action)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;

                var target = sessionData.RequestData.From;
                sessionData.RequestData = new RequestData();

                var targetSessionData = target.GetSessionData();
                if (targetSessionData == null) return;

                var targetCharacterData = target.GetCharacterData();
                if (targetCharacterData == null || player.Position.DistanceTo(target.Position) > 1.5)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerTooFar), 3000);
                    return;
                }

                if (player.IsInVehicle || target.IsInVehicle) return;

                if (characterData.DemorganTime >= 1) return;

                if (targetCharacterData.DemorganTime >= 1) return;

                if (!sessionData.CuffedData.Cuffed && !sessionData.DeathData.InDeath &&
                    !targetSessionData.CuffedData.Cuffed && !targetSessionData.DeathData.InDeath &&
                    !sessionData.AntiAnimDown && !targetSessionData.AntiAnimDown)
                {
                    Main.OnAntiAnim(player);
                    Main.OnAntiAnim(target);

                    BattlePass.Repository.UpdateReward(player, 30);
                    BattlePass.Repository.UpdateReward(target, 30);
                    switch (action)
                    {
                        case "PAIRED_EMBRACE":
                            Trigger.TaskPlayAnim(player, "mp_ped_interaction", "hugs_guy_a", 39);
                            Trigger.TaskPlayAnim(target, "mp_ped_interaction", "hugs_guy_b", 39);
                            Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.hugsyou, target.Name), 2000);
                            Notify.Send(target, NotifyType.Info, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.youhug, player.Name), 2000);
                            break;

                        case "PAIRED_KISS":
                            Trigger.TaskPlayAnim(player, "mp_ped_interaction", "kisses_guy_a", 39);
                            Trigger.TaskPlayAnim(target, "mp_ped_interaction", "kisses_guy_b", 39);
                            Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.youkiss, target.Name), 2000);
                            Notify.Send(target, NotifyType.Info, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.kissyou, player.Name), 2000);
                            break;

                        case "PAIRED_FIVE":
                            Trigger.TaskPlayAnim(player, "mp_ped_interaction", "highfive_guy_a", 39);
                            Trigger.TaskPlayAnim(target, "mp_ped_interaction", "highfive_guy_b", 39);
                            Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.givehf, target.Name), 2000);
                            Notify.Send(target, NotifyType.Info, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.hfget, player.Name), 2000);
                            break;

                        case "PAIRED_SLAP":
                            Trigger.TaskPlayAnim(player, "melee@unarmed@streamed_variations",
                                "victim_takedown_front_slap", 39);
                            Trigger.TaskPlayAnim(target, "melee@unarmed@streamed_variations",
                                "plyr_takedown_front_slap", 39);
                            Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.givenface, target.Name), 2000);
                            Notify.Send(target, NotifyType.Info, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.facegiven, player.Name), 2000);
                            break;
                    }
                }
                else
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.cantpairanim), 3000);
                }
            }
            catch (Exception e)
            {
                Log.Write($"pairedAnimationAccept Exception: {e}");
            }
        }

        public static void TriggerVoiceChange(ExtPlayer player, ExtPlayer target)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                if (!player.IsCharacterData()) return;
                var targetCharacterData = target.GetCharacterData();
                if (targetCharacterData == null) return;
                if (sessionData.Muted.Contains(target.Name))
                {
                    sessionData.Muted.Remove(target.Name);
                    Trigger.ClientEvent(target, "unMuteMeForPlayer", player.Name);
                    Trigger.ClientEvent(player, "unMutePlayer", target.Name);
                    Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.yougagleft, target.Value), 2000);
                    Notify.Send(target, NotifyType.Success, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.gagleft, player.Value), 2000);
                }
                else
                {
                    if (sessionData.Muted.Count >= 10)
                    {
                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.somanymuted), 10000);
                        return;
                    }

                    if (targetCharacterData.AdminLVL >= 1)
                    {
                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.nomuteadmin), 3000);
                        return;
                    }

                    sessionData.Muted.Add(target.Name);
                    Trigger.ClientEvent(target, "MutedMePlayer", player.Name);
                    Trigger.ClientEvent(player, "MutePlayer", target.Name);
                    Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.YouGag, target.Value), 2000);
                    Notify.Send(target, NotifyType.Success, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.GagYou, player.Value), 2000);
                }
            }
            catch (Exception e)
            {
                Log.Write($"TriggerVoiceChange Exception: {e}");
            }
        }

        [RemoteEvent("unmuteAll")]
        public static void UnMuteAllList(ExtPlayer player)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                if (!player.IsCharacterData()) return;

                if (sessionData.Muted.Count >= 1)
                {
                    var myname = player.Name;
                    foreach (var p in sessionData.Muted)
                        try
                        {
                            var foreachPlayer = (ExtPlayer)NAPI.Player.GetPlayerFromName(p);
                            if (foreachPlayer.IsCharacterData())
                                Trigger.ClientEvent(foreachPlayer, "unMuteMeForPlayer", myname);
                        }
                        catch (Exception e)
                        {
                            Log.Write($"UnMuteAllList Foreach Exception: {e}");
                        }
                }

                sessionData.Muted = new List<string>();
            }
            catch (Exception e)
            {
                Log.Write($"UnMuteAllList Exception: {e}");
            }
        }

        [RemoteEvent("pOrgSelected")]
        public static void playerOrgSelected(ExtPlayer player, ExtPlayer target, int action)
        {
            try
            {
                if (!player.IsOrganizationAccess(RankToAccess.OrgCrime)) return;
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                var targetSessionData = target.GetSessionData();
                if (targetSessionData == null) return;
                var targetCharacterData = target.GetCharacterData();
                if (targetCharacterData == null) return;
                if (player.Position.DistanceTo(target.Position) > 2)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerTooFar), 3000);
                    return;
                }

                if (characterData.DemorganTime >= 1) return;
                if (targetCharacterData.DemorganTime >= 1) return;
                sessionData.SelectData.SelectedPlayer = target;
                switch (action)
                {
                    case 0:
                        if (player.IsInVehicle) return;
                        FractionCommands.playerHandsupOffer(player, target);
                        return;
                    case 1:
                        if (player.IsInVehicle) return;
                        FractionCommands.robberyTarget(player, target);
                        return;
                    case 3:
                        if (player.IsInVehicle) return;
                        FractionCommands.playerChangePocket(player, target, true);
                        return;
                    case 2:
                        if (player.IsInVehicle) return;
                        FractionCommands.playerTakeGuns(player, target, true);
                        return;
                    case 4:
                        if (player.IsInVehicle) return;
                        if (sessionData.Follower != null)
                        {
                            if (targetSessionData.Following == player)
                            {
                                Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.YouReleasePlayer, target.Value), 3000);
                                Notify.Send(target, NotifyType.Success, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.PlayerReleaseYou, player.Value), 3000);
                                FractionCommands.unFollow(player, target);
                            }
                            else
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.SomebodyFollowing), 2000);
                            }
                        }
                        else
                        {
                            FractionCommands.targetFollowPlayer(player, target, true);
                        }

                        return;
                }
            }
            catch (Exception e)
            {
                Log.Write($"playerOrgSelected Exception: {e}");
            }
        }


        public static void playerTransferMoney(ExtPlayer player, string arg)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                if (characterData.LVL < 1)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.flvltotransact), 3000);
                    return;
                }

                int amount;
                if (!int.TryParse(arg, out amount))
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.VvedireCorrect), 3000);
                    return;
                }

                if (amount < 1)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.VvedireCorrect), 3000);
                    return;
                }

                var target = sessionData.SelectData.SelectedPlayer;
                var targetSessionData = target.GetSessionData();
                var targetCharacterData = target.GetCharacterData();
                if (targetSessionData == null || targetCharacterData == null ||
                    player.Position.DistanceTo(target.Position) > 2)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerTooFar), 3000);
                    return;
                }

                if (UpdateData.CanIChange(player, amount, true) != 255) return;
                /*else if (Main.ServerNumber != 0 && (characterData.AdminLVL >= 1 && characterData.AdminLVL <= 6))
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter, LangFunc.GetText(LangType.Ru, DataName.AdminTransferRestricted), 3000);
                    return;
                }*/

                if (DateTime.Now < sessionData.TimingsData.NextTransfer && characterData.AdminLVL == 0)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.LowTimeLastTransact), 3000);
                    return;
                }

                sessionData.TimingsData.NextTransfer = DateTime.Now.AddSeconds(15);
                Notify.Send(target, NotifyType.Info, NotifyPosition.BottomCenter,
                    LangFunc.GetText(LangType.Ru, DataName.PlayerGivesYouMoney, player.Value, amount), 3000);
                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                    LangFunc.GetText(LangType.Ru, DataName.YouGivePlayerMoney, target.Value, amount), 3000);
                Trigger.PlayAnimation(player, "mp_common", "givetake1_a", 50);
                Timers.StartOnce(3000, () => { Trigger.StopAnimation(player); });
                BattlePass.Repository.UpdateReward(player, 14);
                Wallet.Change(target, amount);
                Wallet.Change(player, -amount);
                GameLog.Money($"player({characterData.UUID})", $"player({targetCharacterData.UUID})", amount,
                    "transfer");
                Commands.RPChat("sme", player,
                    "передал" + (characterData.Gender ? "" : "а") + $" {Wallet.Format(amount)}$ " + "{name}", target);

                // if (amount >= 1000000)
                //     Admin.AdminsLog(1, $"[ВНИМАНИЕ] Игрок {target.Name}({target.Value}) получил {amount}$ единой операцией от {player.Name}({player.Value} (playerTransferMoney - через 'Передать деньги')", 1, "#FF0000");
                //
                // if (amount >= 10000 && targetSessionData.LastCashOperationSum == amount)
                // {
                //     Admin.AdminsLog(1, $"[ВНИМАНИЕ] Игрок {target.Name}({target.Value}) два раза подряд получил по {amount}$ от {player.Name}({player.Value}) (playerTransferMoney - через 'Передать деньги')", 1, "#FF0000");
                //     targetSessionData.LastCashOperationSum = 0;
                // }
                // else
                // {
                //     targetSessionData.LastCashOperationSum = amount;
                // }
            }
            catch (Exception e)
            {
                Log.Write($"playerTransferMoney Exception: {e}");
            }
        }

        public static void playerHealTarget(ExtPlayer player, ExtPlayer target, ItemId itemId = ItemId.HealthKit)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                if (sessionData.AntiAnimDown)
                    return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;

                var targetSessionData = target.GetSessionData();
                if (targetSessionData == null)
                    return;

                var targetCharacterData = target.GetCharacterData();
                if (targetCharacterData == null)
                    return;

                if (player.Position.DistanceTo(target.Position) > 2)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerTooFar), 3000);
                    return;
                }

                var item = Repository.isItem(player, "inventory", itemId);
                if (item == null || item.Item.Count < 1)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.YouHaveNoApteka, Repository.ItemsInfo[itemId].Name),
                        3000);
                    return;
                }

                if (targetSessionData.DeathData.IsDying && !targetSessionData.DeathData.IsReviving)
                {
                    Repository.RemoveIndex(player, item.Location, item.Index);
                    Main.OnAntiAnim(player);
                    Trigger.PlayAnimation(player, "missheistfbi3b_ig8_2", "cpr_loop_paramedic", 39);
                    // Trigger.ClientEventInRange(player.Position, 250f, "PlayAnimToKey", player, false, "revive");
                    Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.YouStartReanim, target.Value), 3000);
                    Notify.Send(target, NotifyType.Info, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.StartReanimOnYou, player.Value), 3000);
                    targetSessionData.DeathData.IsReviving = true;
                    NAPI.Task.Run(() =>
                    {
                        try
                        {
                            if (!player.IsCharacterData() || sessionData.DeathData.IsDying)
                            {
                                if (targetSessionData != null)
                                {
                                    targetSessionData.DeathData.IsReviving = false;
                                    if (targetSessionData.TimersData.DeathTimer == null) Ems.ReviveFunc(target);
                                }

                                return;
                            }

                            Main.OffAntiAnim(player);
                            Trigger.StopAnimation(player);
                            NAPI.Entity.SetEntityPosition(player, player.Position + new Vector3(0, 0, 0.5));
                            if (!target.IsCharacterData())
                            {
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.ReanimTooFar), 3000);
                                return;
                            }

                            if (player.Position.DistanceTo(target.Position) > 4)
                            {
                                targetSessionData.DeathData.IsReviving = false;
                                if (targetSessionData.TimersData.DeathTimer == null) Ems.ReviveFunc(target);
                                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                    LangFunc.GetText(LangType.Ru, DataName.ReanimTooFar), 3000);
                                return;
                            }

                            BattlePass.Repository.UpdateReward(player, 7);
                            targetSessionData.DeathData.IsReviving = false;
                            if (player.GetFractionId() != (int)Fractions.Models.Fractions.EMS &&
                                characterData.AdminLVL == 0)
                            {
                                var number = Main.rnd.Next(0, 11);
                                if (characterData.Licenses[8])
                                {
                                    if (number <= 3)
                                    {
                                        if (targetSessionData.TimersData.DeathTimer == null) Ems.ReviveFunc(target);
                                        Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter,
                                            LangFunc.GetText(LangType.Ru, DataName.FailureReanim), 3000);
                                        return;
                                    }
                                }
                                else
                                {
                                    if (number <= 6)
                                    {
                                        if (targetSessionData.TimersData.DeathTimer == null) Ems.ReviveFunc(target);
                                        Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter,
                                            LangFunc.GetText(LangType.Ru, DataName.FailureReanim), 3000);
                                        return;
                                    }
                                }
                            }
                            else
                            {
                                if (DateTime.Now > targetSessionData.TimingsData.NextDeathMoney)
                                {
                                    Wallet.Change(player, 1000);
                                    GameLog.Money("server", $"player({characterData.UUID})", 1000,
                                        $"revieve({targetCharacterData.UUID})");
                                    targetSessionData.TimingsData.NextDeathMoney = DateTime.Now.AddMinutes(15);
                                }
                            }

                            Ems.ReviveFunc(target, true);

                            if (itemId != ItemId.HealthKit)
                                target.Health = 100;

                            characterData.Revived++;
                            Notify.Send(target, NotifyType.Info, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.PlayerReanimYou, player.Value), 3000);
                            Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.YouReanimPlayer, target.Value), 3000);
                            player.AddTableScore(TableTaskId.Item21);
                        }
                        catch (Exception e)
                        {
                            Log.Write($"playerHealTarget Task Exception: {e}");
                        }
                    }, itemId == ItemId.HealthKit ? 15000 : 3500);
                }
                else
                {
                    Repository.RemoveIndex(player, item.Location, item.Index);
                    Notify.Send(target, NotifyType.Info, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerHealYou, player.Value), 3000);
                    Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.YouHealPlayer, target.Value), 3000);
                    target.Health = 100;
                }
            }
            catch (Exception e)
            {
                Log.Write($"playerHealTarget Exception: {e}");
            }
        }

        public static void playerTakeGuns(ExtPlayer player, ExtPlayer target)
        {
            try
            {
                if (!player.IsFractionAccess(RankToAccess.TakeGuns)) return;
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;

                if (!sessionData.WorkData.OnDuty && Manager.FractionTypes[player.GetFractionId()] == FractionsType.Gov)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.WorkDayNotStarted), 3000);
                    return;
                }

                var targetCharacterData = target.GetCharacterData();
                if (targetCharacterData == null) return;
                var targetSessionData = target.GetSessionData();
                if (targetSessionData == null) return;
                if (player.Position.DistanceTo(target.Position) > 2)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerTooFar), 3000);
                    return;
                }

                if (!targetCharacterData.IsAlive)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerDying), 3000);
                    return;
                }

                if (!targetSessionData.CuffedData.Cuffed)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.NoCuffed), 3000);
                    return;
                }

                Repository.RemoveAllWeapons(target, true);
                Notify.Send(target, NotifyType.Warning, NotifyPosition.BottomCenter,
                    LangFunc.GetText(LangType.Ru, DataName.PlayerTakeWeaponYou, player.Value), 3000);
                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                    LangFunc.GetText(LangType.Ru, DataName.YouTakeWeaponPlayer, target.Value), 3000);
            }
            catch (Exception e)
            {
                Log.Write($"playerTakeGuns Exception: {e}");
            }
        }

        public static void playerTakeIlleagal(ExtPlayer player, ExtPlayer target)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;

                if (!sessionData.WorkData.OnDuty && Manager.FractionTypes[player.GetFractionId()] == FractionsType.Gov)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.WorkDayNotStarted), 3000);
                    return;
                }

                var targetCharacterData = target.GetCharacterData();
                if (targetCharacterData == null) return;
                var targetSessionData = target.GetSessionData();
                if (targetSessionData == null) return;
                if (player.Position.DistanceTo(target.Position) > 2)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerTooFar), 3000);
                    return;
                }

                if (!targetCharacterData.IsAlive)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerDying), 3000);
                    return;
                }

                if (!targetSessionData.CuffedData.Cuffed)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.NoCuffed), 3000);
                    return;
                }

                if (!Repository.RemoveAllIllegal(target))
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.PlayerDoesntIllegalStuff), 3000);
                    return;
                }

                Notify.Send(target, NotifyType.Warning, NotifyPosition.BottomCenter,
                    LangFunc.GetText(LangType.Ru, DataName.IllegalStuffTaken, player.Value), 3000);
                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                    LangFunc.GetText(LangType.Ru, DataName.YouTakeIllegalStuff, target.Value), 3000);
                player.AddTableScore(TableTaskId.Item10);
            }
            catch (Exception e)
            {
                Log.Write($"playerTakeIlleagal Exception: {e}");
            }
        }

        public static void playerHandshakeTarget(ExtPlayer player, ExtPlayer target)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                if (!player.IsCharacterData()) return;
                var targetSessionData = target.GetSessionData();
                if (targetSessionData == null) return;
                if (!target.IsCharacterData()) return;
                if (!sessionData.CuffedData.Cuffed && !sessionData.DeathData.InDeath)
                {
                    if (!targetSessionData.CuffedData.Cuffed && !targetSessionData.DeathData.InDeath)
                    {
                        if (targetSessionData.RequestData.IsRequested)
                        {
                            Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                                LangFunc.GetText(LangType.Ru, DataName.PersonHavBeenBusy), 7000);
                            return;
                        }

                        targetSessionData.RequestData.IsRequested = true;
                        targetSessionData.RequestData.Request = "HANDSHAKE";
                        targetSessionData.RequestData.From = player;
                        targetSessionData.RequestData.Time = DateTime.Now.AddSeconds(10);
                        //Notify.Send(target, NotifyType.Warning, NotifyPosition.BottomCenter, LangFunc.GetText(LangType.Ru, DataName.HandshakeYou, player.Value), 3000);
                        EventSys.SendCoolMsg(target, "Предложение", "Рукопожатие!",
                            $"{LangFunc.GetText(LangType.Ru, DataName.HandshakeYou, player.Value)}", "", 10000);
                        //Notify.Send(player, NotifyType.Info, NotifyPosition.BottomCenter, LangFunc.GetText(LangType.Ru, DataName.YouHandshake, target.Value), 3000);
                        EventSys.SendCoolMsg(player, "Предложение", "Рукопожатие!",
                            $"{LangFunc.GetText(LangType.Ru, DataName.YouHandshake, target.Value)}", "", 10000);
                    }
                    else
                    {
                        Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.CantHandshake), 3000);
                    }
                }
                else
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.CantHandshake), 3000);
                }
            }
            catch (Exception e)
            {
                Log.Write($"playerHandshakeTarget Exception: {e}");
            }
        }

        [RemoteEvent("SitWalkSyle")]
        public static void IWantSeat(ExtPlayer player, bool state)
        {
            try
            {
                if (!player.IsCharacterData()) return;
                if (state)
                    player.SetSharedData("WalkStyle", 26);
                //Trigger.ClientEventInRange(player.Position, 250, "Player_SetWalkStyle", player, 10);
                else
                    player.SetSharedData("WalkStyle", 0);
                //Trigger.ClientEventInRange(player.Position, 250, "Player_SetWalkStyle", player, 0);
            }
            catch (Exception e)
            {
                Log.Write($"IWantSeat Exception: {e}");
            }
        }

        public class ObjData
        {
            public string Type { get; set; } = "NONE";
            public bool PickedTemp { get; set; } = false;
            public int Id { get; set; } = 0;
            public InventoryItemData Item { get; set; } = new InventoryItemData();
            public string DeleteTimer { get; set; }
            public Object entity { get; set; } = null;
            public ExtPlayer Player { get; set; } = null;
        }

        internal class SearchObject
        {
            public string Name { get; set; }
            public List<string> Weapons { get; set; }
            public List<string> Items { get; set; }
        }
    }
}