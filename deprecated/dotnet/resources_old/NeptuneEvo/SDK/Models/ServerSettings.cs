namespace NeptuneEvo.SDK.Models
{
    public class ServerSettings
    {
        public int BonusCodeLvl = 0;

        /// <summary>
        ///     Время через которая можно начать новый капт в минутах
        /// </summary>
        public int CaptureNextTimeMinutes = 5;

        public string ClientInterfaceUrl = "";

        /// <summary>
        ///     Максимальная цена на мероприятиях
        /// </summary>
        public int EventRewardLimit = 100000;

        /// <summary>
        ///     Множетель exp в payday
        /// </summary>
        public int ExpMultiplier = 1;

        /// <summary>
        /// </summary>
        public string GoogleCategory = ""; // 555 - any user identifier (old  - ra_game)

        /// <summary>
        /// </summary>
        public string GoogleTrackingId = ""; // UA-XXXXXXXXX-XX (old - UA-138889592-2)

        //
        public bool IsAcceptExit = true;

        /// <summary>
        ///     Снимать ли на логи на биз
        /// </summary>
        public bool IsBusinessTax = true;

        public bool IsCheckCmdGov = false;
        public bool IsCheckJobLicC = true; // 555 - any user identifier
        public bool IsCheckOnlineLogin = true;
        public bool IsCreateProp = true;
        public bool IsDeleteProp = true;
        public bool IsEmailConfirmed = false; // 555 - any user identifier
        public bool IsHeliCrash = true;

        /// <summary>
        ///     Блипы на карте домов
        /// </summary>
        public bool IsHouseBlips = false;

        /// <summary>
        ///     Снимать ли на логи на дом
        /// </summary>
        public bool IsHouseTax = true;

        public bool IsJobTinder = true;

        /// <summary>
        ///     Включен ли перенос
        /// </summary>
        public bool IsMerger = false;

        /// <summary>
        /// </summary>
        public int MaxGameSlots = 1350;

        /// <summary>
        ///     Минимальный уровень админов которым будет видно уведомления о репортах
        /// </summary>
        public int MinAdminLvlReport = 1;

        /// <summary>
        ///     Минимальный уверовень голосования
        /// </summary>
        public int MinVoteLvl = 5;

        /// <summary>
        ///     Множетель зарплат
        /// </summary>
        public int MoneyMultiplier = 1;

        /// <summary>
        ///     Кол-во победителей счастливых часов
        /// </summary>
        public int NumberWinners = 3;

        /// <summary>
        ///     Номер сервера - 0 - тестовый
        /// </summary>
        public byte ServerId = 0;

        /// <summary>
        ///     Название сервера
        /// </summary>
        public string ServerName = "";

        /// <summary>
        /// </summary>
        public string SiteUrl = "https://redage.net/"; // UA-XXXXXXXXX-XX
    }
}