using Bridge.Contracts;
using GTANetworkAPI;
using System;

namespace RageBridge.Handlers
{
    // Each Script subclass is auto-discovered by RAGE:MP via reflection.
    public class PlayerEventHandler : Script
    {
        [ServerEvent(Event.PlayerConnected)]
        public void OnPlayerConnected(Player player)
        {
            Main.EventBus.Publish(new GameEvent
            {
                EventId = Guid.NewGuid().ToString(),
                PlayerConnected = new PlayerConnectedEvent
                {
                    Player = new PlayerInfo
                    {
                        Id             = player.Id,
                        Name           = player.Name,
                        SocialClubName = player.SocialClubName,
                        Ip             = player.Address
                    }
                }
            });
        }

        [ServerEvent(Event.PlayerDisconnected)]
        public void OnPlayerDisconnected(Player player, DisconnectionType type)
        {
            Main.EventBus.Publish(new GameEvent
            {
                EventId = Guid.NewGuid().ToString(),
                PlayerDisconnected = new PlayerDisconnectedEvent
                {
                    PlayerId = player.Id,
                    Reason   = type.ToString()
                }
            });
        }

        [ServerEvent(Event.PlayerSpawn)]
        public void OnPlayerSpawned(Player player)
        {
            Main.EventBus.Publish(new GameEvent
            {
                EventId       = Guid.NewGuid().ToString(),
                PlayerSpawned = new PlayerSpawnedEvent { PlayerId = player.Id }
            });
        }

        [ServerEvent(Event.PlayerDeath)]
        public void OnPlayerDeath(Player player, NetHandle killer, uint weapon)
        {
            Main.EventBus.Publish(new GameEvent
            {
                EventId     = Guid.NewGuid().ToString(),
                PlayerDeath = new PlayerDeathEvent
                {
                    PlayerId = player.Id,
                    KillerId = killer.IsNull ? 0u : (uint)killer.Value,
                    Weapon   = weapon
                }
            });
        }

        [ServerEvent(Event.ChatMessage)]
        public void OnPlayerChat(Player player, string message)
        {
            Main.EventBus.Publish(new GameEvent
            {
                EventId    = Guid.NewGuid().ToString(),
                PlayerChat = new PlayerChatEvent { PlayerId = player.Id, Message = message }
            });
        }

        // Clients call mp.events.callRemote("serverEvent", eventName, argsJson)
        // to forward arbitrary events to GameServer without touching Bridge code.
        [RemoteEvent("serverEvent")]
        public void OnServerEvent(Player player, string eventName, string argsJson)
        {
            var evt = new ServerEventData { PlayerId = player.Id, EventName = eventName };
            evt.Args.Add(argsJson);

            Main.EventBus.Publish(new GameEvent
            {
                EventId     = Guid.NewGuid().ToString(),
                ServerEvent = evt
            });
        }
    }
}
