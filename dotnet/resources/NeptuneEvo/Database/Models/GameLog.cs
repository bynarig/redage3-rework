using System;
using System.Threading;
using Database;
using NeptuneEvoSDK;

namespace NeptuneEvo.Database.Models
{
    public class GameLog
    {
        private static readonly nLog Log = new nLog("Database.GameLog");
                
        public static void Start()
        {
            var thread = new Thread(Worker);
            thread.IsBackground = true;
            thread.Name = GameLog";
            thread.Start();
        }
        private static async void Worker()
        {
            while (true)
            {
                
                await Core.GameLog.Save();
                
                Thread.Sleep(1000 * 30);
            }
        }
    }
}