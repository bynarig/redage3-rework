using NeptuneEvo.BattlePass.Models;

namespace NeptuneEvo.Table.Tasks.Models
{
    public class TableTaskAwards
    {
        public TableTaskAwards(BattlePassRewardType type, int itemId = (int)Chars.Models.ItemId.Debug, int count = 1,
            string data = "", BattlePassRewardGender gender = BattlePassRewardGender.None)
        {
            Type = type;
            ItemId = itemId;
            Count = count;
            Data = data;
            Gender = gender;
        }

        public BattlePassRewardType Type { get; set; }
        public int ItemId { get; set; }
        public int Count { get; set; }
        public string Data { get; set; }
        public BattlePassRewardGender Gender { get; set; }
    }
}