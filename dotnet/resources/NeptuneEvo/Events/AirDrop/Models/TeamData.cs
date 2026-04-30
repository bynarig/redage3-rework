namespace NeptuneEvo.Events.AirDrop.Models
{
    public class TeamData
    {
        public TeamData(int frags, int matesInZone)
        {
            TeamFrags = frags;
            TeammatesInZone = matesInZone;
        }

        public int TeamFrags { get; set; }
        public int TeammatesInZone { get; set; }
    }
}