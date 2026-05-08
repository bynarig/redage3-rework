using System.Collections.Generic;
using NeptuneEvo.Players.Phone.Call.Models;
using NeptuneEvo.Players.Phone.Contacts.Models;
using NeptuneEvo.Players.Phone.Messages.Models;
using NeptuneEvo.Players.Phone.Recents.Models;
using NeptuneEvo.Players.Phone.Settings.Models;

namespace NeptuneEvo.Players.Phone.Models
{
    public class PhoneData
    {
        public List<int> BlackList = new List<int>();

        public CallData Call = null;

        public List<List<object>> Gallery = new List<List<object>>();
        public bool IsOpen = false;
        public List<PhoneMessageListData> MessagesList = new List<PhoneMessageListData>();
        public Dictionary<int, PhoneContactsData> PhoneContacts = new Dictionary<int, PhoneContactsData>();
        public List<RecentsData> Recents = new List<RecentsData>();

        public int SelectedNumber = -1;

        public SettingsData Settings = new SettingsData();
    }
}