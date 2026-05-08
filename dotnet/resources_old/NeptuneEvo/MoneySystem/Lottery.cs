using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using GTANetworkAPI;
using NeptuneEvo.Localization;
using NeptuneEvo.Character;
using NeptuneEvo.Handles;
using NeptuneEvo.SDK;

namespace NeptuneEvo.MoneySystem
{
    internal class Lottery : Script
    {
        private static readonly nLog Log = new nLog("MoneySystem.Lottery");

        public static uint ID;
        public static uint Price;

        public static uint Bonus = 0;

        //public static byte Step = 0;
        public static Dictionary<uint, int> LotteryBought; // Lottery Ticket | Player UUID

        public static void OnResourceStart()
        {
            try
            {
                LotteryBought = new Dictionary<uint, int>();
                using var result = MySQL.QueryRead("SELECT * FROM `lottery`");
                if (result is null || result.Rows.Count == 0) return;
                var row = result.Rows[0];
                ID = (uint)row[0];
                using var resultLottery_players =
                    MySQL.QueryRead($"SELECT * FROM `lottery_players` WHERE `number`={ID}");
                if (resultLottery_players is null || resultLottery_players.Rows.Count == 0)
                {
                    Log.Write("Lottery successfully started", nLog.Type.Success);
                    return;
                }

                var pname = 0;
                foreach (DataRow rows in resultLottery_players.Rows)
                {
                    pname = (int)rows[2];
                    LotteryBought.Add((uint)rows[1], pname);
                }

                Price = 350 * (uint)resultLottery_players.Rows.Count;
                Log.Write("Lottery successfully started", nLog.Type.Success);
            }
            catch (Exception e)
            {
                Log.Write($"OnResourceStart Exception: {e}");
            }
        }

        [Command("lottery")]
        public static void CMD_CheckLottery(ExtPlayer player)
        {
            try
            {
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                if (characterData.AdminLVL != 0)
                {
                    Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.LotteryAnnounce, LotteryBought.Count(),
                            Wallet.Format(Price)), 3000);
                }
                else
                {
                    if (LotteryBought.Count == 0)
                    {
                        Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.ZeroTicketsLottery), 7000);
                        return;
                    }

                    var mytotal = LotteryBought.Where(p => p.Value == characterData.UUID).Count();
                    if (mytotal == 0)
                    {
                        Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.ZeroTicketsLottery), 7000);
                        return;
                    }

                    var shans = mytotal * 100.0 / LotteryBought.Count();
                    Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.LotteryMy, mytotal, shans.ToString("0.##"),
                            Wallet.Format(Price)), 7000);
                    Notify.Send(player, NotifyType.Success, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.JackPotLottery), 7000);
                    if (shans >= 70.0)
                        Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.Chance70Lottery), 7000);
                    else if (shans >= 50.0)
                        Notify.Send(player, NotifyType.Warning, NotifyPosition.BottomCenter,
                            LangFunc.GetText(LangType.Ru, DataName.Chance50Lottery), 7000);
                }
            }
            catch (Exception e)
            {
                Log.Write($"CMD_CheckLottery Exception: {e}");
            }
        }
    }
}