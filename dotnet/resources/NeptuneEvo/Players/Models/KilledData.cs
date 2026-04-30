using System;
using NeptuneEvo.Handles;

namespace NeptuneEvo.Players.Models
{
    public class KilledData
    {
        public ExtPlayer Killed { get; set; } = null;
        public uint Weapon { get; set; }
        public DateTime Time { get; set; } = DateTime.MinValue;
    }
}