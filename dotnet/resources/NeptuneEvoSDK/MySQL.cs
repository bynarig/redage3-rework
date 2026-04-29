using System;
using Npgsql;
using System.Data.Common;
using System.Data;
using System.Threading.Tasks;
using NeptuneEvoSDK.Models;


namespace NeptuneEvoSDK
{
    /// <summary>
    ///
    /// </summary>
    public static class MySQL
    {
        private static MysqlSettings config = Settings.ReadAsync("mainDB", new MysqlSettings());
        private static nLog Log = new nLog(MySQL");

        private static string Connection = null;
        private static string LogsConnection = null;
        /// <summary>
        ///
        /// </summary>
        public static string LogDB = config.DataBase + _"logs";
        /// <summary>
        ///
        /// </summary>
        public static bool Debug = false;

        /// <summary>
        ///
        /// </summary>
        public static void Init()
        {
            if (Connection is string) return;
            Connection =
                $"Host={config.Server};" +
                $"Username={config.User};" +
                $"Password={config.Password};" +
                $"Database={config.DataBase};" +
                $"SSL Mode=Disable;";

            if (LogsConnection is string) return;
            LogsConnection =
                $"Host={config.Server};" +
                $"Username={config.User};" +
                $"Password={config.Password};" +
                $"Database={config.DataBase}logs;" +
                $"SSL Mode=Disable;";
        }

        /// <summary>
        /// Тест соединения с базой
        /// </summary>
        /// <returns>True - если все хорошо</returns>
        public static bool Test()
        {
            Log.Debug("Testing connection...");
            try
            {
                using (NpgsqlConnection conn = new NpgsqlConnection(Connection))
                {
                    conn.Open();
                    Log.Debug("Connection is successful!", nLog.Type.Success);
                    conn.Close();
                }
                return true;
            }
            catch (ArgumentException ae)
            {
                Log.Write($"Сonnection string contains an error\n{ae.ToString()}", nLog.Type.Error);
                return false;
            }
            catch (NpgsqlException me)
            {
                Log.Write($"({me.SqlState}) {me.Message}", nLog.Type.Error);
                return false;
            }
        }

        /// <summary>
        /// Выполнить запрос без ответа
        /// </summary>
        /// <param name=command">Передаем заранее составленную команду</param>
        public static void Query(NpgsqlCommand command)
        {
            try
            {
                if (command.CommandText.Length < 1) Log.Write($"BAD Query?: '{command.CommandText}'", nLog.Type.Error);
                else
                {
                    if (Debug) Log.Debug("Query to DB:\n" + command.CommandText);
                    using (NpgsqlConnection connection = new NpgsqlConnection(Connection))
                    {
                        connection.Open();

                        command.Connection = connection;

                        command.ExecuteNonQuery();

                    }
                }
            }
            catch (Exception e)
            {
                Log.Write($"Query({command.CommandText}) Exception: {e.ToString()}");
            }
        }
        /// <summary>
        /// Выполнить запрос без ответа
        /// </summary>
        /// <param name=command">Передаем заранее составленную команду</param>
        public static async Task LogsQueryAsync(NpgsqlCommand command)
        {
            try
            {
                if (command.CommandText.Length < 1) Log.Write($"BAD LogsQueryAsync?: '{command.CommandText}'", nLog.Type.Error);
                else
                {
                    if (Debug) Log.Debug("Query to LogsDB:\n" + command.CommandText);
                    using (NpgsqlConnection connection = new NpgsqlConnection(LogsConnection))
                    {
                        await connection.OpenAsync();

                        command.Connection = connection;

                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception e)
            {
                Log.Write($"LogsQuery({command.CommandText}) Exception: {e.ToString()}");
            }
        }

        /// <summary>
        /// Выполнить запрос без ответа
        /// </summary>
        /// <param name=command">Передаем команду в виде строки</param>
        public static async void LogsQuery(string command)
        {
            using (NpgsqlCommand cmd = new NpgsqlCommand(command))
            {
                await LogsQueryAsync(cmd);
            }
        }

        /// <summary>
        /// Выполнить запрос без ответа
        /// </summary>
        /// <param name=command">Передаем команду в виде строки</param>
        public static void Query(string command)
        {
            using (NpgsqlCommand cmd = new NpgsqlCommand(command))
            {
                Query(cmd);
            }
        }


        /// <summary>
        /// Выполнить запрос без ответа
        /// </summary>
        /// <param name=command">Передаем заранее составленную команду</param>
        public static async Task QueryAsync(NpgsqlCommand command)
        {
            try
            {
                if (command.CommandText.Length < 1) Log.Write($"BAD QueryAsync?: '{command.CommandText}'", nLog.Type.Error);
                else
                {
                    if (Debug) Log.Debug("Query to DB:\n" + command.CommandText);
                    using (NpgsqlConnection connection = new NpgsqlConnection(Connection))
                    {
                        await connection.OpenAsync();

                        command.Connection = connection;

                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception e)
            {
                Log.Write($"QueryAsync({command.CommandText}) #1 Exception: {e.ToString()}");
            }
        }


        /// <summary>
        /// Отправить запрос и считать ответ
        /// </summary>
        /// <param name=command">Передаем заранее составленную команду</param>
        /// <returns>Ответ базы данных в формате таблицы</returns>
        public static DataTable QueryRead(NpgsqlCommand command)
        {
            try
            {
                if (command.CommandText.Length < 1)
                {
                    Log.Write($"BAD QueryRead?: '{command.CommandText}'", nLog.Type.Error);
                    return null;
                }
                else
                {
                    if (Debug) Log.Debug("Query to DB:\n" + command.CommandText);
                    using (NpgsqlConnection connection = new NpgsqlConnection(Connection))
                    {
                        connection.Open();

                        command.Connection = connection;

                        using (DbDataReader reader = command.ExecuteReader())
                        {
                            using (DataTable result = new DataTable())
                            {
                                result.Load(reader);

                                return result;
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Log.Write($"QueryRead({command.CommandText}) Exception: {e.ToString()}");
                return null;
            }
        }


        /// <summary>
        /// Отправить запрос и считать ответ
        /// </summary>
        /// <param name=command">Передаем команду в виде строки</param>
        /// <returns>Ответ базы данных в формате таблицы</returns>
        public static DataTable QueryRead(string command)
        {
            using (NpgsqlCommand cmd = new NpgsqlCommand(command))
            {
                return QueryRead(cmd);
            }
        }


        /// <summary>
        /// Асинхронная версия Read
        /// </summary>
        /// <param name=command">Передаем заранее составленную команду</param>
        /// <returns>Ответ базы данных в формате таблицы</returns>
        public static async Task<DataTable> QueryReadAsync(NpgsqlCommand command)
        {
            try
            {
                if (command.CommandText.Length < 1)
                {
                    Log.Write($"BAD QueryReadAsync?: '{command.CommandText}'", nLog.Type.Error);
                    return null;
                }
                else
                {
                    if (Debug) Log.Debug("Query to DB:\n" + command.CommandText);
                    using (NpgsqlConnection connection = new NpgsqlConnection(Connection))
                    {
                        await connection.OpenAsync();

                        command.Connection = connection;

                        using (DbDataReader reader = await command.ExecuteReaderAsync())
                        {
                            using (DataTable result = new DataTable())
                            {
                                result.Load(reader);

                                return result;
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Log.Write($"QueryReadAsync({command.CommandText}) Exception: {e.ToString()}");
                return null;
            }
        }


        /// <summary>
        /// Асинхронная версия Read
        /// </summary>
        /// <param name=command">Передаем команду в виде строки</param>
        /// <returns>Ответ базы данных в формате таблицы</returns>
        public static async Task<DataTable> QueryReadAsync(string command)
        {
            using (NpgsqlCommand cmd = new NpgsqlCommand(command))
            {
                return await QueryReadAsync(cmd);
            }
        }

        /// <summary>
        /// Execute an INSERT and return the generated id via RETURNING id clause.
        /// The command text must end with RETURNING id (or include it).
        /// </summary>
        /// <param name=command"></param>
        /// <returns>The inserted row id</returns>
        public static int Insert(NpgsqlCommand command)
        {
            try
            {
                if (command.CommandText.Length < 1)
                {
                    Log.Write($"BAD Insert?: '{command.CommandText}'", nLog.Type.Error);
                    return 0;
                }
                else
                {
                    if (Debug) Log.Debug("Query to DB:\n" + command.CommandText);
                    // Append RETURNING id if not already present so we can get the inserted id
                    if (!command.CommandText.TrimEnd().EndsWith("RETURNING id", StringComparison.OrdinalIgnoreCase))
                        command.CommandText = command.CommandText.TrimEnd().TrimEnd(';') + " RETURNING id";

                    using (NpgsqlConnection connection = new NpgsqlConnection(Connection))
                    {
                        connection.Open();

                        command.Connection = connection;

                        var result = command.ExecuteScalar();
                        return result != null ? Convert.ToInt32(result) : 0;
                    }
                }
            }
            catch (Exception e)
            {
                Log.Write($"Insert({command.CommandText}) Exception: {e.ToString()}");
                return 0;
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name=dateTime"></param>
        /// <returns></returns>
        public static string ConvertTime(DateTime dateTime)
        {
            return dateTime.ToString(s");
        }
    }
}
