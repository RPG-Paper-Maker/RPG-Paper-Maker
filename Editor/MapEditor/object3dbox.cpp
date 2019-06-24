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
    QVector2D(1, 5),
    QVector2D(2, 5),
    QVector2D(2, 6),
    QVector2D(1, 6),

    // Back
    QVector2D(3, 5),
    QVector2D(4, 5),
    QVector2D(4, 6),
    QVector2D(3, 6),

    // Left
    QVector2D(0, 5),
    QVector2D(1, 5),
    QVector2D(1, 6),
    QVector2D(0, 6),

    // Right
    QVector2D(2, 5),
    QVector2D(3, 5),
    QVector2D(3, 6),
    QVector2D(2, 6),

    // Bottom
    QVector2D(1, 6),
    QVector2D(2, 6),
    QVector2D(2, 7),
    QVector2D(1, 7),

    // Top
    QVector2D(1, 0),
    QVector2D(2, 0),
    QVector2D(2, 5),
    QVector2D(1, 5)
};

QList<float> Object3DBoxDatas::TEXTURES_VALUES {
    0.0f, 0.25f, 0.5f, 0.75f, 1.0f, 0.333333333333333f, 0.666666666666666f, 1.0f
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

Object3DBoxDatas::Object3DBoxDatas(SystemObject3D *datas) :
    Object3DDatas(datas)
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
    pos.setX((position.x() * squareSize));
    pos.setY((position.getY(squareSize)));
    pos.setZ((position.z() * squareSize));
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

void Object3DBoxDatas::getCenter(QVector3D &center) const {
    center.setX(static_cast<float>(this->widthPixels()) / 2);
    center.setY(static_cast<float>(this->heightPixels()) / 2);
    center.setZ(static_cast<float>(this->depthPixels()) / 2);
}

// -------------------------------------------------------

int Object3DBoxDatas::minDistanceFromCenter() const {
    int w, h, d, max;

    w = this->widthPixels();
    h = this->heightPixels();
    d = this->depthPixels();
    max = std::max(w, h);
    max = std::max(max, d);

    return max + ((w + h + d) / 2);
}

// -------------------------------------------------------

void Object3DBoxDatas::initializeVertices(QVector<Vertex> &vertices,
    QVector<GLuint> &indexes, Position &position, unsigned int &count)
{
    QVector3D pos, size, center;
    QVector2D tex;
    QList<float> textures;
    int i, w, h, d;
    float totalX, totalY;

    getPosSizeCenterInfos(pos, size, center, position);

    // Textures
    textures = TEXTURES_VALUES;
    if (!m_datas->stretch()) {
        w = this->widthPixels();
        h = this->heightPixels();
        d = this->depthPixels();
        totalX = (d * 2) + (w * 2);
        totalY = (d * 2) + h;
        textures.replace(1, d / totalX);
        textures.replace(2, (d + w) / totalX);
        textures.replace(3, ((2 * d) + w) / totalX);
        textures.replace(5, d / totalY);
        textures.replace(6, (d + h) / totalY);
    }

    // Vertices
    for (i = 0; i < NB_VERTICES; i++) {
        tex = TEXTURES[i];
        vertices.append(Vertex(VERTICES[i] * size + pos, QVector2D(textures[
            static_cast<int>(tex.x())], textures[static_cast<int>(tex.y())])));
    }

    // Create box for intersection tests
    m_box = QBox3D(VERTICES[20] * size + pos, VERTICES[17] * size + pos);

    // Indexes
    for (i = 0; i < NB_INDEXES; i++) {
        indexes.append(INDEXES[i] + count);
    }
    count += static_cast<unsigned int>(NB_VERTICES);
}

// -------------------------------------------------------

float Object3DBoxDatas::intersection(QRay3D &ray) const {
    float minDistance = 0;

    RPM::getMinDistance(minDistance, m_box.intersection(ray));

    return minDistance;
}

// -------------------------------------------------------

void Object3DBoxDatas::read(const QJsonObject & json) {
    Object3DDatas::read(json);
}

// -------------------------------------------------------

void Object3DBoxDatas::write(QJsonObject & json) const{
    Object3DDatas::write(json);
}
