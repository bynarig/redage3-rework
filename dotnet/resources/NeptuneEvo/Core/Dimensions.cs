using GTANetworkAPI;

namespace NeptuneEvo.Core
{
    internal class Dimensions : Script
    {
        public static uint RequestPrivateDimension(int myid)
        {
            return (uint)(10000 + myid);
        }
    }
}