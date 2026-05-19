namespace NeptuneEvo.Quests.Models
{
    internal class ShowQuestToHudModel
    {
        public ShowQuestToHudModel(string ActorName, int Line, sbyte Stage)
        {
            this.ActorName = ActorName;
            this.Line = Line;
            this.Stage = Stage;
        }

        public string ActorName { get; set; }
        public int Line { get; set; }
        public sbyte Stage { get; set; }
    }
}