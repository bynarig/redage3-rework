using GTANetworkAPI;

namespace NeptuneEvo.Inventory.Tent
{
    internal class Events : Script
    {
        [ServerEvent(Event.ResourceStart)]
        public void OnResourceStart()
        {
            Repository.OnResourceStart();
        }
    }
}