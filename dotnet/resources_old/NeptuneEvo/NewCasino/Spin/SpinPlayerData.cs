using System;
using System.Collections.Generic;

namespace NeptuneEvo.NewCasino
{
    public class SpinPlayerData
    {
        public int Cash = 0;
        public int SelectSpin = -1;


        public List<int> Spins = new List<int>();

        public DateTime Time = DateTime.Now;


        public SpinPlayerData(int SelectSpin)
        {
            this.SelectSpin = SelectSpin;
        }
    }
}