using System.Collections.Generic;

namespace NeptuneEvo.NewCasino
{
    /// <summary>
    ///     Данные пользователя
    /// </summary>
    public class BlackjackPlayerInfo
    {
        /// <summary>
        ///     Конструктор данных пользователя
        /// </summary>
        /// <param name="TableId">
        ///     <see cref="Index" />
        /// </param>
        /// <param name="SlotId">
        ///     <see cref="SlotId" />
        /// </param>
        public BlackjackPlayerInfo(int TableId, int SlotId)
        {
            Index = TableId;
            this.SlotId = SlotId;
        }

        #region Свойства

        /// <summary>
        ///     Колличество
        /// </summary>
        public int Index;

        public int SlotId;
        public List<string> Hand = new List<string>();
        public List<string> SplitHand = new List<string>();
        public bool Join = false;
        public int Rate = 0;
        public string Move = null;
        public bool Doubled = false;

        #endregion
    }
}