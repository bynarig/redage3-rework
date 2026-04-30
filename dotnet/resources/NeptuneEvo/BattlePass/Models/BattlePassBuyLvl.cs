namespace NeptuneEvo.BattlePass.Models
{
    public class BattlePassBuyLvl
    {
        public BattlePassBuyLvl(int priceRB, int lvl)
        {
            PriceRB = priceRB;
            Lvl = lvl;
        }

        public int PriceRB { get; set; }
        public int Lvl { get; set; }
    }
}