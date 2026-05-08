using System;
using System.Collections.Generic;
using GTANetworkAPI;
using NeptuneEvo.Localization;
using NeptuneEvo.Character;
using NeptuneEvo.Chars;
using NeptuneEvo.Chars.Models;
using NeptuneEvo.Core;
using NeptuneEvo.Handles;
using NeptuneEvo.Houses;
using NeptuneEvo.MoneySystem;
using NeptuneEvo.Players.Phone.Messages.Models;
using NeptuneEvo.SDK;
using Repository = NeptuneEvo.Chars.Repository;

namespace NeptuneEvo.NewCasino
{
    internal class LuckyWheel : Script
    {
        #region Modules

        private static readonly Random Rnd = new Random();
        private static DateTime WaitFor { get; set; }
        private static int BlockTimeSeconds { get; } = 21;

        private static void ComeToLuckyWheel(ExtPlayer player)
        {
            if (DateTime.Now < WaitFor)
            {
                // Ждем пока колесо остановится (Завязано на таймере)
                player.SendNotification("Вам надо немного подождать");
            }
            else if (player.CharacterData.IsLucky)
            {
                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter, "Крутить колесо можно раз в день!",
                    3000);
            }
            else
            {
                // Присваимваем рандомное значение для колеса
                WaitFor = DateTime.Now.AddSeconds(BlockTimeSeconds);
                var value = Rnd.Next(0, 20);
                player.SetSharedData("LUCKY_WHEEL_CALL", true);
                player.SetSharedData("LUCKY_WHEEL_WIN", value);
                player.PlayAnimation("rcmcollect_paperleadinout@", "kneeling_arrest_get_up", 33);
                Main.OnAntiAnim(player);
                Trigger.ClientEvent(player, "luckywheel.cometoluckywheel", value);
            }
        }

        private static void SpinLuckyWheel(ExtPlayer player)
        {
            if (player.HasSharedData("LUCKY_WHEEL_WIN") && player.HasSharedData("LUCKY_WHEEL_CALL"))
            {
                player.SetSharedData("LUCKY_WHEEL_CALL", true);
                Trigger.ClientEventInRange(player.Position, 100, "luckywheel.spin",
                    player.GetSharedData<int>("LUCKY_WHEEL_WIN"));
            }
        }

