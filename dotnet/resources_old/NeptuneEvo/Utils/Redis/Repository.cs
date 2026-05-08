using System;
using GTANetworkAPI;
using NeptuneEvo.Utils.Redis.Models;
using Newtonsoft.Json;
using NeptuneEvo.SDK;
using StackExchange.Redis;

namespace NeptuneEvo.Utils.Redis
{
    public class Repository
    {
        private static readonly nLog Log = new nLog("Utils.Redis");

        private static ConnectionMultiplexer RedisInstance;

        private static readonly string ConfirmEmail = $"{Main.ServerNumber}_confirmEmail";
        private static readonly string Global = $"{Main.ServerNumber}_global";

        public static void Init()
        {
            try
            {
                var configurationOptions = new ConfigurationOptions
                {
                    EndPoints = { "127.0.0.1:6379" },
                    Password = ""
                };
                RedisInstance = ConnectionMultiplexer.Connect(configurationOptions);

                var sub = RedisInstance.GetSubscriber();

                sub.Subscribe(ConfirmEmail, ConfirmEmailHandler);
                sub.Subscribe(Global, GlobalHandler);

                Log.Write($"Start: All ok. For server: {Main.ServerNumber}");
            }
            catch (Exception e)
            {
                Log.Write($"StartWork Exception: {e}");
            }
        }

        private static void ConfirmEmailHandler(RedisChannel channel, RedisValue message)
        {
            try
            {
                var confirmEmailVerification = JsonConvert.DeserializeObject<ConfirmEmailVerification>(message);

                Accounts.Email.Registration.Repository.VerificationConfirm(confirmEmailVerification.Hash,
                    confirmEmailVerification.Ga);
                Accounts.Email.Confirmation.Repository.VerificationConfirm(confirmEmailVerification.Hash,
                    confirmEmailVerification.Ga);
            }
            catch (Exception e)
            {
                Log.Write($"ConfirmEmailHandler Exception: {e}");
            }
        }

        private static void GlobalHandler(RedisChannel channel, RedisValue message)
        {
            NAPI.Chat.SendChatMessageToAll(message);
        }
    }
}