using System.Collections.Generic;

namespace NeptuneEvo.BattlePass.Models
{
    public class MissionTasks
    {
        public int Count = 0;
        public int Index = 0;
        public bool IsDone = false;
        public bool IsReward = false;
    }

    public class MissionData
    {
        public int Select = -1;
        public List<MissionTasks> Tasks = new List<MissionTasks>();
    }
}