using System;

namespace NeptuneEvo.Players.Phone.Settings.Models
{
    public class SettingsData
    {
        public string Avatar;
        public int BellId = 0;
        public bool ForbesVisible = false;
        public bool IsAir = false;
        public DateTime IsAirAntiFlood = DateTime.Now;
        public DateTime SimUpdateAntiFlood = DateTime.Now;
        public int SmsId = 0;
        public string Wallpaper = "https://cloud.redage.net/cloud/img/iphone/wallpapers/1.png";
    }
}