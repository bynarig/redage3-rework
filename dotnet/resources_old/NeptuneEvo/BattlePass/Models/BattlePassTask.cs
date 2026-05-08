namespace NeptuneEvo.BattlePass.Models
{
    public enum BattlePassRewardDiff
    {
        None = -1,
        Easy = 0,
        Medium,
        Hard
    }

    public class BattlePassTask
    {
        public int Count;
        public BattlePassRewardDiff Diff;
        public int Exp;
        public int Id;
        public int MissionMoney;
        public string MissionName;
        public string MissionTitle;
        public string Text;

        public BattlePassTask(int id, string text, int count, int exp, string missionName = "",
            string missionTitle = "", int missionMoney = 0, BattlePassRewardDiff diff = BattlePassRewardDiff.None)
        {
            Id = id;
            Text = text;
            Count = count;
            Exp = exp;
            MissionName = missionName;
            MissionTitle = missionTitle;
            MissionMoney = missionMoney;
            Diff = diff;
        }
    }
}