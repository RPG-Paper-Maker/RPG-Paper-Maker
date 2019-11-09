/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
        "Attack", "Skill", "Item", "Escape", "End turn", "Blazing sword",
        "Shadow", "Heal", "Fire", "Water", "Wind", "Bandage", "Concentration"
    };
    int iconsID[] = {
        3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
    };
    QString descriptions[] = {
        "A basic attack (use the current weapon(s).",
        "Use a skill.",
        "Use an item.",
        "Escape from the battle.",
        "End a complete turn.",
        "An amazing fire sword attack on all the ennemies.",
        "A darkness attack on one ennemy.",
        "Heal one ally.",
        "A fire attack on one enemy.",
        "A water attack on one enemy.",
        "A wind attack on one enemy.",
        "Heal yourself with bandages.",
        "Increase your strength for the next attacks."
    };
    TargetKind targetsKind[] = {
        TargetKind::Enemy, TargetKind::None, TargetKind::None, TargetKind::None,
        TargetKind::None, TargetKind::AllEnemies, TargetKind::Enemy, TargetKind
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
        skill = new SystemSkill(i + 1, new LangsTranslation(names[i]), iconsID
            [i], new LangsTranslation(descriptions[i]), targetsKind[i],
            targetConditions[i].isEmpty() ? new PrimitiveValue(
            PrimitiveValueKind::None) : new PrimitiveValue(targetConditions[i]),
            new PrimitiveValue(PrimitiveValueKind::None), availablesKind[i], new
            SystemPlaySong(songsID[i], SongKind::Sound), new PrimitiveValue(
            PrimitiveValueKind::None), new PrimitiveValue(PrimitiveValueKind
            ::None), modelCosts, modelEffects);
        m_model->appendRow(skill->getModelRow());
    }
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
