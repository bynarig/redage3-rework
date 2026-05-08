namespace NeptuneEvo.PedSystem.Pet.Models
{
    internal class PetShop
    {
        public PetShop(int Price, bool isDonate, uint Ped)
        {
            this.Price = Price;
            this.isDonate = isDonate;
            this.Ped = Ped;
        }

        public int Price { get; set; }
        public bool isDonate { get; set; }
        public uint Ped { get; set; }
    }
}