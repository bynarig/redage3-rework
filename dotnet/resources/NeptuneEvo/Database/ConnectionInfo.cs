using LinqToDB.Configuration;

namespace NeptuneEvo.Database
{
    class ConnectionInfo : IConnectionStringSettings
    {
        public string ConnectionString { get; set; }
        public string Name { get; set; }
        public string ProviderName { get; set; }
        public bool IsGlobal => false;

        public ConnectionInfo(string connectionName, string host, string user, string password, string database)
        {
            this.Name = connectionName;
            this.ProviderName = PostgreSQL";
            this.ConnectionString = $"Host={host};Username={user};Password={password};Database={database};SSL Mode=Disable;";
        }
    }
}
