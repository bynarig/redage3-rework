using NeptuneEvo.Core;

namespace NeptuneEvo.Players.Animations.Models
{
    public class AnimationData
    {
        public string AnimDict;
        public string AnimName;
        public uint Attachment = 0;
        public int Flag;
        public string Sound;
        public SoundData SoundData = null;
        public float SoundRange = 10f;
        public string StopAnimDict = string.Empty;
        public string StopAnimName = string.Empty;
        public int StopFlag;
    }
}