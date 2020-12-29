/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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
    int iconsID[] = {
        28, 29, 30, 31, 32, 33
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

    for (i = 0; i < length; i++) {
        modelCharacteristics = new QStandardItemModel;
        for (j = 0, l = characteristics[i].length(); j < l; j++) {
            modelCharacteristics->appendRow(characteristics[i][j]->getModelRow());
        }
        modelCharacteristics->appendRow(new QStandardItem);
        armor = new SystemArmor(i + 1, new LangsTranslation(names[i]), iconsID
            [i], types[i], new LangsTranslation(descriptions[i]), new
            PrimitiveValue(PrimitiveValueKind::None), new PrimitiveValue(prices
            [i]), modelCharacteristics);
        m_model->appendRow(armor->getModelRow());
    }
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
