using System.Collections.Generic;

namespace NeptuneEvoSDK.Models
{
    public class MysqlSettings : Mysql
    {
        public List<Mysql> OtherList = new List<Mysql>();
    }
}