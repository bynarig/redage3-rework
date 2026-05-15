using NeptuneEvo.Handles;

namespace NeptuneEvo.Players.Models
{
    public class ItemsTrade
    {
        public ItemsTrade(ExtPlayer Target)
        {
            this.Target = Target;
        }

        public ExtPlayer Target { get; set; }
        public int Money { get; set; } = 0;
        public int Status { get; set; } = 0;
    }
}