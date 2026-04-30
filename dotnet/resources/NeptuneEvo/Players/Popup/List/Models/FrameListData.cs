using System.Collections.Generic;

namespace NeptuneEvo.Players.Popup.List.Models
{
    public class FrameListData
    {
        public ListCallback Callback;
        public string Header;
        public List<ListData> List = new List<ListData>();
    }
}