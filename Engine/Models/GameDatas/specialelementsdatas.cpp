/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#include "specialelementsdatas.h"
#include "systemspritewall.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SpecialElementsDatas::SpecialElementsDatas()
{
    m_modelAutotiles = new QStandardItemModel;
    m_modelSpriteWalls = new QStandardItemModel;
    m_model3DObjects = new QStandardItemModel;
    m_modelReliefs = new QStandardItemModel;
}

SpecialElementsDatas::~SpecialElementsDatas()
{
    SuperListItem::deleteModel(m_modelAutotiles);
    SuperListItem::deleteModel(m_modelSpriteWalls);
    SuperListItem::deleteModel(m_model3DObjects);
    SuperListItem::deleteModel(m_modelReliefs);
}

void SpecialElementsDatas::read(QString path){
    Wanok::readJSON(Wanok::pathCombine(path, Wanok::PATH_SPECIAL_ELEMENTS),
                    *this);
}

QStandardItemModel* SpecialElementsDatas::modelAutotiles() const {
    return m_modelAutotiles;
}

QStandardItemModel* SpecialElementsDatas::modelSpriteWalls() const {
    return m_modelSpriteWalls;
}

QStandardItemModel* SpecialElementsDatas::model3DObjects() const {
    return m_model3DObjects;
}

QStandardItemModel* SpecialElementsDatas::modelReliefs() const {
    return m_modelReliefs;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SpecialElementsDatas::setDefault()
{
    QStandardItem* item;
    SystemSpriteWall* sysWall;

    // Sprite wall
    item = new QStandardItem;
    sysWall = new SystemSpriteWall(1, "Inside1", 1);
    item->setData(QVariant::fromValue(
                      reinterpret_cast<quintptr>(sysWall)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(sysWall->toString());
    m_modelSpriteWalls->appendRow(item);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SpecialElementsDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_modelAutotiles, false);
    SuperListItem::deleteModel(m_modelSpriteWalls, false);
    SuperListItem::deleteModel(m_model3DObjects, false);
    SuperListItem::deleteModel(m_modelReliefs, false);

    // Sprite wall
    QJsonArray jsonList = json["spriteWall"].toArray();
    QStandardItem* item;
    SystemSpriteWall* sysWall;
    for (int i = 0; i < jsonList.size(); i++) {
        item = new QStandardItem;
        sysWall = new SystemSpriteWall;
        sysWall->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysWall)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysWall->toString());
        m_modelSpriteWalls->appendRow(item);
    }
}

// -------------------------------------------------------

void SpecialElementsDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;

    // Sprite wall
    for (int i = 0; i < m_modelSpriteWalls->invisibleRootItem()->rowCount();
         i++)
    {
        QJsonObject json;
        SystemSpriteWall* sysWall =
                ((SystemSpriteWall*) m_modelSpriteWalls->item(i)->data()
                 .value<quintptr>());
        sysWall->write(json);
        jsonArray.append(json);
    }
    json["spriteWall"] = jsonArray;
}