        private static void FinishSpin(ExtPlayer player)
        {
            if (player.HasSharedData("LUCKY_WHEEL_WIN") && player.HasSharedData("LUCKY_WHEEL_CALL"))
            {
                var resultName = "Приз";
                switch (player.GetSharedData<int>("LUCKY_WHEEL_WIN"))
                {
                    case 0:
                    case 8:
                    case 12:
                    case 16:
                        resultName = "Одежда";
                        GiveOutPrizeClothes(player);
                        break;
                    case 2:
                    case 6:
                    case 14:
                    case 19:
                        var price = Rnd.Next(1780, 62742);
                        resultName = $"Игровая валюта в размере {price}";
                        Wallet.Change(player, price);
                        break;
                    case 18:
                        resultName = "Эксклюзивная машина";
                        GiveOutPrizeVehicle(player);
                        break;
                    case 1:
                    case 5:
                    case 9:
                    case 13:
                    case 17:
                        resultName = "Мистический предмет";
                        GiveOutPrizeMysticItem(player);
                        break;
                    case 3:
                    case 7:
                    case 10:
                    case 15:
                        resultName = "Оружие";
                        GiveOutPrizeWeapon(player);
                        break;
                    case 11:
                        resultName = "Уникальный костюм";
                        GiveOutPrizeCostume(player);
                        break;
                    case 4:
                        var donateCoins = Rnd.Next(50, 100);
                        resultName = $"Донат валюта в размере {donateCoins}";
                        UpdateData.RedBucks(player, donateCoins, "Выдача коинов казино");
                        break;
                }

                EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino", $"Выигрыш: {resultName}. Поздравляем!", "",
                    3000);
                Main.OffAntiAnim(player);
                player.ResetSharedData("LUCKY_WHEEL_CALL");
                player.ResetSharedData("LUCKY_WHEEL_WIN");
                player.CharacterData.IsLucky = true;
            }
        }

        #region Compensations

        // Выплачиваемые компенсации, при ошибке выдачи призов
        private static readonly Dictionary<string, int> amountCompensations = new Dictionary<string, int>
        {
            { "weapon", 30000 },
            { "mystic", 15000 },
            { "vehicle", 50000 },
            { "clothes", 20000 }
        };

        private static void GiveOutPrizeCostume(ExtPlayer player)
        {
            var characterData = player.GetCharacterData();

            Repository.AddNewItem(player, $"char_{characterData.UUID}", "inventory", ItemId.Feet, 1, "55_0_1");
            Repository.AddNewItem(player, $"char_{characterData.UUID}", "inventory", ItemId.Leg, 1, "77_0_1");
            Repository.AddNewItem(player, $"char_{characterData.UUID}", "inventory", ItemId.Top, 1, "178_0_1");
        }

        private static void GiveOutPrizeWeapon(ExtPlayer player)
        {
            var amountCompensation = amountCompensations["weapon"];
            var randomInt = Rnd.Next(0, 4);

            switch (randomInt)
            {
                case 0:
                    if (Repository.isFreeSlots(player, ItemId.Bat) != 0)
                    {
                        EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                            $"Недостаточно места, вам выдана компенсация {amountCompensation}$", "", 3000);
                        Wallet.Change(player, amountCompensation);
                        return;
                    }

                    WeaponRepository.GiveWeapon(player, ItemId.Bat, "LuckyWheel");
                    break;
                case 1:
                    if (Repository.isFreeSlots(player, ItemId.HeavyPistol) != 0)
                    {
                        EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                            $"Недостаточно места, вам выдана компенсация {amountCompensation}$", "", 3000);
                        Wallet.Change(player, amountCompensation);
                        return;
                    }

                    WeaponRepository.GiveWeapon(player, ItemId.HeavyPistol, "LuckyWheel");
                    break;
                case 2:
                    if (Repository.isFreeSlots(player, ItemId.Musket) != 0)
                    {
                        EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                            $"Недостаточно места, вам выдана компенсация {amountCompensation}$", "", 3000);
                        Wallet.Change(player, amountCompensation);
                        return;
                    }

                    WeaponRepository.GiveWeapon(player, ItemId.Musket, "LuckyWheel");
                    break;
                case 3:
                    if (Repository.isFreeSlots(player, ItemId.AdvancedRifle) != 0)
                    {
                        EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                            $"Недостаточно места, вам выдана компенсация {amountCompensation}$", "", 3000);
                        Wallet.Change(player, amountCompensation);
                        return;
                    }

                    WeaponRepository.GiveWeapon(player, ItemId.AdvancedRifle, "LuckyWheel");
                    break;
            }
        }

        private static void GiveOutPrizeMysticItem(ExtPlayer player)
        {
            var amountCompensation = amountCompensations["mystic"];
            var randomInt = Rnd.Next(0, 5);

            switch (randomInt)
            {
                case 0:
                    if (Repository.isFreeSlots(player, ItemId.Flashlight) != 0)
                    {
                        EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                            $"Недостаточно места, вам выдана компенсация {amountCompensation}$", "", 3000);
                        Wallet.Change(player, amountCompensation);
                        return;
                    }

                    WeaponRepository.GiveWeapon(player, ItemId.Flashlight, "LuckyWheel");
                    break;
                case 1:
                    if (Repository.isFreeSlots(player, ItemId.BattleAxe) != 0)
                    {
                        EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                            $"Недостаточно места, вам выдана компенсация {amountCompensation}$", "", 3000);
                        Wallet.Change(player, amountCompensation);
                        return;
                    }

                    WeaponRepository.GiveWeapon(player, ItemId.BattleAxe, "LuckyWheel");
                    break;
                case 2:
                    if (Repository.isFreeSlots(player, ItemId.FlareGun) != 0)
                    {
                        EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                            $"Недостаточно места, вам выдана компенсация {amountCompensation}$", "", 3000);
                        Wallet.Change(player, amountCompensation);
                        return;
                    }

                    WeaponRepository.GiveWeapon(player, ItemId.FlareGun, "LuckyWheel");
                    break;
                case 3:
                    if (Repository.isFreeSlots(player, ItemId.StunGun) != 0)
                    {
                        EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                            $"Недостаточно места, вам выдана компенсация {amountCompensation}$", "", 3000);
                        Wallet.Change(player, amountCompensation);
                        return;
                    }

                    WeaponRepository.GiveWeapon(player, ItemId.StunGun, "LuckyWheel");
                    break;
                case 4:
                    if (Repository.isFreeSlots(player, ItemId.MicroSMG) != 0)
                    {
                        EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                            $"Недостаточно места, вам выдана компенсация {amountCompensation}$", "", 3000);
                        Wallet.Change(player, amountCompensation);
                        return;
                    }

                    WeaponRepository.GiveWeapon(player, ItemId.MicroSMG, "LuckyWheel");
                    break;
            }
        }

        private static void GiveOutPrizeVehicle(ExtPlayer player)
        {
            var amountCompensation = amountCompensations["vehicle"];
            var cars = new Random().Next(0, 4);
            string model = null;
            switch (cars)
            {
                case 0:
                    model = "baller3";
                    break;
                case 1:
                    model = "cheburek";
                    break;
                case 2:
                    model = "furia";
                    break;
                case 3:
                    model = "brioso";
                    break;
            }

            var vehiclesCount = VehicleManager.GetVehiclesCarCountToPlayer(player.Name);
            if (vehiclesCount >= GarageManager.MaxGarageCars)
            {
                Wallet.Change(player, amountCompensation);
                EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                    $"Вы получили компенсацию в размере {amountCompensation}$ так как у вас максимальное количество авто",
                    "", 3000);
            }
            else
            {
                var house = HouseManager.GetHouse(player, true);
                if (house != null)
                    if (vehiclesCount >= GarageManager
                            .GarageTypes[GarageManager.Garages[house.GarageID].Type].MaxCars)
                    {
                        EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                            "У Вас максимальное кол-во машин, которое поддерживает Ваше место жительства.", "", 3000);
                        return;
                    }

                VehicleManager.Create(player, model, new Color(225, 225, 225), new Color(225, 225, 225));
                Players.Phone.Messages.Repository.AddSystemMessage(player, (int)DefaultNumber.Bank,
                    LangFunc.GetText(LangType.Ru, DataName.YouBuyCarV3, model), DateTime.Now);

                EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                    $"Вы получили уникальный автомообиль {model}.", "", 3000);
            }
        }

        private static void GiveOutPrizeClothes(ExtPlayer player)
        {
            var amountCompensation = amountCompensations["clothes"];

            var characterData = player.GetCharacterData();
            if (Repository.isFreeSlots(player, ItemId.Hat) != 0)
            {
                EventSys.SendPlayersToEvent("LuckyWheel", "Diamond Casino",
                    $"Недостаточно места, вам выдана компенсация {amountCompensation}$", "", 3000);
                Wallet.Change(player, amountCompensation);
                return;
            }

            var cloth = Rnd.Next(0, 4);
            switch (cloth)
            {
                case 0:
                    Repository.AddNewItem(player, $"char_{characterData.UUID}", "inventory", ItemId.Hat, 1, "77_0_1");
                    break;
                case 1:
                    Repository.AddNewItem(player, $"char_{characterData.UUID}", "inventory", ItemId.Hat, 1, "40_0_1");
                    break;
                case 2:
                    Repository.AddNewItem(player, $"char_{characterData.UUID}", "inventory", ItemId.Hat, 1, "22_0_1");
                    break;
                case 3:
                    Repository.AddNewItem(player, $"char_{characterData.UUID}", "inventory", ItemId.Hat, 1, "42_0_1");
                    break;
            }
        }

        #endregion

        #endregion

        #region Events

        [RemoteEvent("luckywheel.cometoluckywheel")]
        public static void ComeToLuckyWheel_Event(ExtPlayer player)
        {
            ComeToLuckyWheel(player);
        }

        [RemoteEvent("luckywheel.spin")]
        public static void SpinLuckyWheel_Event(ExtPlayer player)
        {
            SpinLuckyWheel(player);
        }

        [RemoteEvent("luckywheel.finishspin")]
        public static void FinishSpin_Event(ExtPlayer player)
        {
            FinishSpin(player);
        }

        #endregion
    }
}