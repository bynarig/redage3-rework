using System.Collections.Concurrent;
using System.Collections.Generic;
using GTANetworkAPI;
using NeptuneEvo.Accounts.Models;
using NeptuneEvo.BattlePass;
using NeptuneEvo.BattlePass.Models;
using NeptuneEvo.Character.Models;
using NeptuneEvo.Chars.Models;
using NeptuneEvo.Core;
using NeptuneEvo.Fractions.Models;
using NeptuneEvo.Functions;
using NeptuneEvo.Organizations.Models;
using NeptuneEvo.Players.Models;
using NeptuneEvo.Players.Phone.Models;
using NeptuneEvo.Quests.Models;
using NeptuneEvo.Table.Tasks.Models;

namespace NeptuneEvo.Handles
{
    public class ExtPlayer : Player
    {
        //
        public ConcurrentDictionary<int, InventoryItemData> Accessories;
        public AccountData AccountData;

        //
        public BattlePassData BattlePassData;
        public CharacterData CharacterData;

        //

        private string CharacterName;

        public List<ExtColShapeData> ColShapesData;

        //
        public PlayerCustomization Customization;

        //

        public FractionMemberData FractionData;

        //
        public TableTaskPlayerData[] FractionTasksData = null;

        public bool IsRestartSaveAccountData = false;

        public bool IsRestartSaveCharacterData = false;

        //

        public KeyClampData KeyClampData;

        //
        public MissionData MissionData;

        //

        public OrganizationMemberData OrganizationData;

        //
        public TableTaskPlayerData[] OrganizationTasksData = null;

        //

        public PhoneData PhoneData;

        //Квесты
        public PlayerQuestModel Quest;

        //


        public SessionData SessionData;

        //

        public PedHash Skin = PedHash.Skidrow01AMM;


        //

        private int UUID;

        public ExtPlayer(NetHandle handle) : base(handle)
        {
        }

        public void SetName(string name)
        {
            CharacterName = name;

            if (SessionData != null)
                SessionData.Name = name;
        }

        public string GetName()
        {
            return CharacterName;
        }

        public void SetUUID(int uuid)
        {
            UUID = uuid;
        }

        public int GetUUID()
        {
            return UUID;
        }

        public void SetSessionData(SessionData sessionData)
        {
            SessionData = sessionData;
        }

        public void SetCharacterData(CharacterData characterData)
        {
            CharacterData = characterData;
        }

        public void SetAccountData(AccountData accountData)
        {
            AccountData = accountData;
        }

        public void AddColShapeData(ExtColShapeData сolShapeData)
        {
            if (ColShapesData == null)
                ColShapesData = new List<ExtColShapeData>();

            if (InteractionCollection.isFunction(сolShapeData.ColShapeId.ToString()))
                ColShapesData.Add(сolShapeData);
            else
                ColShapesData.Insert(0, сolShapeData);
        }

        public void DeleteColShapeData(ExtColShapeData сolShapeData)
        {
            if (ColShapesData != null && ColShapesData.Contains(сolShapeData))
                ColShapesData.Remove(сolShapeData);
        }

        public void SetCustomization(PlayerCustomization сustomization)
        {
            Customization = сustomization;
        }

        public void SelectQuest(PlayerQuestModel quest)
        {
            Quest = quest;
        }

        public void ClearQuest()
        {
            Quest = null;
        }

        public void SetAccessories(int slotId, InventoryItemData item)
        {
            if (Accessories == null)
                Accessories = new ConcurrentDictionary<int, InventoryItemData>();

            Accessories[slotId] = item;
        }

        public void DeleteAccessories(int slotId)
        {
            if (Accessories != null && Accessories.ContainsKey(slotId))
                Accessories.TryRemove(slotId, out _);
        }

        public bool IsAccessories(int slotId)
        {
            if (Accessories != null)
                return Accessories.ContainsKey(slotId);

            return false;
        }

        public void ClearAccessories()
        {
            Accessories = null;
        }

        public PedHash GetSkin()
        {
            return Skin;
        }

        public void SetBattlePassData(BattlePassData battlePassData)
        {
            BattlePassData = battlePassData;
        }

        public void SetMissionTask(MissionData missionData)
        {
            MissionData = missionData;

            if (missionData.Tasks.Count == 0)
                Repository.UpdateMission(this);
        }

        public void SetPhoneData(PhoneData phoneData)
        {
            PhoneData = phoneData;
        }

        public void SetKeyClampData(KeyClampData keyClampData = null)
        {
            KeyClampData = keyClampData;
        }

        public void SetOrganizationData(OrganizationMemberData organizationData = null)
        {
            OrganizationData = organizationData;
        }

        public void SetFractionData(FractionMemberData fractionData = null)
        {
            FractionData = fractionData;
        }
    }
}