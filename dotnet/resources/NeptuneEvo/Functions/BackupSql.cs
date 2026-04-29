using NeptuneEvoSDK;
using System;
using System.Diagnostics;
using NeptuneEvoSDK.Models;

namespace NeptuneEvo.Functions
{
    class BackupSql
    {
        public static void Backup()
        {
            Main.Log.Write("Backup Starting");

            var config = Settings.ReadAsync(mainDB", new MysqlSettings());
            var date = DateTime.Now;
            var outputFile = $"backups/BD_Day{date.Day}.sql";

            try
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = pg_dump",
                    Arguments = $"-h {config.Server} -U {config.User} -d {config.DataBase} -f \"{outputFile}\" --no-password",
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Environment = { [PGPASSWORD"] = config.Password }
                };

                using var process = Process.Start(startInfo);
                string stderr = process.StandardError.ReadToEnd();
                process.WaitForExit();

                if (process.ExitCode == 0)
                    Main.Log.Write($"Backup saved to {outputFile}");
                else
                    Main.Log.Write($"pg_dump error: {stderr}", nLog.Type.Error);
            }
            catch (Exception e)
            {
                Main.Log.Write($"Backup Exception: {e}", nLog.Type.Error);
            }

            Main.Log.Write("Backup End");
        }
    }
}
