using System.Collections.Generic;

namespace NeptuneEvo.Players.Phone.Gps.Models
{
    public class GpsItem
    {
        public string Name;
        public List<float> Pos;
        public List<List<object>> PosList;

        public GpsItem(string name, float posX, float posY)
        {
            Name = name;
            Pos = new List<float>
            {
                posX,
                posY
            };
            PosList = null;
        }

        public GpsItem(string name, List<List<object>> posList)
        {
            Name = name;
            Pos = null;
            PosList = posList;
        }
    }
}