using System.Collections.Generic;
using System.Linq;
using NeptuneEvo.Handles;
using NeptuneEvo.Table.Tasks.Models;

namespace NeptuneEvo.Table.Models
{
    public class TableData
    {
        public List<BoardData> BoardsList = new List<BoardData>();
        public Dictionary<int, DepartmentData> Departments = new Dictionary<int, DepartmentData>();
        public string Discord;
        public TableTaskPlayerData[] TasksData = null;
        public string Name { get; set; }
        public int Id { get; set; }
        public bool IsOpenStock { get; set; } = false;
        public int Drugs { get; set; } = 0;
        public int Materials { get; set; } = 0;
        public int MedKits { get; set; } = 0;
        public int Money { get; set; } = 0;
        public List<RankToAccess> DefaultAccess { get; set; } = new List<RankToAccess>();
        public Dictionary<int, RankData> Ranks { get; set; } = new Dictionary<int, RankData>();
        public List<WeaponSetData> WeaponSetsData { get; set; } = new List<WeaponSetData>();
        public ExtTextLabel StockLabel { get; set; } = null;

        public int LeaderRank()
        {
            return Ranks.Keys.OrderBy(r => r).LastOrDefault();
        }
    }
}