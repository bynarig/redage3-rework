using GTANetworkAPI;
using NeptuneEvo.Handles;

namespace NeptuneEvo.Players.Models
{
    public class KeyClampData
    {
        public delegate void EndCallBack(ExtPlayer player, int value);

        /// <summary>
        ///     -1 - Что то пошло не так
        ///     -2 - Уже кто то взламывает
        /// </summary>
        public delegate (int, int) GetHealthCallBack(ExtPlayer player);

        public ExtColShapeData ColShapesData = null;
        public EndCallBack EndCB = null;
        public GetHealthCallBack GetHealthCB = null;

        public uint Name;

        public void SetName(string name)
        {
            Name = NAPI.Util.GetHashKey(name);
        }
    }
}