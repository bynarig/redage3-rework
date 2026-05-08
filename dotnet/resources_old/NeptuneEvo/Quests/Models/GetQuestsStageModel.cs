using System;

namespace NeptuneEvo.Quests.Models
{
    internal class GetQuestsStageModel
    {
        public GetQuestsStageModel(int Status, DateTime Time)
        {
            this.Status = Status;
            this.Time = Time;
        }

        public int Status { get; set; }
        public DateTime Time { get; set; }
    }
}