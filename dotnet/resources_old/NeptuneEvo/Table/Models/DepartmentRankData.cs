using System.Collections.Generic;

namespace NeptuneEvo.Table.Models
{
    public class DepartmentRankData
    {
        public List<RankToAccess> Access = new List<RankToAccess>();
        public List<RankToAccess> Lock = new List<RankToAccess>();
        public string Name = "";
    }
}