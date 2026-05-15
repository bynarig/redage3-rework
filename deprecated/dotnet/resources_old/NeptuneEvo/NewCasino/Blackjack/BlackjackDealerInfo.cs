using System.Collections.Generic;
using NeptuneEvo.Handles;

namespace NeptuneEvo.NewCasino
{
    /// <summary>
    ///     Данные пользователя
    /// </summary>
    public class BlackjackDealerInfo
    {
        #region Свойства

        /// <summary>
        ///     Колличество
        /// </summary>
        public List<ExtPlayer> Players = new List<ExtPlayer>();

        public List<ExtPlayer> GamePlayers = new List<ExtPlayer>();
        public List<string> Hand = new List<string>();
        public List<string> Cards = new List<string>();
        public List<int> Chairs = new List<int>();
        public bool GameRunning = false;

        #endregion
    }
}