using System;
using System.Linq;
using GTANetworkAPI;
using NeptuneEvo.Localization;
using NeptuneEvo.Character;
using NeptuneEvo.Chars;
using NeptuneEvo.Core;
using NeptuneEvo.Handles;
using NeptuneEvo.Players;
using NeptuneEvo.SDK;

namespace NeptuneEvo.World
{
    internal class Chat : Script
    {
        private static readonly nLog Log = new nLog("World.Chat");

        [ServerEvent(Event.ChatMessage)]
        public void API_onChatMessage(ExtPlayer player, string message)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null) return;
                var characterData = player.GetCharacterData();
                if (characterData == null) return;
                if (characterData.Unmute > 0)
                {
                    Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                        LangFunc.GetText(LangType.Ru, DataName.YouMutedMins, characterData.Unmute / 60), 3000);
                    return;
                }

                if (Main.IHaveDemorgan(player, true) || sessionData.DeathData.InDeath) return;
                message = Main.RainbowExploit(message);
                var testmsg = message.ToLower();
                if (Main.stringDefaultBlock.Any(c => testmsg.Contains(c))) return;
                var id = new[] { player.Value };
                var text = "{name}: " + message;

                //Trigger.PlayAnimation(player, "amb@world_human_hang_out_street@male_a@idle_a", "idle_a", 48);

                var adminConfig = characterData.ConfigData.AdminOption;

                if (characterData.AdminLVL > 0 && adminConfig.RedName)
                    text = "(( Администратор {name}: " + message + " ))";

                foreach (var foreachPlayer in Main.GetPlayersInRadiusOfPosition(player.Position, 10f,
                             UpdateData.GetPlayerDimension(player)))
                {
                    Trigger.ClientEvent(foreachPlayer, "sendRPMessage", "chat", text, id);
                    ChatHeadOverlay.SendOverlayMessage(foreachPlayer, player.Value, ChatHeadOverlay.MessageType.Message,
                        message);
                }

                var phoneMeta = sessionData.VoiceData;
                if (phoneMeta.CallingState == "talk")
                {
                    var target = phoneMeta.Target;
                    var targetCharacterData = target.GetCharacterData();
                    if (targetCharacterData == null) return;
                    var pSim = characterData.Sim;
                    var contactName = targetCharacterData.Contacts.ContainsKey(pSim)
                        ? targetCharacterData.Contacts[pSim]
                        : pSim.ToString();
                    Trigger.SendChatMessage(target, $"[В телефоне] {contactName}: {message}");
                    GameLog.AddInfo(
                        $"(CChat) player({characterData.UUID}) {message} -> player({targetCharacterData.UUID})");
                }
                else
                {
                    GameLog.AddInfo($"(Chat) player({characterData.UUID}) {message}");
                }
            }
            catch (Exception e)
            {
                Log.Write($"API_onChatMessage Exception: {e}");
            }
        }
    }
}