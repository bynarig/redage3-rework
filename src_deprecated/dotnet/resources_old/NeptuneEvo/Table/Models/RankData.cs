using System.Collections.Generic;

namespace NeptuneEvo.Table.Models
{
    public class RankData
    {
        public List<RankToAccess> Access = new List<RankToAccess>();
        public int MaxScore = 0;
        public string Name = "";
        public int Salary = 0;
    }
}