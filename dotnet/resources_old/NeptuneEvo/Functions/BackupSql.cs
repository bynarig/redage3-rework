using System;
using MySql.Data.MySqlClient;
using NeptuneEvo.SDK;
using NeptuneEvo.SDK.Models;

namespace NeptuneEvo.Functions
{
    internal class BackupSql
    {
        public static void Backup()
        {
            Main.Log.Write("Backup Starting");

            var config = Settings.ReadAsync("mainDB", new MysqlSettings());

            var connection =
                $"Host={config.Server};" +
                $"User={config.User};" +
                $"Password={config.Password};" +
                $"Database={config.DataBase};" +
                "SslMode=None;";

            using (var conn = new MySqlConnection(connection))
            {
                using (var cmd = new MySqlCommand())
                {
                    using (var mb = new MySqlBackup(cmd))
                    {
                        cmd.Connection = conn;
                        conn.Open();
                        var date = DateTime.Now;
                        mb.ExportToFile($"backups/BD_Day{date.Day}.sql");
                        conn.Close();
                    }
                }
            }

            Main.Log.Write("Backup End");
        }
    }
}