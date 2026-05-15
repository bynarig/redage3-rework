using System;

namespace NeptuneEvo.Quests.Models
{
    internal class SetQuestsStageModel
    {
        public SetQuestsStageModel(int Status, int Line, DateTime Time, bool Complete, string Data)
        {
            this.Status = Status;
            this.Line = Line;
            this.Time = Time;
            this.Complete = Complete;
            this.Data = Data;
        }

        public int Status { get; set; }
        public int Line { get; set; }
        public DateTime Time { get; set; }
        public bool Complete { get; set; }
        public string Data { get; set; }
    }
}