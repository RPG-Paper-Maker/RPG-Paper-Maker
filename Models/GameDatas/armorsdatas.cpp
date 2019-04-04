/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "armorsdatas.h"
#include "systemarmor.h"
#include "rpm.h"
#include "common.h"
#include "systemcaracteristic.h"

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
    RPM::readJSON(Common::pathCombine(path, RPM::pathArmors), *this);
}

QStandardItemModel* ArmorsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ArmorsDatas::setDefault() {
    int i, j, length, l;
    QStandardItemModel * modelCaracteristics;
    SystemArmor *armor;

    QString names[] = {
        "Bronze Helmet", "Bronze Mail", "Bronze Vambraces", "Bronze Greaves",
        "Saphir Ring", "Saphir Necklace"
    };
    int iconsID[] = {
        28, 29, 30, 31, 32, 33
    };
    int types[] = {
        1, 3, 5, 7, 9, 10
    };
    QString descriptions[] = {
        "A bronze helmet.", "A bronze mail.", "A bronze vambraces.",
        "A bronze greaves.",
        "A beautiful saphir ring, the best color for a jewel.",
        "A beautiful saphir necklace, the best color for a jewel."
    };
    int prices[] = {
        10, 50, 40, 30, 200, 150
    };
    QVector<SystemCaracteristic *> caracteristics[] = {
        {SystemCaracteristic::createBuff(10, 2, false, false)},
        {SystemCaracteristic::createBuff(10, 3, false, false)},
        {SystemCaracteristic::createBuff(10, 2, false, false)},
        {SystemCaracteristic::createBuff(10, 2, false, false)},
        {SystemCaracteristic::createBuff(9, 15, false, false)},
        {SystemCaracteristic::createBuff(9, 10, false, false)},
    };
    length = (sizeof(names)/sizeof(*names));

    for (i = 0; i < length; i++) {
        modelCaracteristics = new QStandardItemModel;
        for (j = 0, l = caracteristics[i].length(); j < l; j++) {
            modelCaracteristics->appendRow(caracteristics[i][j]->getModelRow());
        }
        modelCaracteristics->appendRow(new QStandardItem);
        armor = new SystemArmor(i + 1, new LangsTranslation(names[i]), iconsID
            [i], types[i], new LangsTranslation(descriptions[i]), new
            PrimitiveValue(PrimitiveValueKind::None), new PrimitiveValue(prices
            [i]), modelCaracteristics);
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
