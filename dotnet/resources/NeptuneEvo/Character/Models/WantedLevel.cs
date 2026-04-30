using System;

namespace NeptuneEvo.Character.Models
{
    public class WantedLevel
    {
        /// <summary>
        /// </summary>
        /// <param name="level"></param>
        /// <param name="whoGive"></param>
        /// <param name="date"></param>
        /// <param name="reason"></param>
        public WantedLevel(int level, string whoGive, DateTime date, string reason)
        {
            Level = level;
            WhoGive = whoGive;
            Date = date;
            Reason = reason;
        }

        /// <summary>
        /// </summary>
        public int Level { get; set; }

        /// <summary>
        /// </summary>
        public string WhoGive { get; set; }

        /// <summary>
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// </summary>
        public string Reason { get; set; }
    }
}