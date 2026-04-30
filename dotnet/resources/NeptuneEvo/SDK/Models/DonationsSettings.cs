namespace NeptuneEvo.SDK.Models
{
    public class DonationsSettings : Mysql
    {
        /// <summary>
        ///     Множетель конвертации
        /// </summary>
        public short Convert = 5;

        // Деньги с донат 
        /// <summary>
        ///     Рб в часах счастливых
        /// </summary>
        public int HappyHoursRB = 250;

        /// <summary>
        ///     Включена ли проверка доната
        /// </summary>
        public bool IsCheck = false;

        /// <summary>
        ///     Бонус при пополнении
        /// </summary>
        public bool IsSaleEnable = false;

        /// <summary>
        ///     Множетель доната
        /// </summary>
        public short Multiplier = 2;
    }
}