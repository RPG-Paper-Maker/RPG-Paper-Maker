/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "object3dbox.h"
#include "rpm.h"

const QString Object3DDatas::JSON_DATAS_ID = "did";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Object3DDatas::Object3DDatas() :
    Object3DDatas(-1, nullptr)
{

}

Object3DDatas::Object3DDatas(int datasID, SystemObject3D *datas) :
    m_datasID(datasID),
    m_datas(datas)
{

}

Object3DDatas::~Object3DDatas()
{

}

int Object3DDatas::textureID() const {
    return m_datas->pictureID();
}

bool Object3DDatas::operator==(const Object3DDatas& other) const {
    return MapElement::operator==(other) && m_datasID == other.m_datasID;
}

bool Object3DDatas::operator!=(const Object3DDatas& other) const {
    return !operator==(other);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

Object3DDatas * Object3DDatas::instanciate(int datasID, SystemObject3D *datas) {
    switch (datas->shapeKind()) {
    case ShapeKind::Box:
        return new Object3DBoxDatas(datasID, datas);
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

Object3DDatas * Object3DDatas::instanciateFromJSON(const QJsonObject &json) {
    SystemObject3D *datas;
    int id;

    datas = Object3DDatas::readFromJSON(json, id);

    return Object3DDatas::instanciate(id, datas);
}

// -------------------------------------------------------

SystemObject3D * Object3DDatas::readFromJSON(const QJsonObject &json, int &id) {
    id = json[JSON_DATAS_ID].toInt();
    return reinterpret_cast<SystemObject3D *>(SuperListItem::getById(RPM::get()
        ->project()->specialElementsDatas()->model(PictureKind::Object3D)
        ->invisibleRootItem(), id));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

MapEditorSelectionKind Object3DDatas::getKind() const {
    return MapEditorSelectionKind::Objects3D;
}

// -------------------------------------------------------

MapEditorSubSelectionKind Object3DDatas::getSubKind() const {
    return MapEditorSubSelectionKind::Object3D;
}

// -------------------------------------------------------

QString Object3DDatas::toString() const {
    return "3D OBJECT";
}

// -------------------------------------------------------

void Object3DDatas::read(const QJsonObject &json) {
    MapElement::read(json);

    m_datas = Object3DDatas::readFromJSON(json, m_datasID);
}

// -------------------------------------------------------

void Object3DDatas::write(QJsonObject &json) const{
    MapElement::write(json);

    json[JSON_DATAS_ID] = m_datasID;
}
