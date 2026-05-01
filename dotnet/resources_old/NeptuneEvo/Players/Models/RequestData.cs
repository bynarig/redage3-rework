using System;
using NeptuneEvo.Handles;

namespace NeptuneEvo.Players.Models
{
    public class RequestData
    {
        public bool IsRequested { get; set; } = false;
        public string Request { get; set; } = null;
        public ExtPlayer From { get; set; } = null;
        public DateTime Time { get; set; } = DateTime.MinValue;
    }
}