namespace NeptuneEvo.Character.Models
{
    public class ComponentData
    {
        public int Drawable;
        public bool IsBlock;
        public int Texture;

        public ComponentData(int drawable, int texture)
        {
            Drawable = drawable;
            Texture = texture;
            IsBlock = false;
        }

        public ComponentData(int drawable, int texture, bool isBlock)
        {
            Drawable = drawable;
            Texture = texture;
            IsBlock = isBlock;
        }
    }
}