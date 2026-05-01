using LinqToDB.Configuration;

namespace NeptuneEvo.Database
{
    internal class ConnectionInfo : IConnectionStringSettings
    {
        public ConnectionInfo(string connectionName, string host, string user, string password, string database)
        {
            Name = connectionName;
            ProviderName = "MySql.Data.MySqlClient";
            ConnectionString = $"SERVER={host};DATABASE={database};UID={user};PASSWORD={password};SSLMode=none;";
        }

        public string ConnectionString { get; set; }
        public string Name { get; set; }
        public string ProviderName { get; set; }
        public bool IsGlobal => false;
    }
}