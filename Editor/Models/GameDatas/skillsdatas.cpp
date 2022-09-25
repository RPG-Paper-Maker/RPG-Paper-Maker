/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "skillsdatas.h"
#include "systemskill.h"
#include "rpm.h"
#include "common.h"
#include "systemcost.h"
#include "systemeffect.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SkillsDatas::SkillsDatas()
{
    m_model = new QStandardItemModel;
}

SkillsDatas::~SkillsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void SkillsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_SKILLS), *this);
}

QStandardItemModel* SkillsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SkillsDatas::setDefault(){
    int i, j, length, l;
    SystemSkill *skill;
    QStandardItemModel *modelCosts, *modelEffects;

    QString names[] = {
        RPM::translate(Translations::ATTACK),
        RPM::translate(Translations::SKILL),
        RPM::translate(Translations::ITEM),
        RPM::translate(Translations::ESCAPE),
        RPM::translate(Translations::END_TURN),
        RPM::translate(Translations::BLAZING_SWORD),
        RPM::translate(Translations::SHADOW),
        RPM::translate(Translations::HEAL),
        RPM::translate(Translations::FIRE),
        RPM::translate(Translations::WATER),
        RPM::translate(Translations::WIND),
        RPM::translate(Translations::BANDAGE),
        RPM::translate(Translations::CONCENTRATION)
    };
    int iconsX[] = {
        0, 1, 2, 3, 4, 6, 13, 8, 9, 11, 12, 5, 7
    };
    int iconsY[] = {
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    };
    QString descriptions[] = {
        RPM::translate(Translations::ATTACK_DESCRIPTION),
        RPM::translate(Translations::SKILL_DESCRIPTION),
        RPM::translate(Translations::ITEM_DESCRIPTION),
        RPM::translate(Translations::ESCAPE_DESCRIPTION),
        RPM::translate(Translations::END_TURN_DESCRIPTION),
        RPM::translate(Translations::BLAZING_SWORD_DESCRIPTION),
        RPM::translate(Translations::SHADOW_DESCRIPTION),
        RPM::translate(Translations::HEAL_DESCRIPTION),
        RPM::translate(Translations::FIRE_DESCRIPTION),
        RPM::translate(Translations::WATER_DESCRIPTION),
        RPM::translate(Translations::WIND_DESCRIPTION),
        RPM::translate(Translations::BANDAGE_DESCRIPTION),
        RPM::translate(Translations::CONCENTRATION_DESCRIPTION)
    };
    TargetKind targetsKind[] = {
        TargetKind::Enemy, TargetKind::User, TargetKind::User, TargetKind::User,
        TargetKind::User, TargetKind::AllEnemies, TargetKind::Enemy, TargetKind
        ::Ally, TargetKind::Enemy, TargetKind::Enemy, TargetKind::Enemy,
        TargetKind::User, TargetKind::User
    };
    AvailableKind availablesKind[] = {
        AvailableKind::Battle, AvailableKind::Never, AvailableKind::Never,
        AvailableKind::Never, AvailableKind::Never, AvailableKind::Battle,
        AvailableKind::Battle, AvailableKind::Always, AvailableKind::Battle,
        AvailableKind::Battle, AvailableKind::Battle, AvailableKind::Battle,
        AvailableKind::Battle
    };
    int songsID[] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    };
    QString targetConditions[] = {
        "t.hp > 0", "", "", "", "", "t.hp > 0", "t.hp > 0", "t.hp > 0",
        "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0"
    };
    QVector<SystemCost *> costs[] = {
        {}, {}, {}, {}, {}, {SystemCost::createMP(5)}, {SystemCost::createMP(3)},
        {SystemCost::createMP(5)}, {SystemCost::createMP(3)}, {SystemCost
        ::createMP(3)}, {SystemCost::createMP(3)}, {SystemCost::createTP(3)},
        {SystemCost::createTP(2)}
    };
    QVector<SystemEffect *> effects[] = {
        {SystemEffect::createSpecialAction(EffectSpecialActionKind::ApplyWeapons
        ), SystemEffect::createDamage("u.atk", "0")}, {SystemEffect
        ::createSpecialAction(EffectSpecialActionKind::OpenSkills)}, {
        SystemEffect::createSpecialAction(EffectSpecialActionKind::OpenItems)},
        {SystemEffect::createSpecialAction(EffectSpecialActionKind::Escape)},
        {SystemEffect::createSpecialAction(EffectSpecialActionKind::EndTurn)},
        {SystemEffect::createDamage("5 + u.mag", "0", 1, "1")}, {SystemEffect
        ::createDamage("3 + u.mag", "0", -1, "1")}, {SystemEffect::createDamage(
        "-5 - u.mag", QString(), -1, "1")}, {SystemEffect::createDamage(
        "3 + u.mag", "0", -1, "1")}, {SystemEffect::createDamage("3 + u.mag",
        "0", -1, "1")}, {SystemEffect::createDamage("3 + u.mag", "0", -1, "1")},
        {SystemEffect::createDamage("-3 - u.mag", QString(), -1, "1")}, {}
    };
    length = (sizeof(names)/sizeof(*names));

    for (i = 0; i < length; i++) {
        modelCosts = new QStandardItemModel;
        for (j = 0, l = costs[i].length(); j < l; j++) {
            modelCosts->appendRow(costs[i][j]->getModelRow());
        }
        modelCosts->appendRow(new QStandardItem);
        modelEffects = new QStandardItemModel;
        for (j = 0, l = effects[i].length(); j < l; j++) {
            modelEffects->appendRow(effects[i][j]->getModelRow());
        }
        modelEffects->appendRow(new QStandardItem);
        skill = new SystemSkill(i + 1, names[i], 1, iconsX[i], iconsY[i], new
            SystemTranslatable(-1, descriptions[i]), targetsKind[i],
            targetConditions[i].isEmpty() ? new PrimitiveValue(PrimitiveValueKind
            ::None) : new PrimitiveValue(targetConditions[i]), new PrimitiveValue(
            PrimitiveValueKind::None), availablesKind[i], new SystemPlaySong(
            songsID[i], SongKind::Sound), new PrimitiveValue(PrimitiveValueKind
            ::None), i == 0 ? new PrimitiveValue(PrimitiveValueKind::DataBase, 1) :
            new PrimitiveValue(PrimitiveValueKind::None), new SystemTranslatable(
            1, SystemSkill::DEFAULT_BATTLE_MESSAGE), modelCosts, modelEffects);
        m_model->appendRow(skill->getModelRow());
    }
}

