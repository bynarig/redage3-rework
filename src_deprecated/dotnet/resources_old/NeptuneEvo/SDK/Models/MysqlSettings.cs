using System.Collections.Generic;

namespace NeptuneEvo.SDK.Models
{
    public class MysqlSettings : Mysql
    {
        public List<Mysql> OtherList = new List<Mysql>();
    }
}