using System;
using System.Collections.Generic;
using Object = GTANetworkAPI.Object;

namespace NeptuneEvo.NewCasino
{
    public class RoulettePlayerData
    {
        public List<BetData> AllBets = new List<BetData>();

        public Object FBetObject = null;
        public Object SBetObject = null;
        public int SelectedTable = -1;
        public Object TBetObject = null;
        public DateTime Time = DateTime.Now;

        public int WinMoney = 0;


        public RoulettePlayerData(int SelectedTable)
        {
            this.SelectedTable = SelectedTable;
        }
    }
}