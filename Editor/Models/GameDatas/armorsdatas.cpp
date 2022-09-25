/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "armorsdatas.h"
#include "systemarmor.h"
#include "rpm.h"
#include "common.h"
#include "systemcharacteristic.h"
#include "systemcost.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ArmorsDatas::ArmorsDatas() {
    m_model = new QStandardItemModel;
}

ArmorsDatas::~ArmorsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void ArmorsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_ARMORS), *this);
}

QStandardItemModel* ArmorsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ArmorsDatas::setDefault() {
    int i, j, length, l;
    QStandardItemModel * modelCharacteristics;
    SystemArmor *armor;

    QString names[] = {
        RPM::translate(Translations::BRONZE_HELMET),
        RPM::translate(Translations::BRONZE_MAIL),
        RPM::translate(Translations::BRONZE_VAMBRACES),
        RPM::translate(Translations::BRONZE_GREAVES),
        RPM::translate(Translations::SAPPHIRE_RING),
        RPM::translate(Translations::SAPPHIRE_NECKLACE)
    };
    int iconsX[] = {
        2, 3, 1, 4, 8, 7
    };
    int iconsY[] = {
        1, 1, 1, 1, 1, 1
    };
    int types[] = {
        1, 3, 5, 7, 9, 10
    };
    QString descriptions[] = {
        RPM::translate(Translations::BRONZE_HELMET_DESCRIPTION),
        RPM::translate(Translations::BRONZE_MAIL_DESCRIPTION),
        RPM::translate(Translations::BRONZE_VAMBRACES_DESCRIPTION),
        RPM::translate(Translations::BRONZE_GREAVES_DESCRIPTION),
        RPM::translate(Translations::SAPPHIRE_RING_DESCRIPTION),
        RPM::translate(Translations::SAPPHIRE_NECKLACE_DESCRIPTION)
    };
    int prices[] = {
        10, 50, 40, 30, 200, 150
    };
    QVector<SystemCharacteristic *> characteristics[] = {
        {SystemCharacteristic::createBuff(10, 2, false, false)},
        {SystemCharacteristic::createBuff(10, 3, false, false)},
        {SystemCharacteristic::createBuff(10, 2, false, false)},
        {SystemCharacteristic::createBuff(10, 2, false, false)},
        {SystemCharacteristic::createBuff(9, 15, false, false)},
        {SystemCharacteristic::createBuff(9, 10, false, false)},
    };
    length = (sizeof(names)/sizeof(*names));
    QStandardItemModel *modelPrice;
    for (i = 0; i < length; i++) {
        modelCharacteristics = new QStandardItemModel;
        modelPrice = new QStandardItemModel;
        for (j = 0, l = characteristics[i].length(); j < l; j++) {
            modelCharacteristics->appendRow(characteristics[i][j]->getModelRow());
        }
        modelCharacteristics->appendRow(new QStandardItem);
        modelPrice->appendRow((new SystemCost(DamagesKind::Currency, new
            PrimitiveValue(PrimitiveValueKind::DataBase, 1), new PrimitiveValue(
            PrimitiveValueKind::DataBase, 1), 1, new PrimitiveValue(QString
            ::number(prices[i]))))->getModelRow());
        armor = new SystemArmor(i + 1, names[i], 1, iconsX[i], iconsY[i], types[i],
            new SystemTranslatable(-1, descriptions[i]), new PrimitiveValue(
            PrimitiveValueKind::None), modelPrice, modelCharacteristics);
        m_model->appendRow(armor->getModelRow());
    }
}

