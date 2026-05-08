using System;

namespace NeptuneEvo.Fractions.LSNews.LiveStream
{
    public class Message
    {
        public Message(string name, string text, bool isOwner)
        {
            Name = name;
            Text = text;
            PublishTime = DateTime.Now;
            IsOwner = isOwner;
        }

        public string Name { get; set; }
        public string Text { get; set; }
        public bool IsOwner { get; set; }
        public DateTime PublishTime { get; set; }
    }
}