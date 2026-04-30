using System;
using System.Collections.Generic;

namespace NeptuneEvo.Chars.Models
{
    /// <summary>
    ///     Данные пользователя
    /// </summary>
    public class InventoryItemData
    {
        /// <summary>
        ///     Конструктор данных пользователя
        /// </summary>
        /// <param name="SqlId">
        ///     <see cref="SqlId" />
        /// </param>
        /// <param name="ItemId">
        ///     <see cref="ItemId" />
        /// </param>
        /// <param name="Count">
        ///     <see cref="Count" />
        /// </param>
        /// <param name="Data">
        ///     <see cref="Data" />
        /// </param
        /// <param name="Index">
        ///     <see cref="Index" />
        /// </param>
        public InventoryItemData(int SqlId = 0, ItemId ItemId = ItemId.Debug, int Count = 0, string Data = "-1_-1_none",
            int Index = 0)
        {
            this.SqlId = SqlId;
            this.ItemId = ItemId;
            this.Count = Count;
            this.Data = Data;
            this.Index = Index;
        }

        public Dictionary<string, int> GetData()
        {
            if (Data == null || Data.Split('_').Length < 2)
                return new Dictionary<string, int>
                {
                    { "Variation", -1 },
                    { "Texture", -1 }
                };
            return new Dictionary<string, int>
            {
                { "Variation", Convert.ToInt32(Data.Split('_')[0]) },
                { "Texture", Convert.ToInt32(Data.Split('_')[1]) }
            };
        }

        public bool GetGender()
        {
            if (Data == null || Data.Split('_').Length >= 2) return Convert.ToBoolean(Data.Split('_')[2]);
            return false;
        }

        #region Свойства

        /// <summary>
        ///     Id в бд
        /// </summary>
        public int SqlId { get; set; }

        /// <summary>
        ///     Item Id
        /// </summary>
        public ItemId ItemId { get; set; } = 0;

        /// <summary>
        ///     Колличество
        /// </summary>
        public int Count { get; set; } = 1;

        /// <summary>
        ///     Дополнительная дата
        /// </summary>
        public string Data { get; set; }

        /// <summary>
        ///     Дополнительная дата
        /// </summary>
        public int Index { get; set; }

        /// <summary>
        ///     Цена
        /// </summary>
        public int Price { get; set; } = 0;

        #endregion
    }
}