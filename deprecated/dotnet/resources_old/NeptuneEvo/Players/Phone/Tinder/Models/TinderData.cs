using System.Collections.Generic;

namespace NeptuneEvo.Players.Phone.Tinder.Models
{
    public class TinderData
    {
        public string Avatar = "";
        public bool IsSave = false;
        public bool IsVisible = true;
        public List<int> Likes = new List<int>();
        public List<int> NoLikes = new List<int>();
        public string Text = "";
        public TinderType Type = TinderType.Friends;
    }
}