/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "weaponsdatas.h"
#include "systemweapon.h"
#include "rpm.h"
#include "common.h"
#include "systemeffect.h"

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
    RPM::readJSON(Common::pathCombine(path, RPM::pathWeapons), *this);
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
        "Wooden sword", "Iron axe"
    };
    int iconsID[] = {
        26, 27
    };
    int types[] = {
        1, 2
    };
    bool oneHands[] = {
        true, false
    };
    QString descriptions[] = {
        "A sword used for beginners.",
        "An axe used for beginners."
    };
    int prices[] = {
        40, 50
    };
    QVector<SystemEffect *> effects[] = {
        {SystemEffect::createDamage("1 + u.atk - t.pdef", -1, "1")}, {SystemEffect
        ::createDamage("2 + u.atk - t.pdef", -1, "1")}
    };
    length = (sizeof(names)/sizeof(*names));

    for (i = 0; i < length; i++) {
        modelEffects = new QStandardItemModel;
        for (j = 0, l = effects[i].length(); j < l; j++) {
            modelEffects->appendRow(effects[i][j]->getModelRow());
        }
        modelEffects->appendRow(new QStandardItem);
        weapon = new SystemWeapon(i + 1, new LangsTranslation(names[i]), iconsID
            [i], types[i], oneHands[i], new LangsTranslation(descriptions[i]),
            TargetKind::Enemy, new PrimitiveValue(PrimitiveValueKind::None), new
            PrimitiveValue(PrimitiveValueKind::None), new PrimitiveValue(
            PrimitiveValueKind::None), new PrimitiveValue(PrimitiveValueKind
            ::None), new PrimitiveValue(prices[i]), new QStandardItemModel,
            modelEffects, new QStandardItemModel);
        m_model->appendRow(weapon->getModelRow());
    }
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
