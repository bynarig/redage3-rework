using System;
using System.Linq;
using System.Threading.Tasks;
using Database;
using LinqToDB;
using NeptuneEvo.Debugs;
using NeptuneEvo.Players.Models;
using Newtonsoft.Json;

namespace NeptuneEvo.Fractions.Models
{
    public class FractionMemberData : MemberData
    {
        public DateTime PatrollingTime = DateTime.MinValue;

        public async Task Save(ServerBD db)
        {
            try
            {
                IsSave = false;

                await db.Fracranks
                    .Where(f => f.Uuid == UUID)
                    .Set(f => f.Name, Name)
                    .Set(f => f.Rank, Rank)
                    .Set(f => f.Avatar, Avatar)
                    .Set(f => f.DepartmentId, DepartmentId)
                    .Set(f => f.DepartmentRank, DepartmentRank)
                    .Set(f => f.Access, JsonConvert.SerializeObject(Access))
                    .Set(f => f.@lock, JsonConvert.SerializeObject(Lock))
                    .Set(f => f.Score, Score)
                    .Set(f => f.LastLoginDate, DateTime.Now)
                    .Set(f => f.Time, JsonConvert.SerializeObject(Time))
                    .Set(f => f.Tasks, JsonConvert.SerializeObject(TasksData))
                    .UpdateAsync();
            }
            catch (Exception e)
            {
                Repository.Exception(e);
            }
        }
    }
}