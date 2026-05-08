namespace NeptuneEvo.BattlePass.Models
{
    public class MissionTask
    {
        public int BattlePassTaskId;
        public int Money;
        public string Name;
        public string Title;

        public MissionTask(string name, string title, int money, int battlePassTaskId)
        {
            Name = name;
            Title = title;
            Money = money;
            BattlePassTaskId = battlePassTaskId;
        }
    }
}