void ArmorsDatas::setDefaultTranslations()
{
    SystemCommonSkillItem::setNameDescription(m_model, 0, RPM::translate(Translations::COPPER_HELMET), RPM::translate(Translations::BRONZE_HELMET_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 1, RPM::translate(Translations::COPPER_MAIL), RPM::translate(Translations::BRONZE_MAIL_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 2, RPM::translate(Translations::COPPER_VAMBRACES), RPM::translate(Translations::BRONZE_VAMBRACES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 3, RPM::translate(Translations::COPPER_GREAVES), RPM::translate(Translations::BRONZE_GREAVES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 4, RPM::translate(Translations::COTTON_HEADGEAR), RPM::translate(Translations::COTTON_HEADGEAR_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 5, RPM::translate(Translations::COTTON_VEST), RPM::translate(Translations::COTTON_VEST_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 6, RPM::translate(Translations::COTTON_GLOVES), RPM::translate(Translations::COTTON_GLOVES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 7, RPM::translate(Translations::COTTON_TROUSERS), RPM::translate(Translations::COTTON_TROUSERS_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 8, RPM::translate(Translations::SILVER_HELMET), RPM::translate(Translations::SILVER_HELMET_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 9, RPM::translate(Translations::SILVER_MAIL), RPM::translate(Translations::SILVER_MAIL_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 10, RPM::translate(Translations::SILVER_VAMBRACES), RPM::translate(Translations::SILVER_VAMBRACES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 11, RPM::translate(Translations::SILVER_GREAVES), RPM::translate(Translations::SILVER_GREAVES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 12, RPM::translate(Translations::LEATHER_HEADGEAR), RPM::translate(Translations::LEATHER_HEADGEAR_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 13, RPM::translate(Translations::LEATHER_VEST), RPM::translate(Translations::LEATHER_VEST_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 14, RPM::translate(Translations::LEATHER_GLOVES), RPM::translate(Translations::LEATHER_GLOVES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 15, RPM::translate(Translations::LEATHER_TROUSERS), RPM::translate(Translations::LEATHER_TROUSERS_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 16, RPM::translate(Translations::GOLD_HELMET), RPM::translate(Translations::GOLD_HELMET_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 17, RPM::translate(Translations::GOLD_MAIL), RPM::translate(Translations::GOLD_MAIL_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 18, RPM::translate(Translations::GOLD_VAMBRACES), RPM::translate(Translations::GOLD_VAMBRACES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 19, RPM::translate(Translations::GOLD_GREAVES), RPM::translate(Translations::GOLD_GREAVES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 20, RPM::translate(Translations::LUXURIOUS_HEADGEAR), RPM::translate(Translations::LUXURIOUS_HEADGEAR_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 21, RPM::translate(Translations::LUXURIOUS_VEST), RPM::translate(Translations::LUXURIOUS_VEST_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 22, RPM::translate(Translations::LUXURIOUS_GLOVES), RPM::translate(Translations::LUXURIOUS_GLOVES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 23, RPM::translate(Translations::LUXURIOUS_TROUSERS), RPM::translate(Translations::LUXURIOUS_TROUSERS_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 24, RPM::translate(Translations::DIAMOND_HELMET), RPM::translate(Translations::DIAMOND_HELMET_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 25, RPM::translate(Translations::DIAMOND_MAIL), RPM::translate(Translations::DIAMOND_MAIL_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 26, RPM::translate(Translations::DIAMOND_VAMBRACES), RPM::translate(Translations::DIAMOND_VAMBRACES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 27, RPM::translate(Translations::DIAMOND_GREAVES), RPM::translate(Translations::DIAMOND_GREAVES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 28, RPM::translate(Translations::MYSTIC_HEADGEAR), RPM::translate(Translations::MYSTIC_HEADGEAR_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 29, RPM::translate(Translations::MYSTIC_VEST), RPM::translate(Translations::MYSTIC_VEST_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 30, RPM::translate(Translations::MYSTIC_GLOVES), RPM::translate(Translations::MYSTIC_GLOVES_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 31, RPM::translate(Translations::MYSTIC_TROUSERS), RPM::translate(Translations::MYSTIC_TROUSERS_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 32, RPM::translate(Translations::SAPPHIRE_RING), RPM::translate(Translations::SAPPHIRE_RING_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 33, RPM::translate(Translations::SAPPHIRE_NECKLACE), RPM::translate(Translations::SAPPHIRE_NECKLACE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 34, RPM::translate(Translations::SAPPHIRE_BRACELET), RPM::translate(Translations::SAPPHIRE_BRACELET_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 35, RPM::translate(Translations::SAPPHIRE_EARRING), RPM::translate(Translations::SAPPHIRE_EARRING_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 36, RPM::translate(Translations::RUBY_RING), RPM::translate(Translations::RUBY_RING_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 37, RPM::translate(Translations::RUBY_NECKLACE), RPM::translate(Translations::RUBY_NECKLACE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 38, RPM::translate(Translations::RUBY_BRACELET), RPM::translate(Translations::RUBY_BRACELET_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 39, RPM::translate(Translations::RUBY_EARRING), RPM::translate(Translations::RUBY_EARRING_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 40, RPM::translate(Translations::EMERALD_RING), RPM::translate(Translations::EMERALD_RING_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 41, RPM::translate(Translations::EMERALD_NECKLACE), RPM::translate(Translations::EMERALD_NECKLACE_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 42, RPM::translate(Translations::EMERALD_BRACELET), RPM::translate(Translations::EMERALD_BRACELET_DESCRIPTION));
    SystemCommonSkillItem::setNameDescription(m_model, 43, RPM::translate(Translations::EMERALD_EARRING), RPM::translate(Translations::EMERALD_EARRING_DESCRIPTION));
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void ArmorsDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["armors"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemArmor* sysArmor = new SystemArmor;
        sysArmor->read(jsonList[i].toObject());
        item->setData(
                    QVariant::fromValue(reinterpret_cast<quintptr>(sysArmor)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysArmor->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void ArmorsDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemArmor* sysArmor =
                ((SystemArmor*)m_model->item(i)->data().value<quintptr>());
        sysArmor->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["armors"] = jsonArray;
}
