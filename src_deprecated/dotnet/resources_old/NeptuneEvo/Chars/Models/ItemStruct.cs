namespace NeptuneEvo.Chars.Models
{
    /// <summary>
    ///     Данные пользователя
    /// </summary>
    public class ItemStruct
    {
        /// <summary>
        ///     Конструктор данных пользователя
        /// </summary>
        /// <param name="Location">
        ///     <see cref="Location" />
        /// </param>
        /// <param name="Index">
        ///     <see cref="Index" />
        /// </param>
        /// <param name="Item">
        ///     <see cref="Item" />
        /// </param>
        public ItemStruct(string Location, int Index, InventoryItemData Item)
        {
            this.Location = Location;
            this.Index = Index;
            this.Item = Item;
        }

        #region Свойства

        /// <summary>
        ///     Id в бд
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        ///     Дополнительная дата
        /// </summary>

        public int Index { get; set; }

        /// <summary>
        ///     Дополнительная дата
        /// </summary>

        public InventoryItemData Item { get; set; }

        #endregion
    }
}