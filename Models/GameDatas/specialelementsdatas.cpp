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
#include "systemautotile.h"
#include "wanok.h"

const QString SpecialElementsDatas::JSON_WALLS = "walls";
const QString SpecialElementsDatas::JSON_AUTOTILES = "autotiles";

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

QStandardItemModel* SpecialElementsDatas::model(PictureKind kind) const {
    switch (kind) {
    case PictureKind::Autotiles:
        return modelAutotiles();
    case PictureKind::Walls:
        return modelSpriteWalls();
    case PictureKind::Reliefs:
        return modelReliefs();
    default:
        return nullptr;
    }
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
    setDefaultSpriteWalls();
    setDefaultAutotiles();
}

// -------------------------------------------------------

void SpecialElementsDatas::setDefaultSpriteWalls() {
    QStandardItem* item;
    SystemSpriteWall* sys;

    item = new QStandardItem;
    sys = new SystemSpriteWall(1, "Inside1", 1);
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(sys->toString());
    m_modelSpriteWalls->appendRow(item);
}

// -------------------------------------------------------

void SpecialElementsDatas::setDefaultAutotiles() {
    QStandardItem* item;
    SystemAutotile* sys;

    item = new QStandardItem;
    sys = new SystemAutotile(1, "Grass", 1);
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(sys->toString());
    m_modelAutotiles->appendRow(item);
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

    // Read
    readSpecials(json, PictureKind::Walls, JSON_WALLS);
    readSpecials(json, PictureKind::Autotiles, JSON_AUTOTILES);
}

// -------------------------------------------------------

void SpecialElementsDatas::readSpecials(const QJsonObject &json,
                                        PictureKind kind, QString jsonName)
{
    QJsonArray jsonList = json[jsonName].toArray();
    QStandardItem* item;
    SuperListItem* sys;
    for (int i = 0; i < jsonList.size(); i++) {
        item = new QStandardItem;
        sys = SuperListItem::getnewInstance(kind);
        sys->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sys->toString());
        this->model(kind)->appendRow(item);
    }
}

// -------------------------------------------------------

void SpecialElementsDatas::write(QJsonObject &json) const{
    writeSpecials(json, PictureKind::Walls, JSON_WALLS);
    writeSpecials(json, PictureKind::Autotiles, JSON_AUTOTILES);
}

// -------------------------------------------------------

void SpecialElementsDatas::writeSpecials(QJsonObject &json, PictureKind kind,
                                         QString jsonName) const
{
    QJsonArray jsonArray;

    for (int i = 0; i < this->model(kind)->invisibleRootItem()->rowCount(); i++)
    {
        QJsonObject json;
        SuperListItem* sys =
                ((SuperListItem*) m_modelSpriteWalls->item(i)->data()
                 .value<quintptr>());
        sys->write(json);
        jsonArray.append(json);
    }
    json[jsonName] = jsonArray;
}
