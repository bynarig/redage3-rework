using System;

namespace NeptuneEvo.Players.Models
{
    public class AfkData
    {
        public bool IsAfk = false;
        public int PayDayMinute = 0;
        public DateTime Time = DateTime.Now;
    }
}