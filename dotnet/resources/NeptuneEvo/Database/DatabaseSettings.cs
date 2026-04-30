using System.Collections.Generic;
using System.Linq;
using LinqToDB.Configuration;

namespace NeptuneEvo.Database
{
    internal class DatabaseSettings : ILinqToDBSettings
    {
        private readonly IConnectionStringSettings[] _connectionStrings;

        public DatabaseSettings(IConnectionStringSettings[] connectionStrings)
        {
            _connectionStrings = connectionStrings;
        }

        public IEnumerable<IDataProviderSettings> DataProviders => Enumerable.Empty<IDataProviderSettings>();

        public string DefaultConfiguration => "MySql.Data.MySqlClient";
        public string DefaultDataProvider => "MySql.Data.MySqlClient";

        public IEnumerable<IConnectionStringSettings> ConnectionStrings => _connectionStrings;
    }
}