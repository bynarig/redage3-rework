namespace NeptuneEvo.Organizations.Models
{
    public class OrganizationUpdateData
    {
        public string icon = "";
        public bool isRb;
        public string name = "";
        public int price;
        public string type = "";

        public OrganizationUpdateData(string type, string name, string icon, bool isRb, int price)
        {
            this.type = type;
            this.name = name;
            this.icon = icon;
            this.isRb = isRb;
            this.price = price;
        }
    }
}