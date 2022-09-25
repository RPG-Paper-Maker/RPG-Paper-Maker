/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "weaponsdatas.h"
#include "systemweapon.h"
#include "rpm.h"
#include "common.h"
#include "systemeffect.h"
#include "systemcost.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WeaponsDatas::WeaponsDatas()
{
    m_model = new QStandardItemModel;
}

WeaponsDatas::~WeaponsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void WeaponsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_WEAPONS), *this);
}

QStandardItemModel* WeaponsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WeaponsDatas::setDefault() {
    int i, j, length, l;
    QStandardItemModel *modelEffects;
    SystemWeapon *weapon;

    QString names[] = {
        RPM::translate(Translations::WOODEN_SWORD),
        RPM::translate(Translations::IRON_AXE)
    };
    int iconsX[] = {
        5, 6
    };
    int iconsY[] = {
        1, 1
    };
    int types[] = {
        1, 2
    };
    bool oneHands[] = {
        true, false
    };
    QString descriptions[] = {
        RPM::translate(Translations::WOODEN_SWORD_DESCRIPTION),
        RPM::translate(Translations::IRON_AXE_DESCRIPTION)
    };
    int prices[] = {
        40, 50
    };
    QString targetConditionsFormulas[] = {
        "t.hp > 0", "t.hp > 0"
    };
    QVector<SystemEffect *> effects[] = {
        {SystemEffect::createDamage("1 + u.atk - t.pdef", "0", -1, "1")}, {
        SystemEffect::createDamage("2 + u.atk - t.pdef", "0", -1, "1")}
    };
    length = (sizeof(names)/sizeof(*names));
    QStandardItemModel *modelPrice;
    for (i = 0; i < length; i++) {
        modelEffects = new QStandardItemModel;
        modelPrice = new QStandardItemModel;
        for (j = 0, l = effects[i].length(); j < l; j++) {
            modelEffects->appendRow(effects[i][j]->getModelRow());
        }
        modelEffects->appendRow(new QStandardItem);
        modelPrice->appendRow((new SystemCost(DamagesKind::Currency, new
            PrimitiveValue(PrimitiveValueKind::DataBase, 1), new PrimitiveValue(
            PrimitiveValueKind::DataBase, 1), 1, new PrimitiveValue(QString
            ::number(prices[i]))))->getModelRow());
        weapon = new SystemWeapon(i + 1, names[i], 1, iconsX[i], iconsY[i], types[i],
            oneHands[i], new SystemTranslatable(-1, descriptions[i]), TargetKind::Enemy,
            new PrimitiveValue(targetConditionsFormulas[i]), new PrimitiveValue(
            PrimitiveValueKind::None), new PrimitiveValue(PrimitiveValueKind
            ::None), new PrimitiveValue(PrimitiveValueKind::None), modelPrice,
            new QStandardItemModel, modelEffects, new QStandardItemModel);
        m_model->appendRow(weapon->getModelRow());
    }
}

void WeaponsDatas::setDefaultTranslations()
{
    SystemCommonSkillItem::setNameDescription(m_model, 0, RPM::translate(Translations::COPPER_SWORD), RPM::translate(Translations::COPPER_SWORD_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 1, RPM::translate(Translations::COPPER_AXE), RPM::translate(Translations::COPPER_AXE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 2, RPM::translate(Translations::COPPER_SPEAR), RPM::translate(Translations::COPPER_SPEAR_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 3, RPM::translate(Translations::COPPER_KNIFE), RPM::translate(Translations::COPPER_KNIFE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 4, RPM::translate(Translations::COPPER_STAFF), RPM::translate(Translations::COPPER_STAFF_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 5, RPM::translate(Translations::COPPER_ROD), RPM::translate(Translations::COPPER_ROD_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 6, RPM::translate(Translations::COPPER_FIREARM), RPM::translate(Translations::COPPER_FIREARM_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 7, RPM::translate(Translations::COPPER_BOW), RPM::translate(Translations::COPPER_BOW_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 8, RPM::translate(Translations::SILVER_SWORD), RPM::translate(Translations::SILVER_SWORD_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 9, RPM::translate(Translations::SILVER_AXE), RPM::translate(Translations::SILVER_AXE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 10, RPM::translate(Translations::SILVER_SPEAR), RPM::translate(Translations::SILVER_SPEAR_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 11, RPM::translate(Translations::SILVER_KNIFE), RPM::translate(Translations::SILVER_KNIFE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 12, RPM::translate(Translations::SILVER_STAFF), RPM::translate(Translations::SILVER_STAFF_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 13, RPM::translate(Translations::SILVER_ROD), RPM::translate(Translations::SILVER_ROD_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 14, RPM::translate(Translations::SILVER_FIREARM), RPM::translate(Translations::SILVER_FIREARM_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 15, RPM::translate(Translations::SILVER_BOW), RPM::translate(Translations::SILVER_BOW_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 16, RPM::translate(Translations::GOLD_SWORD), RPM::translate(Translations::GOLD_SWORD_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 17, RPM::translate(Translations::GOLD_AXE), RPM::translate(Translations::GOLD_AXE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 18, RPM::translate(Translations::GOLD_SPEAR), RPM::translate(Translations::GOLD_SPEAR_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 19, RPM::translate(Translations::GOLD_KNIFE), RPM::translate(Translations::GOLD_KNIFE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 20, RPM::translate(Translations::GOLD_STAFF), RPM::translate(Translations::GOLD_STAFF_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 21, RPM::translate(Translations::GOLD_ROD), RPM::translate(Translations::GOLD_ROD_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 22, RPM::translate(Translations::GOLD_FIREARM), RPM::translate(Translations::GOLD_FIREARM_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 23, RPM::translate(Translations::GOLD_BOW), RPM::translate(Translations::GOLD_BOW_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 24, RPM::translate(Translations::DIAMOND_SWORD), RPM::translate(Translations::DIAMOND_SWORD_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 25, RPM::translate(Translations::DIAMOND_AXE), RPM::translate(Translations::DIAMOND_AXE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 26, RPM::translate(Translations::DIAMOND_SPEAR), RPM::translate(Translations::DIAMOND_SPEAR_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 27, RPM::translate(Translations::DIAMOND_KNIFE), RPM::translate(Translations::DIAMOND_KNIFE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 28, RPM::translate(Translations::DIAMOND_STAFF), RPM::translate(Translations::DIAMOND_STAFF_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 29, RPM::translate(Translations::DIAMOND_ROD), RPM::translate(Translations::DIAMOND_ROD_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 30, RPM::translate(Translations::DIAMOND_FIREARM), RPM::translate(Translations::DIAMOND_FIREARM_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 31, RPM::translate(Translations::DIAMOND_BOW), RPM::translate(Translations::DIAMOND_BOW_DESCRIPTION));
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void WeaponsDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["weapons"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemWeapon* sysWeapon = new SystemWeapon;
        sysWeapon->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysWeapon)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysWeapon->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void WeaponsDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemWeapon* sysWeapon = ((SystemWeapon*)m_model->item(i)->data()
                                   .value<quintptr>());
        sysWeapon->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["weapons"] = jsonArray;
}
