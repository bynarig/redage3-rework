using NeptuneEvo.Handles;

namespace NeptuneEvo.Players.Phone.Call.Models
{
    public class CallData
    {
        public bool IsCall = false;
        public int Number;
        public ExtPlayer Target = null;
        public CallType Type = CallType.Talk;
    }
}