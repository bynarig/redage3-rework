using GTANetworkAPI;
using NeptuneEvo.Handles;

namespace NeptuneEvo.Businesses
{
    public class Events : Script
    {
        /*[RemoteEvent("client.businessmanage.sellBiz")]
        public void SellBizMenu (ExtPlayer player)
        {

        }*/

        [Command("businessmanage")]
        public void openBusinessManage(ExtPlayer player)
        {
            Repository.Open(player);
        }
    }
}