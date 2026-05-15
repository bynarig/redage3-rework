using System;

namespace NeptuneEvo.Players.Phone.Messages.Models
{
    public class PhoneMessageListData
    {
        public DateTime Date;
        public bool IsMe;
        public int Phone;
        public bool Status; //Прочитал или нет
        public string Text;
        public MessageType Type;
    }
}