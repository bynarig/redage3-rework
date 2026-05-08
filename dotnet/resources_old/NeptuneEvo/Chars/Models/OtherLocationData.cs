namespace NeptuneEvo.Chars.Models
{
    /// <summary>
    ///     Данные пользователя
    /// </summary>
    public class OtherLocationData
    {
        /// <summary>
        ///     Конструктор данных пользователя
        /// </summary>
        /// <param name="Location">
        ///     <see cref="Location" />
        /// </param>
        /// <param name="OtherId">
        ///     <see cref="OtherId" />
        /// </param>
        public OtherLocationData(string Location, int OtherId)
        {
            this.Location = Location;
            this.OtherId = OtherId;
        }

        #region Свойства

        /// <summary>
        ///     Id в бд
        /// </summary>
        public string Location { get; set; }

        /// <summary>
        ///     Item Id
        /// </summary>
        public int OtherId { get; set; }

        #endregion
    }
}