/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "mountain.h"

const QString MountainDatas::JSON_TEXTURE_ID = "tid";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MountainDatas::MountainDatas() :
    m_textureID(-1)
{

}

MountainDatas::MountainDatas(int textureID) :
    m_textureID(textureID)
{

}

MountainDatas::~MountainDatas()
{

}

int MountainDatas::textureID() const {
    return m_textureID;
}

bool MountainDatas::operator==(const MountainDatas& other) const {
    return MapElement::operator==(other) && m_textureID == other.m_textureID;
}

bool MountainDatas::operator!=(const MountainDatas& other) const {
    return !operator==(other);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void MountainDatas::initializeVertices(QVector<Vertex> &vertices,
    QVector<GLuint> &indexes, Position &position, unsigned int &count)
{

}

// -------------------------------------------------------

float MountainDatas::intersection(QRay3D &ray) const {
    float minDistance = 0;

    //RPM::getMinDistance(minDistance, m_box.intersection(ray));

    return minDistance;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

MapEditorSelectionKind MountainDatas::getKind() const {
    return MapEditorSelectionKind::Objects3D;
}

// -------------------------------------------------------

MapEditorSubSelectionKind MountainDatas::getSubKind() const {
    return MapEditorSubSelectionKind::Object3D;
}

// -------------------------------------------------------

QString MountainDatas::toString() const {
    return "MOUNTAIN";
}

// -------------------------------------------------------

void MountainDatas::read(const QJsonObject &json) {
    MapElement::read(json);

    if (json.contains(JSON_TEXTURE_ID)) {
        m_textureID = json[JSON_TEXTURE_ID].toInt();
    }
}

// -------------------------------------------------------

void MountainDatas::write(QJsonObject &json) const{
    MapElement::write(json);

    if (m_textureID != -1) {
        json[JSON_TEXTURE_ID] = m_textureID;
    }
}
