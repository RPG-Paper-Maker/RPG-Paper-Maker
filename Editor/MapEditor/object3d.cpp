/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "object3dbox.h"
#include "object3dcustom.h"
#include "rpm.h"

const QString Object3DDatas::JSON_DATAS_ID = "did";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Object3DDatas::Object3DDatas() :
    Object3DDatas(nullptr)
{

}

Object3DDatas::Object3DDatas(SystemObject3D *datas) :
    m_datas(datas)
{

}

Object3DDatas::~Object3DDatas()
{

}

SystemObject3D * Object3DDatas::datas() const {
    return m_datas;
}

int Object3DDatas::textureID() const {
    return m_datas->pictureID();
}

bool Object3DDatas::operator==(const Object3DDatas& other) const {
    return MapElement::operator==(other) && m_datas->id()== other.m_datas->id();
}

bool Object3DDatas::operator!=(const Object3DDatas& other) const {
    return !operator==(other);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

Object3DDatas * Object3DDatas::instanciate(SystemObject3D *datas) {
    switch (datas->shapeKind()) {
    case ShapeKind::Box:
        return new Object3DBoxDatas(datas);
    case ShapeKind::Custom:
        return new Object3DCustomDatas(datas);
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

Object3DDatas * Object3DDatas::instanciateFromJSON(const QJsonObject &json) {
    return Object3DDatas::instanciate(Object3DDatas::readFromJSON(json));
}

// -------------------------------------------------------

SystemObject3D * Object3DDatas::readFromJSON(const QJsonObject &json) {
    SystemObject3D *object;
    int id;

    id = json[JSON_DATAS_ID].toInt();
    object = reinterpret_cast<SystemObject3D *>(SuperListItem::getById(RPM
        ::get()->project()->specialElementsDatas()->model(PictureKind::Object3D)
        ->invisibleRootItem(), id, false));
    if (object == nullptr) {
        object = RPM::get()->project()->specialElementsDatas()
            ->missingObject3D();
        object->setId(id);
    }

    return object;
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
    return RPM::translate(Translations::THREED_OBJECT).toUpper() + RPM::SPACE +
        RPM::DASH + RPM::SPACE + m_datas->name();
}

// -------------------------------------------------------

void Object3DDatas::read(const QJsonObject &json) {
    MapElement::read(json);

    m_datas = Object3DDatas::readFromJSON(json);
}

// -------------------------------------------------------

void Object3DDatas::write(QJsonObject &json) const{
    MapElement::write(json);

    json[JSON_DATAS_ID] = m_datas->id();
}
