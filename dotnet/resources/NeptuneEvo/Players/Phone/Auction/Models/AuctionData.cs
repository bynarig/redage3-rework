using System;
using System.Collections.Generic;

namespace NeptuneEvo.Players.Phone.Auction.Models
{
    public class AuctionData
    {
        public int BetCount;
        public List<AuctionBetData> BetsData = new List<AuctionBetData>();
        public int CreatePrice;
        public int CreateUUID;
        public int ElementId;
        public int Id;
        public string Image;
        public bool IsEnd;
        public bool IsSave;
        public int LastBetUUID;
        public int LastPrice;
        public string Text;
        public DateTime Time;
        public string Title;
        public AuctionType Type;
    }
}