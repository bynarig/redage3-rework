namespace NeptuneEvo.Chars.Models
{
    public class RouletteCategory
    {
        public int[] CaseList;
        public string Image = "";
        public string Name = "";

        public RouletteCategory(string name, string image, int[] caseList)
        {
            Name = name;
            Image = image;
            CaseList = caseList;
        }
    }
}