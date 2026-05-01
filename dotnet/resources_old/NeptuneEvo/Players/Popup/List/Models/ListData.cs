namespace NeptuneEvo.Players.Popup.List.Models
{
    public class ListData
    {
        public object Id;
        public string Name;

        public ListData(string name, object id)
        {
            Name = name;
            Id = id;
        }
    }
}