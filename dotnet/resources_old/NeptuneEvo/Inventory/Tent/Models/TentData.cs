using System;
using System.Collections.Generic;
using NeptuneEvo.Handles;

namespace NeptuneEvo.Inventory.Tent.Models
{
    internal class TentData
    {
        public TentData(ExtMarker marker, ExtTextLabel label, ExtColShape shape, bool isBlack = false)
        {
            this.marker = marker;
            this.label = label;
            this.shape = shape;
            this.isBlack = isBlack;
        }

        public ExtMarker marker { get; set; }
        public ExtTextLabel label { get; set; }
        public ExtColShape shape { get; set; }
        public ExtPlayer player { get; set; } = null;
        public Dictionary<int, int> slotToPrice { get; set; } = new Dictionary<int, int>();
        public bool isBlack { get; set; }
        public DateTime RentTime { get; set; } = DateTime.MinValue;
        public int UUID { get; set; } = -1;
    }
}