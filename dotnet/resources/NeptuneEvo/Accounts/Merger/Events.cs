using GTANetworkAPI;
using NeptuneEvo.Localization;
using NeptuneEvo.Functions;
using NeptuneEvo.Handles;
using NeptuneEvo.SDK;

namespace NeptuneEvo.Accounts.Merger
{
    public class Events : Script
    {
        [RemoteEvent("server.merger.auntification")]
        private void TryAutorize(ExtPlayer player, string pass_, int serverId = 2)
        {
            if (!FunctionsAccess.IsWorking("merger") || !Main.ServerSettings.IsMerger)
            {
                Notify.Send(player, NotifyType.Error, NotifyPosition.BottomCenter,
                    LangFunc.GetText(LangType.Ru, DataName.FunctionOffByAdmins), 3000);
                return;
            }

            Trigger.SetTask(async () => { await Repository.MergerAuntification(player, pass_, serverId); });
        }
    }
}