void SkillsDatas::setDefaultTranslations()
{
    SystemCommonSkillItem::setNameDescription(m_model, 0, RPM::translate(Translations::ATTACK), RPM::translate(Translations::ATTACK_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 1, RPM::translate(Translations::SKILL), RPM::translate(Translations::ATTACK_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 2, RPM::translate(Translations::ITEM), RPM::translate(Translations::ATTACK_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 3, RPM::translate(Translations::ESCAPE), RPM::translate(Translations::ATTACK_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 4, RPM::translate(Translations::END_TURN), RPM::translate(Translations::END_TURN_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 5, RPM::translate(Translations::BLAZING_SWORD), RPM::translate(Translations::BLAZING_SWORD_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 6, RPM::translate(Translations::POWER), RPM::translate(Translations::POWER_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 7, RPM::translate(Translations::BANDAGE), RPM::translate(Translations::BANDAGE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 8, RPM::translate(Translations::CROSS_AXE), RPM::translate(Translations::CROSS_AXE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 9, RPM::translate(Translations::WAR_CRY), RPM::translate(Translations::WAR_CRY_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 10, RPM::translate(Translations::HEAVY_JUMP), RPM::translate(Translations::HEAVY_JUMP_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 11, RPM::translate(Translations::PIC_LANCE), RPM::translate(Translations::PIC_LANCE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 12, RPM::translate(Translations::LONG_SLAY), RPM::translate(Translations::LONG_SLAY_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 13, RPM::translate(Translations::CONCENTRATION), RPM::translate(Translations::CONCENTRATION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 14, RPM::translate(Translations::STEEL), RPM::translate(Translations::STEEL_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 15, RPM::translate(Translations::STABBING), RPM::translate(Translations::STABBING_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 16, RPM::translate(Translations::ILLUSION), RPM::translate(Translations::ILLUSION_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 17, RPM::translate(Translations::FIRE_1), RPM::translate(Translations::FIRE_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 18, RPM::translate(Translations::FIRE_2), RPM::translate(Translations::FIRE_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 19, RPM::translate(Translations::FIRE_3), RPM::translate(Translations::FIRE_3_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 20, RPM::translate(Translations::EARTH_1), RPM::translate(Translations::EARTH_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 21, RPM::translate(Translations::EARTH_2), RPM::translate(Translations::EARTH_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 22, RPM::translate(Translations::EARTH_3), RPM::translate(Translations::EARTH_3_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 23, RPM::translate(Translations::THUNDER_1), RPM::translate(Translations::THUNDER_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 24, RPM::translate(Translations::THUNDER_2), RPM::translate(Translations::THUNDER_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 25, RPM::translate(Translations::THUNDER_3), RPM::translate(Translations::THUNDER_3_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 26, RPM::translate(Translations::WATER_1), RPM::translate(Translations::WATER_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 27, RPM::translate(Translations::WATER_2), RPM::translate(Translations::WATER_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 28, RPM::translate(Translations::WATER_3), RPM::translate(Translations::WATER_3_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 29, RPM::translate(Translations::ICE_1), RPM::translate(Translations::ICE_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 30, RPM::translate(Translations::ICE_2), RPM::translate(Translations::ICE_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 31, RPM::translate(Translations::ICE_3), RPM::translate(Translations::ICE_3_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 32, RPM::translate(Translations::WIND_1), RPM::translate(Translations::WIND_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 33, RPM::translate(Translations::WIND_2), RPM::translate(Translations::WIND_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 34, RPM::translate(Translations::WIND_3), RPM::translate(Translations::WIND_3_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 35, RPM::translate(Translations::DARKNESS_1), RPM::translate(Translations::DARKNESS_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 36, RPM::translate(Translations::DARKNESS_2), RPM::translate(Translations::DARKNESS_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 37, RPM::translate(Translations::DARKNESS_3), RPM::translate(Translations::DARKNESS_3_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 38, RPM::translate(Translations::LIGHT_1), RPM::translate(Translations::LIGHT_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 39, RPM::translate(Translations::LIGHT_2), RPM::translate(Translations::LIGHT_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 40, RPM::translate(Translations::LIGHT_3), RPM::translate(Translations::LIGHT_3_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 41, RPM::translate(Translations::HEAL_1), RPM::translate(Translations::HEAL_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 42, RPM::translate(Translations::HEAL_2), RPM::translate(Translations::HEAL_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 43, RPM::translate(Translations::HEAL_3), RPM::translate(Translations::HEAL_3_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 44, RPM::translate(Translations::BARRIER_1), RPM::translate(Translations::BARRIER_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 45, RPM::translate(Translations::BARRIER_2), RPM::translate(Translations::BARRIER_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 46, RPM::translate(Translations::REMEDY_1), RPM::translate(Translations::REMEDY_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 47, RPM::translate(Translations::REMEDY_2), RPM::translate(Translations::REMEDY_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 48, RPM::translate(Translations::WEAK_1), RPM::translate(Translations::WEAK_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 49, RPM::translate(Translations::WEAK_2), RPM::translate(Translations::WEAK_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 50, RPM::translate(Translations::POISON_1), RPM::translate(Translations::POISON_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 51, RPM::translate(Translations::POISON_2), RPM::translate(Translations::POISON_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 52, RPM::translate(Translations::BURN_1), RPM::translate(Translations::BURN_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 53, RPM::translate(Translations::BURN_2), RPM::translate(Translations::BURN_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 54, RPM::translate(Translations::MUTE_1), RPM::translate(Translations::MUTE_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 55, RPM::translate(Translations::MUTE_2), RPM::translate(Translations::MUTE_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 56, RPM::translate(Translations::CONFUSE_1), RPM::translate(Translations::CONFUSE_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 57, RPM::translate(Translations::CONFUSE_2), RPM::translate(Translations::CONFUSE_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 58, RPM::translate(Translations::SLEEP_1), RPM::translate(Translations::SLEEP_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 59, RPM::translate(Translations::SLEEP_2), RPM::translate(Translations::SLEEP_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 60, RPM::translate(Translations::BLINK_1), RPM::translate(Translations::BLINK_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 61, RPM::translate(Translations::BLINK_2), RPM::translate(Translations::BLINK_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 62, RPM::translate(Translations::REVIVE_1), RPM::translate(Translations::REVIVE_1_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 63, RPM::translate(Translations::REVIVE_2), RPM::translate(Translations::REVIVE_2_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 64, RPM::translate(Translations::SILVER_BULLET), RPM::translate(Translations::SILVER_BULLET_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 65, RPM::translate(Translations::PARALYZE_BULLET), RPM::translate(Translations::PARALYZE_BULLET_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 66, RPM::translate(Translations::HEAL_BULLET), RPM::translate(Translations::HEAL_BULLET_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 67, RPM::translate(Translations::MAGIC_ARROW), RPM::translate(Translations::MAGIC_ARROW_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 68, RPM::translate(Translations::POISON_ARROW), RPM::translate(Translations::POISON_ARROW_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 69, RPM::translate(Translations::MUTE_ARROW), RPM::translate(Translations::MUTE_ARROW_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 70, RPM::translate(Translations::CUT), RPM::translate(Translations::CUT_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 71, RPM::translate(Translations::CLAW), RPM::translate(Translations::CLAW_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 72, RPM::translate(Translations::FANG), RPM::translate(Translations::FANG_DESCRIPTION));

}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SkillsDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["skills"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemSkill* sysSkill = new SystemSkill;
        sysSkill->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysSkill)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysSkill->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void SkillsDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemSkill* sysSkill = ((SystemSkill*)m_model->item(i)->data()
                                 .value<quintptr>());
        sysSkill->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["skills"] = jsonArray;
}
