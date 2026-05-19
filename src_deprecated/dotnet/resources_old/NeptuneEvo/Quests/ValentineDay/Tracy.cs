using System;
using GTANetworkAPI;
using NeptuneEvo.Localization;
using NeptuneEvo.Character;
using NeptuneEvo.Chars;
using NeptuneEvo.Functions;
using NeptuneEvo.Handles;
using NeptuneEvo.MoneySystem;
using NeptuneEvo.Players;
using NeptuneEvo.Quests.Models;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Quests
{
    public enum tracy_quests
    {
        Error = -99,
        NoMission = -1,
        Start = 0,
        End = 3
    }

    internal class Tracy : Script
    {
        private static readonly nLog Log = new nLog("Quests.Tracy");

        public static void Perform(ExtPlayer player, PlayerQuestModel PlayerQuestData)
        {
            try
            {
                if (!player.IsCharacterData()) return;

                var returnLine = Get(player, PlayerQuestData.Line);
                if (returnLine != tracy_quests.Error) qMain.UpdatePerform(player, "npc_tracy", (short)returnLine);
            }
            catch (Exception e)
            {
                Log.Write($"Perform Task.Run Exception: {e}");
            }
        }

        [ServerEvent(Event.ResourceStart)]
        public void onResourceStart()
        {
            // PedSystem.Repository.CreateQuest("a_f_y_bevhills_02", new Vector3(355.82297, -584.91614, 43.261227), 57.7488f, questName: "npc_tracy", title: "~y~NPC~w~ Трейси\nКвестовый персонаж", colShapeEnums: ColShapeEnums.QuestTracy );
            // PedSystem.Repository.CreateQuest("s_m_y_dockwork_01", new Vector3(355.3342, -584.07764, 44.105312), 154.06f, questName: "s_m_y_dockwork_01", title: "~y~NPC~w~\n Дворник", isBlipVisible: false);
        }

        public static tracy_quests Get(ExtPlayer player, int Line, bool Reward = false)
        {
            if (!player.IsCharacterData()) return tracy_quests.Error;

            switch ((tracy_quests)Line)
            {
                case tracy_quests.Start:
                    qMain.SetQuests(player, "npc_doctor", true, 0, false);
                    qMain.UpdateDisplayInHood(player, "npc_tracy", false);
                    qMain.UpdateDisplayInHood(player, "npc_doctor", true);
                    return tracy_quests.NoMission;
                case tracy_quests.End:
                    //Награды
                    UpdateData.Exp(player, 10);
                    Wallet.Change(player, 2500);
                    return tracy_quests.NoMission;
            }

            return tracy_quests.Error;
        }

        [Interaction(ColShapeEnums.QuestTracy)]
        public static void Open(ExtPlayer player, int index)
        {
            var sessionData = player.GetSessionData();
            if (sessionData == null) return;
            if (!player.IsCharacterData()) return;
            if (sessionData.CuffedData.Cuffed)
            {
                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                    LangFunc.GetText(LangType.Ru, DataName.IsCuffed), 3000);
                return;
            }

            if (sessionData.DeathData.InDeath)
            {
                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                    LangFunc.GetText(LangType.Ru, DataName.IsDying), 3000);
                return;
            }

            if (Main.IHaveDemorgan(player, true)) return;
            var isBool = qMain.SetQuests(player, "npc_tracy", true);
            if (!isBool) return;
            var questData = player.GetQuest();
            if (questData == null)
                return;

            Trigger.ClientEvent(player, "client.quest.open", index, "npc_tracy", questData.Line, questData.Status,
                questData.Complete);
        }
    }
}