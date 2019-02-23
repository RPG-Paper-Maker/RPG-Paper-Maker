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

#include "itemsdatas.h"
#include "systemitem.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ItemsDatas::ItemsDatas()
{
    m_model = new QStandardItemModel;
}

ItemsDatas::~ItemsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void ItemsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::pathItems), *this);
}

QStandardItemModel* ItemsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ItemsDatas::setDefault() {
    int i, length;
    QStandardItem* item;
    SystemItem *sys;

    QString names[] = {
        "HP potion", "Super HP potion", "Mega HP potion", "MP potion",
        "Super MP potion", "Mega MP potion", "TP potion", "Super TP potion",
        "Mega TP potion", "key"
    };
    int iconsID[] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    };
    int types[] = {
        1, 1, 1, 1, 1, 1, 1, 1, 1, 2
    };
    bool consumables[] = {
        true, true, true, true, true, true, true, true, true, false
    };
    QString descriptions[] = {
        "A small potion recovering your HP.",
        "A medium potion recovering your HP.",
        "A large potion recovering your HP.",
        "A small potion recovering your MP.",
        "A medium potion recovering your MP.",
        "A large potion recovering your MP.",
        "A small potion recovering your TP.",
        "A medium potion recovering your TP.",
        "A large potion recovering your TP.",
        "A key that can be used for opening a closed door."
    };
    TargetKind targetsKind[] = {
        TargetKind::Ally, TargetKind::Ally, TargetKind::Ally, TargetKind::Ally,
        TargetKind::Ally, TargetKind::Ally, TargetKind::Ally, TargetKind::Ally,
        TargetKind::Ally, TargetKind::None
    };
    QString targetConditionsFormulas[] = {
        "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0", "t.hp > 0",
        "t.hp > 0", "t.hp > 0", "t.hp > 0", ""
    };
    AvailableKind availablesKind[] = {
        AvailableKind::Always, AvailableKind::Always, AvailableKind::Always,
        AvailableKind::Always, AvailableKind::Always, AvailableKind::Always,
        AvailableKind::Always, AvailableKind::Always, AvailableKind::Always,
        AvailableKind::Never
    };
    int songsID[] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    };
    int prices[] = {
        10, 100, 500, 20, 200, 600, 20, 200, 600, 0
    };
    length = (sizeof(names)/sizeof(*names));

    for (i = 0; i < length; i++) {
        sys = new SystemItem(i + 1, new LangsTranslation(names[i]), iconsID[i],
            types[i], consumables[i], new LangsTranslation(descriptions[i]),
            targetsKind[i], new PrimitiveValue(targetConditionsFormulas[i]),
            availablesKind[i], new SystemPlaySong(songsID[i], SongKind::Sound),
            new PrimitiveValue(PrimitiveValueKind::None), new PrimitiveValue(
            PrimitiveValueKind::None), new PrimitiveValue(prices[i]), new
            QStandardItemModel);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void ItemsDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["items"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemItem* sysItem = new SystemItem;
        sysItem->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sysItem)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysItem->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void ItemsDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemItem* sysItem = ((SystemItem*)m_model->item(i)->data()
                               .value<quintptr>());
        sysItem->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["items"] = jsonArray;
}
