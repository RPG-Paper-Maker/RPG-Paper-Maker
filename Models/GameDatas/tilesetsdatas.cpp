/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "tilesetsdatas.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

TilesetsDatas::TilesetsDatas()
{
    m_model = new QStandardItemModel;
}

TilesetsDatas::~TilesetsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void TilesetsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_TILESETS), *this);
}

QStandardItemModel* TilesetsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void TilesetsDatas::setDefault(){
    QStandardItem* item;
    SystemTileset* tileset;

    item = new QStandardItem;
    tileset = new SystemTileset(1, "Plains", 1);
    tileset->addSpecial(new SuperListItem(1, "General"),
                        PictureKind::Autotiles);
    item->setData(QVariant::fromValue(
                      reinterpret_cast<quintptr>(tileset)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(tileset->toString());
    m_model->appendRow(item);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void TilesetsDatas::read(const QJsonObject &json){
    QList<QStandardItem*> row;
    QJsonArray tab = json["list"].toArray();

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    for (int i = 0; i < tab.size(); i++){
        SystemTileset* super = new SystemTileset;
        super->read(tab[i].toObject());
        row = super->getModelRow();
        m_model->appendRow(row);
    }
}

// -------------------------------------------------------

void TilesetsDatas::write(QJsonObject &json) const{
    QJsonArray tab;

    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonKey;
        SystemTileset* super = ((SystemTileset*) m_model->item(i)->data()
                               .value<quintptr>());
        super->write(jsonKey);
        tab.append(jsonKey);
    }
    json["list"] = tab;
}
