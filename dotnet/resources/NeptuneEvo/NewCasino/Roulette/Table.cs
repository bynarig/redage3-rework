using System.Collections.Generic;
using NeptuneEvo.Handles;

namespace NeptuneEvo.NewCasino
{
    public class Table
    {
        /// <summary>
        ///     Статус если игра в процессе
        /// </summary>
        public bool Process = false;

        /// <summary>
        ///     Список игроков за столом
        /// </summary>
        public List<ExtPlayer> Seats = new List<ExtPlayer> { null, null, null, null };

        /// <summary>
        ///     ID стола
        /// </summary>
        public int TableId;

        /// <summary>
        ///     Таймер
        /// </summary>
        public string WaitTimeout = null;

        /// <summary>
        ///     Key победного числа от Roulette Dictionary?
        /// </summary>
        public int Win = 0;

        /// <summary>
        ///     Стринг правильного победного числа
        /// </summary>
        public string WinNum = "-";

        /// <summary>
        ///     Выигранные споты?
        /// </summary>
        public List<int> WinSpots = new List<int>();

        public Table(int table)
        {
            TableId = table;
        }
    }
}