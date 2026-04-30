using System;

namespace NeptuneEvo.Fractions.Models
{
    public class VehicleTicket
    {
        public int AutoId;
        public int HolderAutoId;
        public string HolderName;
        public bool IsEvac;
        public string Link;
        public string Model;
        public int PolicAutoId;
        public string PolicName;
        public int Price;
        public string Text;
        public DateTime Time;
        public VehicleTicketType Type;
        public int VehAutoId;
        public string VehNumber;
    }
}