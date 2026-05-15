using System;

namespace NeptuneEvo.Quests.Models
{
    public class PlayerQuestModel
    {
        public PlayerQuestModel(string ActorName, int Line, int Status, bool Complete, DateTime Time)
        {
            this.ActorName = ActorName;
            this.Line = Line;
            this.Status = Status;
            this.Complete = Complete;
            this.Time = Time;
        }

        public string ActorName { get; set; }
        public int Line { get; set; }
        public int Status { get; set; }
        public bool Complete { get; set; }
        public DateTime Time { get; set; }
    }
}