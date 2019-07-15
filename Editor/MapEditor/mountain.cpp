/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "mountain.h"
#include "rpm.h"
#include "systemmountain.h"

const QString MountainDatas::JSON_SPECIAL_ID = "sid";
const QString MountainDatas::JSON_WIDTH_SQUARES = "ws";
const QString MountainDatas::JSON_WIDTH_PIXELS = "wp";
const QString MountainDatas::JSON_HEIGHT_SQUARES = "hs";
const QString MountainDatas::JSON_HEIGHT_PIXELS = "hp";
const QString MountainDatas::JSON_DRAW_TOP = "dt";
const QString MountainDatas::JSON_DRAW_BOT = "db";
const QString MountainDatas::JSON_DRAW_LEFT = "dl";
const QString MountainDatas::JSON_DRAW_RIGHT = "dr";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MountainDatas::MountainDatas() :
    MountainDatas(-1, 0, 0, 1, 0)
{

}

MountainDatas::MountainDatas(int specialID, int ws, double wp, int hs, double
    hp) :
    m_specialID(specialID),
    m_widthSquares(ws),
    m_widthPixels(wp),
    m_heightSquares(hs),
    m_heightPixels(hp),
    m_drawTop(false),
    m_drawBot(false),
    m_drawLeft(false),
    m_drawRight(false)
{
    m_textureID = reinterpret_cast<SystemMountain *>(SuperListItem::getById(RPM
        ::get()->project()->specialElementsDatas()->modelMountains()
        ->invisibleRootItem(), m_specialID))->picture()->id();
}

MountainDatas::~MountainDatas()
{

}

int MountainDatas::textureID() const {
    return m_textureID;
}

int MountainDatas::widthSquares() const {
    return m_widthSquares;
}

double MountainDatas::widthPixels() const {
    return m_widthPixels;
}

int MountainDatas::heightSquares() const {
    return m_heightSquares;
}

double MountainDatas::heightPixels() const {
    return m_heightPixels;
}

bool MountainDatas::operator==(const MountainDatas& other) const {
    return MapElement::operator==(other) && m_specialID == other.m_specialID &&
        m_widthSquares == other.m_widthSquares && qFuzzyCompare(m_widthPixels,
        other.m_widthPixels) && m_heightSquares == other.m_heightSquares &&
        qFuzzyCompare(m_heightPixels, other.m_heightPixels);
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

    if (json.contains(JSON_SPECIAL_ID)) {
        m_specialID = json[JSON_SPECIAL_ID].toInt();
    }
    if (json.contains(JSON_WIDTH_SQUARES)) {
        m_widthSquares = json[JSON_WIDTH_SQUARES].toInt();
    }
    if (json.contains(JSON_WIDTH_PIXELS)) {
        m_widthPixels = json[JSON_WIDTH_PIXELS].toDouble();
    }
    if (json.contains(JSON_HEIGHT_SQUARES)) {
        m_heightSquares = json[JSON_HEIGHT_SQUARES].toInt();
    }
    if (json.contains(JSON_HEIGHT_PIXELS)) {
        m_heightPixels = json[JSON_HEIGHT_PIXELS].toDouble();
    }
    if (json.contains(JSON_DRAW_TOP)) {
        m_drawTop = json[JSON_DRAW_TOP].toBool();
    }
    if (json.contains(JSON_DRAW_BOT)) {
        m_drawBot = json[JSON_DRAW_BOT].toBool();
    }
    if (json.contains(JSON_DRAW_LEFT)) {
        m_drawLeft = json[JSON_DRAW_LEFT].toBool();
    }
    if (json.contains(JSON_DRAW_RIGHT)) {
        m_drawRight = json[JSON_DRAW_RIGHT].toBool();
    }
}

// -------------------------------------------------------

void MountainDatas::write(QJsonObject &json) const {
    MapElement::write(json);

    if (m_specialID != -1) {
        json[JSON_SPECIAL_ID] = m_textureID;
    }
    if (m_widthSquares != 0) {
        json[JSON_WIDTH_SQUARES] = m_widthSquares;
    }
    if (m_widthPixels != 0.0) {
        json[JSON_WIDTH_PIXELS] = m_widthPixels;
    }
    if (m_heightSquares != 1) {
        json[JSON_HEIGHT_SQUARES] = m_heightSquares;
    }
    if (m_heightPixels != 0.0) {
        json[JSON_HEIGHT_PIXELS] = m_heightPixels;
    }
    if (m_drawTop) {
        json[JSON_DRAW_TOP] = m_drawTop;
    }
    if (m_drawBot) {
        json[JSON_DRAW_BOT] = m_drawBot;
    }
    if (m_drawLeft) {
        json[JSON_DRAW_LEFT] = m_drawLeft;
    }
    if (m_drawRight) {
        json[JSON_DRAW_RIGHT] = m_drawRight;
    }
}
