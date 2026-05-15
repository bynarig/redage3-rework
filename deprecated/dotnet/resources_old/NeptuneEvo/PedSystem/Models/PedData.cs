using NeptuneEvo.Handles;

namespace NeptuneEvo.PedSystem.Models
{
    public class PedData
    {
        public ExtPed Ped { get; set; } = null;
        public ExtColShape ColShape { get; set; } = null;
        public ExtTextLabel TextLabel { get; set; } = null;
    }
}