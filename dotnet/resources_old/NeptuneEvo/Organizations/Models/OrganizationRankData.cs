using System.Collections.Generic;
using NeptuneEvo.Table.Models;

namespace NeptuneEvo.Organizations.Models
{
    public class OrganizationRankData
    {
        public List<RankToAccess> Access = new List<RankToAccess>();
        public int MaxScore = 0;
        public string Name = "";
        public int Salary = 0;
    }
}