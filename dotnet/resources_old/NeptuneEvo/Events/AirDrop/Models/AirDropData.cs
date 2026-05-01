using System;
using GTANetworkAPI;
using NeptuneEvo.Handles;

namespace NeptuneEvo.Events.AirDrop.Models
{
    public class AirDropData
    {
        public AirDropData(int dropId)
        {
            DropId = dropId;
        }

        public int DropId { get; set; }
        public DateTime DateTime { get; set; } = DateTime.Now;
        public DateTime DateTimeNotification { get; set; } = DateTime.Now;
        public sbyte Status { get; set; } = 0;
        public Vector3 Position { get; set; } = new Vector3();
        public Vector3 CentralPosition { get; set; } = new Vector3();
        public int AirdropLockHealth { get; set; } = 20;
        public ExtPlayer AirdropHackPlayerInfo { get; set; } = null;
    }
}