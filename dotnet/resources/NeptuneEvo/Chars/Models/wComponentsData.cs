using System.Collections.Generic;

namespace NeptuneEvo.Chars.Models
{
    public enum wComponentsType
    {
        Varmod = 1,
        Clip,
        Suppressor,
        Scope,
        Muzzlebrake,
        Barrel,
        Flashlight,
        Grip,
        Camo
    }

    public class wComponentsData
    {
        public wComponentsData(int Count, Dictionary<uint, wComponentData> Components)
        {
            this.Count = Count;
            this.Components = Components;
        }

        /// <summary>
        ///     Колличество
        /// </summary>
        public int Count { get; set; }

        //Список компонентов
        public Dictionary<uint, wComponentData> Components { get; set; }
    }

    public class wComponentData
    {
        public wComponentData(string Name, string Desc, int Price, wComponentsType Type)
        {
            this.Name = Name;
            this.Desc = Desc;
            this.Price = Price;
            this.Type = Type;
        }

        public string Name { get; set; }
        public string Desc { get; set; }
        public int Price { get; set; }
        public wComponentsType Type { get; set; }
    }
}