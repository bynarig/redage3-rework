using System;
using System.Linq;
using System.Threading.Tasks;
using Database;
using LinqToDB;
using NeptuneEvo.Character.Config.Models;
using NeptuneEvo.Handles;
using NeptuneEvo.Players;
using Newtonsoft.Json;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Character.Config
{
    internal class Repository
    {
        private static readonly nLog Log = new nLog("Core.Character.Config");

        public static async Task<ChatData> Load(ServerBD db, int uuid)
        {
            try
            {
                var chatData = await db.Chatcfg
                    .Where(v => v.Uuid == uuid)
                    .FirstOrDefaultAsync();

                if (chatData != null) return JsonConvert.DeserializeObject<ChatData>(chatData.Setting);

                db.Insert(new Chatcfgs
                {
                    Uuid = uuid,
                    Setting = JsonConvert.SerializeObject(new ChatData())
                });
            }
            catch (Exception e)
            {
                Log.Write($"ConfigLoad Exception: {e}");
            }

            return new ChatData();
        }

        public static void Init(ExtPlayer player, ChatData chatData)
        {
            try
            {
                if (chatData == null)
                    return;

                var sessionData = player.GetSessionData();
                if (sessionData == null)
                    return;

                Trigger.ClientEvent(player, "loadChatConfig", JsonConvert.SerializeObject(chatData));

                sessionData.isDeaf = chatData.Deaf;
                sessionData.Punishments = chatData.APunishments;
                sessionData.HitPoint = chatData.hitPoint;

                player.SetSharedData("FacialClipset", chatData.FacialEmotion);
                player.SetSharedData("WalkStyle", chatData.WalkStyle);
                player.SetSharedData("isDeaf", chatData.Deaf);
            }
            catch (Exception e)
            {
                Log.Write($"StartWork Exception: {e}");
            }
        }

        public static void Update(ExtPlayer player, string data)
        {
            try
            {
                var sessionData = player.GetSessionData();
                if (sessionData == null)
                    return;

                var characterData = player.GetCharacterData();
                if (characterData == null)
                    return;

                characterData.ChatData = JsonConvert.DeserializeObject<ChatData>(data);

                player.SetSharedData("FacialClipset", characterData.ChatData.FacialEmotion);
                player.SetSharedData("WalkStyle", characterData.ChatData.WalkStyle);
                player.SetSharedData("isDeaf", characterData.ChatData.Deaf);

                sessionData.isDeaf = characterData.ChatData.Deaf;
                sessionData.Punishments = characterData.ChatData.APunishments;
                sessionData.HitPoint = characterData.ChatData.hitPoint;
            }
            catch (Exception e)
            {
                Log.Write($"Update Exception: {e}");
            }
        }

        public static async Task Save(ServerBD db, ExtPlayer player, int uuid)
        {
            try
            {
                var characterData = player.GetCharacterData();
                if (characterData == null)
                    return;

                await db.Chatcfg
                    .Where(v => v.Uuid == uuid)
                    .Set(v => v.Setting, JsonConvert.SerializeObject(characterData.ChatData))
                    .UpdateAsync();
            }
            catch (Exception e)
            {
                Log.Write($"Save Exception: {e}");
            }
        }
    }
}