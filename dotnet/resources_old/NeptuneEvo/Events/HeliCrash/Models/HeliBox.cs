using NeptuneEvo.Handles;

namespace NeptuneEvo.Events.HeliCrash.Models
{
    public class HeliBox
    {
        public int Health = 20;
        public ExtPlayer IsHack = null;
        public ExtObject Obj;
        public ExtColShape Shape;
    }
}