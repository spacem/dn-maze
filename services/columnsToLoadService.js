(function () {
'use strict';

angular.module('dnsim').factory('itemColumnsToLoad',[itemColumnsToLoad]);
function itemColumnsToLoad() {
  return {
    mainDnt: {
      NameID: true, DescriptionID: true, NameIDParam: true, DescriptionIDParam: true,
      Type: true,TypeParam1: true,TypeParam2: true, TypeParam3: true, LevelLimit: true, NeedJobClass: true, Rank: true,
      State1: true, StateValue1: true, State1_Max: true, State1_GenProb: true,
      State2: true, StateValue2: true, State2_Max: true,
      State3: true, StateValue3: true, State3_Max: true,
      State4: true, StateValue4: true, State4_Max: true,
      State5: true, StateValue5: true, State5_Max: true,
      State6: true, StateValue6: true, State6_Max: true,
      State7: true, StateValue7: true, State7_Max: true,
      State8: true, StateValue8: true, State8_Max: true,
      State9: true, StateValue9: true, State9_Max: true,
      State10: true,StateValue10: true,State10_Max: true,
      EnchantID: true,
      SkillID: true,
      dragonjeweltype: true, AbleWStorage: true, ExchangeType:true, IconImageIndex: true, IsCash: true, DisjointDrop1: true, Disjointamount: true
    },
    partsDnt: {
      SetItemID: true
    },
    enchantDnt: {
      EnchantID: true,EnchantLevel: true,EnchantRatio: true,BreakRatio: true,MinDown: true,MaxDown: true,NeedCoin: true,
      DisjointDrop: true,
      NeedItemID1: true,NeedItemCount1: true,NeedItemID2: true,NeedItemCount2: true,NeedItemID3: true,NeedItemCount3: true,NeedItemID4: true,NeedItemCount4: true,NeedItemID5: true,NeedItemCount5: true,ProtectItemCount: true,
      State1: true,State1Value: true,State2: true,State2Value: true,State3: true,State3Value: true,State4: true,State4Value: true,State5: true,State5Value: true,State6: true,State6Value: true,State7: true,State7Value: true,State8: true,State8Value: true,State9: true,State9Value: true,State10: true,State10Value: true
    },
    potentialDnt : {
      PotentialID: true, PotentialNo: true,PotentialRatio: true,
      State1: true,State1Value: true,
      State2: true,State2Value: true,
      State3: true,State3Value: true,
      State4: true,State4Value: true,
      State5: true,State5Value: true,
      State6: true,State6Value: true,
      State7: true,State7Value: true,
      State8: true,State8Value: true,
      State9: true,State9Value: true,
      State10: true,State10Value: true,
      State11: true,State11Value: true,
      State12: true,State12Value: true,
      State13: true,State13Value: true,
      State14: true,State14Value: true,
      State15: true,State15Value: true,
      State16: true,State16Value: true
    },
    gemDnt: {
      Type: true
    },
    setDnt : null,
    sparkDnt: null,
    jobsDnt: {
      JobName: true,JobNumber: true,BaseClass: true,ParentJob: true, EnglishName: true, JobIcon: true
    },
    jobBaseStatColsToLoad: {
      Strength:true,Agility:true,Intelligence:true,Stamina:true,AggroperPvE:true,BaseMP:true
    },
    statCapColsToLoad: {
      Cbase: true,
      Cdefense: true,
      Ccritical: true,
      Cfinaldamage: true,
      CcriticalDamage: true,
    },
    jobConversionColsToLoad: {
      HP: true,StrengthAttack: true,AgilityAttack: true,IntelligenceAttack: true,PhysicalDefense: true,MagicDefense: true,Critical: true,CriticalResistance: true,Stiff: true,StiffResistance: true,Stun: true,StunResistance: true,MoveSpeed: true,MoveSpeedRevision: true,DownDelay: true,ElementAttack: true,ElementDefense: true,ElementDefenseMin: true,ElementDefenseMax: true,StrengthIntelligenceToCriticalDamage: true
    }
  }
}

})();