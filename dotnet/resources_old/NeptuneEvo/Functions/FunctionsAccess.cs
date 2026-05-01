using System;
using System.Collections.Generic;
using System.Linq;
using Database;
using GTANetworkAPI;
using NeptuneEvo.Character;
using NeptuneEvo.Handles;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Functions
{
    internal class FunctionsAccess : Script
    {
        private static readonly nLog Log = new nLog("Functions.CommandsAccess");

        private static Dictionary<string, bool> SystemState = new Dictionary<string, bool>
        {
            { "DeleteCharacter", true },
            //{ "metro", false },
            { "PayDayBonus", false }
            //{"ClothesShop", false }
        };

        public void UpdateSystemState()
        {
            using (var db = new ConfigBD("ConfigDB"))
            {
                var _SystemState = new Dictionary<string, bool>();
                var SystemStateList = db.Systemstate.ToList();
                foreach (var _systemState in SystemStateList) _SystemState.Add(_systemState.Name, _systemState.Toggle);
                SystemState = _SystemState;
            }
        }

        [Command(AdminCommands.Refreshsystemstate)]
        public void CMD_Refreshclothes(ExtPlayer player)
        {
            try
            {
                if (!player.IsCharacterData()) return;
                if (!CommandsAccess.CanUseCmd(player, AdminCommands.Refreshsystemstate)) return;
                UpdateSystemState();
                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter, "Вы обновили .", 3000);
            }
            catch (Exception e)
            {
                Log.Write($"CMD_Refreshclothes Exception: {e}");
            }
        }

        [Command(AdminCommands.Enablefunc)]
        public void CMD_Enablefunc(ExtPlayer player, string name, bool toogled)
        {
            try
            {
                if (!player.IsCharacterData()) return;
                if (!CommandsAccess.CanUseCmd(player, AdminCommands.Enablefunc)) return;
                if (!SystemState.ContainsKey(name)) SystemState.Add(name, toogled);
                else SystemState[name] = toogled;
                Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                    $"Вы изменили доступ к функции {name} на {toogled}", 10000);
            }
            catch (Exception e)
            {
                Log.Write($"CMD_Enablefunc Exception: {e}");
            }
        }


        // Если система отключена, то у неё должно стоять false
        // Если система включена, то true
        public static bool IsWorking(string name)
        {
            try
            {
                if (!SystemState.ContainsKey(name))
                    return
                        true; // Если в списке переключенных систем не находится нужная нам, значит та, что мы запрашиваем - точно работает, возвращаем true
                return SystemState[name]; // Если она есть в списке, возвращаем значение из списка.
            }
            catch (Exception e)
            {
                Log.Write($"IsWorking Exception: {e}");
                return
                    false; // Если вдруг среди ясного дня прогремит гром, то на всякий случай возвращаем, что система отключена
            }
        }
    }
}