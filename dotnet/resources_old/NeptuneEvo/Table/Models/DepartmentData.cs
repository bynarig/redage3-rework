using System;
using System.Collections.Generic;

namespace NeptuneEvo.Table.Models
{
    public class DepartmentData
    {
        public DateTime Date;
        public string Name;
        public string Tag;
        public Dictionary<int, DepartmentRankData> Ranks { get; set; } = new Dictionary<int, DepartmentRankData>();
    }
}