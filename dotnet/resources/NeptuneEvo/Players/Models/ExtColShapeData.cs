using NeptuneEvo.Functions;

namespace NeptuneEvo.Players.Models
{
    public class ExtColShapeData
    {
        public ExtColShapeData(ColShapeEnums ColShapeId, int Index, int ListId)
        {
            this.ColShapeId = ColShapeId;
            this.Index = Index;
            this.ListId = ListId;
        }

        public ColShapeEnums ColShapeId { get; }
        public int Index { get; }
        public int ListId { get; }
    }
}