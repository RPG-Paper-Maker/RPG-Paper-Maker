/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "specialelementsdatas.h"
#include "systemspritewall.h"
#include "systemautotile.h"
#include "systemobject3d.h"
#include "rpm.h"
#include "common.h"

const QString SpecialElementsDatas::JSON_WALLS = "walls";
const QString SpecialElementsDatas::JSON_AUTOTILES = "autotiles";
const QString SpecialElementsDatas::JSON_OBJECTS_3D = "o";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SpecialElementsDatas::SpecialElementsDatas()
{
    m_modelAutotiles = new QStandardItemModel;
    m_modelSpriteWalls = new QStandardItemModel;
    m_modelObjects3D = new QStandardItemModel;
    m_modelReliefs = new QStandardItemModel;
}

SpecialElementsDatas::~SpecialElementsDatas()
{
    SuperListItem::deleteModel(m_modelAutotiles);
    SuperListItem::deleteModel(m_modelSpriteWalls);
    SuperListItem::deleteModel(m_modelObjects3D);
    SuperListItem::deleteModel(m_modelReliefs);
}

void SpecialElementsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_SPECIAL_ELEMENTS),
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
    case PictureKind::Object3D:
        return modelObjects3D();
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

QStandardItemModel* SpecialElementsDatas::modelObjects3D() const {
    return m_modelObjects3D;
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
    setDefaulObjects3D();
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
    sys = new SystemAutotile(1, "General", 1);
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(sys->toString());
    m_modelAutotiles->appendRow(item);
}

// -------------------------------------------------------

void SpecialElementsDatas::setDefaulObjects3D() { 
    QStandardItem *item;
    SystemObject3D *sys;

    item = new QStandardItem;
    sys = new SystemObject3D(1, "House", ShapeKind::Custom, 1, 1, 1);
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(sys)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(sys->toString());
    m_modelObjects3D->appendRow(item);

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
    SuperListItem::deleteModel(m_modelObjects3D, false);
    SuperListItem::deleteModel(m_modelReliefs, false);

    // Read
    readSpecials(json, PictureKind::Walls, JSON_WALLS);
    readSpecials(json, PictureKind::Autotiles, JSON_AUTOTILES);
    readSpecials(json, PictureKind::Object3D, JSON_OBJECTS_3D);
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
    writeSpecials(json, PictureKind::Object3D, JSON_OBJECTS_3D);
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
                ((SuperListItem*) this->model(kind)->item(i)->data()
                 .value<quintptr>());
        sys->write(json);
        jsonArray.append(json);
    }
    json[jsonName] = jsonArray;
}
