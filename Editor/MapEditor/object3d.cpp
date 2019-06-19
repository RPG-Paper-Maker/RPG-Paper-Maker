/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "object3d.h"
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

    m_datasID = json[JSON_DATAS_ID].toInt();
    m_datas = reinterpret_cast<SystemObject3D *>(SuperListItem::getById(RPM
        ::get()->project()->specialElementsDatas()->model(PictureKind::Object3D)
        ->invisibleRootItem(), m_datasID));
}

// -------------------------------------------------------

void Object3DDatas::write(QJsonObject &json) const{
    MapElement::write(json);

    json[JSON_DATAS_ID] = m_datasID;
}
