/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include <QVector2D>
#include "object3dbox.h"
#include "rpm.h"

QVector3D Object3DBoxDatas::VERTICES[24] {

    // Front
    QVector3D(0.0f, 1.0f, 1.0f),
    QVector3D(1.0f, 1.0f, 1.0f),
    QVector3D(1.0f, 0.0f, 1.0f),
    QVector3D(0.0f, 0.0f, 1.0f),

    // Back
    QVector3D(1.0f, 1.0f, 0.0f),
    QVector3D(0.0f, 1.0f, 0.0f),
    QVector3D(0.0f, 0.0f, 0.0f),
    QVector3D(1.0f, 0.0f, 0.0f),

    // Left
    QVector3D(0.0f, 1.0f, 0.0f),
    QVector3D(0.0f, 1.0f, 1.0f),
    QVector3D(0.0f, 0.0f, 1.0f),
    QVector3D(0.0f, 0.0f, 0.0f),

    // Right
    QVector3D(1.0f, 1.0f, 1.0f),
    QVector3D(1.0f, 1.0f, 0.0f),
    QVector3D(1.0f, 0.0f, 0.0f),
    QVector3D(1.0f, 0.0f, 1.0f),

    // Bottom
    QVector3D(0.0f, 0.0f, 1.0f),
    QVector3D(1.0f, 0.0f, 1.0f),
    QVector3D(1.0f, 0.0f, 0.0f),
    QVector3D(0.0f, 0.0f, 0.0f),

    // Top
    QVector3D(0.0f, 1.0f, 0.0f),
    QVector3D(1.0f, 1.0f, 0.0f),
    QVector3D(1.0f, 1.0f, 1.0f),
    QVector3D(0.0f, 1.0f, 1.0f)
};

QVector2D Object3DBoxDatas::TEXTURES[24] {

    // Front
    QVector2D(0.25f, 0.333333333333333f),
    QVector2D(0.5f, 0.333333333333333f),
    QVector2D(0.5f, 0.666666666666666f),
    QVector2D(0.25f, 0.666666666666666f),

    // Back
    QVector2D(0.75f, 0.333333333333333f),
    QVector2D(1.0f, 0.333333333333333f),
    QVector2D(1.0f, 0.666666666666666f),
    QVector2D(0.75f, 0.666666666666666f),

    // Left
    QVector2D(0.0f, 0.333333333333333f),
    QVector2D(0.25f, 0.333333333333333f),
    QVector2D(0.25f, 0.666666666666666f),
    QVector2D(0.0f, 0.666666666666666f),

    // Right
    QVector2D(0.5f, 0.333333333333333f),
    QVector2D(0.75f, 0.333333333333333f),
    QVector2D(0.75f, 0.666666666666666f),
    QVector2D(0.5f, 0.666666666666666f),

    // Bottom
    QVector2D(0.25f, 0.666666666666666f),
    QVector2D(0.5f, 0.666666666666666f),
    QVector2D(0.5f, 1.0f),
    QVector2D(0.25f, 1.0f),

    // Top
    QVector2D(0.25f, 0.0f),
    QVector2D(0.5f, 0.0f),
    QVector2D(0.5f, 0.333333333333333f),
    QVector2D(0.25f, 0.333333333333333f)
};

GLuint Object3DBoxDatas::INDEXES[36] {
    0, 1, 2, 0, 2, 3,
    4, 5, 6, 4, 6, 7,
    8, 9, 10, 8, 10, 11,
    12, 13, 14, 12, 14, 15,
    16, 17, 18, 16, 18, 19,
    20, 21, 22, 20, 22, 23
};

int Object3DBoxDatas::NB_VERTICES(24);

int Object3DBoxDatas::NB_INDEXES(36);

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Object3DBoxDatas::Object3DBoxDatas() :
    Object3DDatas()
{

}

Object3DBoxDatas::Object3DBoxDatas(int datasID, SystemObject3D *datas) :
    Object3DDatas(datasID, datas)
{

}

Object3DBoxDatas::~Object3DBoxDatas()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Object3DBoxDatas::getPosSizeCenterInfos(QVector3D &pos, QVector3D &size,
    QVector3D &center, Position &position)
{
    int squareSize = RPM::get()->getSquareSize();

    // Size
    size.setX(static_cast<float>(this->widthPixels()));
    size.setY(static_cast<float>(this->heightPixels()));
    size.setZ(static_cast<float>(this->depthPixels()));

    // Center
    center.setX(pos.x() + (size.x() / 2));
    center.setY(pos.y());
    center.setZ(pos.z() + (size.z() / 2));

    // Position
    pos.setX((position.x() * squareSize) - (size.x() / 2));
    pos.setY((position.getY(squareSize)));
    pos.setZ((position.z() * squareSize) - (size.x() / 2));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

int Object3DBoxDatas::width() const {
    return m_datas->widthSquare() + (m_datas->widthPixel() > 0 ? 1 : 0);
}

// -------------------------------------------------------

int Object3DBoxDatas::height() const {
    return m_datas->heightSquare() + (m_datas->heightPixel() > 0 ? 1 : 0);
}

// -------------------------------------------------------

int Object3DBoxDatas::depth() const {
    return m_datas->depthSquare() + (m_datas->depthPixel() > 0 ? 1 : 0);
}

// -------------------------------------------------------

int Object3DBoxDatas::widthPixels() const {
    return m_datas->widthSquare() * RPM::get()->getSquareSize() + m_datas
        ->widthPixel();
}

// -------------------------------------------------------

int Object3DBoxDatas::heightPixels() const {
    return m_datas->heightSquare() * RPM::get()->getSquareSize() + m_datas
        ->heightPixel();
}

// -------------------------------------------------------

int Object3DBoxDatas::depthPixels() const {
    return m_datas->depthSquare() * RPM::get()->getSquareSize() + m_datas
        ->depthPixel();
}

// -------------------------------------------------------

void Object3DBoxDatas::initializeVertices(QVector<Vertex> &vertices, QVector<
    GLuint> &indexes, Position &position, int &count)
{
    QVector3D pos, size, center, offsetPosition;
    unsigned int offset;
    int i;

    getPosSizeCenterInfos(pos, size, center, position);

    // Offset for centering
    offsetPosition.setX(-0.5f);
    offsetPosition.setY(0.0f);
    offsetPosition.setZ(-0.5f);

    // Vertices
    for (i = 0; i < NB_VERTICES; i++) {
        vertices.append(Vertex((VERTICES[i] - offsetPosition) * size + pos,
            TEXTURES[i]));
    }

    // Create box for intersection tests
    m_box = QBox3D((VERTICES[20] - offsetPosition) * size + pos, (
        VERTICES[17] - offsetPosition) * size + pos);

    // indexes
    offset = static_cast<unsigned int>(count * NB_VERTICES);
    for (i = 0; i < NB_INDEXES; i++) {
        indexes.append(INDEXES[i] + offset);
    }
    count++;
}

// -------------------------------------------------------

float Object3DBoxDatas::intersection(QRay3D &ray) const {
    float minDistance = 0;

    RPM::getMinDistance(minDistance, m_box.intersection(ray));

    return minDistance;
}

// -------------------------------------------------------

QString Object3DBoxDatas::toString() const {
    return Object3DDatas::toString() + " - BOX";
}

// -------------------------------------------------------

void Object3DBoxDatas::read(const QJsonObject & json) {
    Object3DDatas::read(json);
}

// -------------------------------------------------------

void Object3DBoxDatas::write(QJsonObject & json) const{
    Object3DDatas::write(json);
}
