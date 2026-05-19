using System;
using NeptuneEvo.Chars.Models;
using NeptuneEvo.Handles;

namespace NeptuneEvo.Players.Models
{
    public class TradePropertyData
    {
        public TradePropertyData(ExtPlayer player, DateTime Time)
        {
            Player = player;
            this.Time = Time;
        }

        public ExtPlayer Player { get; set; }
        public TradeStage Status { get; set; } = TradeStage.none;
        public string Number { get; set; } = null;
        public DateTime Time { get; set; } = DateTime.MinValue;
    }
}