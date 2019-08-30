/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QVector2D>
#include "object3dbox.h"
#include "rpm.h"
#include "common.h"
#include "sprite.h"

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
    int squareSize;
    float coef;

    squareSize = RPM::get()->getSquareSize();
    coef = 0.01f;

    // Size
    size.setX(static_cast<float>(this->widthPixels()) - (2 * coef));
    size.setY(static_cast<float>(this->heightPixels()) - (2 * coef));
    size.setZ(static_cast<float>(this->depthPixels()) - (2 * coef));

    // Center
    this->getCenter(center);

    // Position
    pos.setX((position.x() * squareSize) + coef);
    pos.setY(position.getY(squareSize) + coef);
    pos.setZ((position.z() * squareSize) + coef);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

qreal Object3DBoxDatas::xMin() const {
    return 0;
}

// -------------------------------------------------------

qreal Object3DBoxDatas::yMin() const {
    return 0;
}

// -------------------------------------------------------

qreal Object3DBoxDatas::zMin() const {
    return 0;
}

// -------------------------------------------------------

qreal Object3DBoxDatas::xMax() const {
    return this->width();
}

// -------------------------------------------------------

qreal Object3DBoxDatas::yMax() const {
    return this->height();
}

// -------------------------------------------------------

qreal Object3DBoxDatas::zMax() const {
    return this->depth();
}

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
    return m_datas->width();
}

// -------------------------------------------------------

int Object3DBoxDatas::heightPixels() const {
    return m_datas->height();
}

// -------------------------------------------------------

int Object3DBoxDatas::depthPixels() const {
    return m_datas->depth();
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
    QVector3D pos, size, center, vec;
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
        vec = VERTICES[i] * size;
        if (position.angleY() != 0.0) {
            SpriteDatas::rotateVertexX(vec, center, position.angleY(), 0, 1, 0);
        }
        if (position.angleX() != 0.0) {
            SpriteDatas::rotateVertexX(vec, center, position.angleX(), 1, 0, 0);
        }
        if (position.angleZ() != 0.0) {
            SpriteDatas::rotateVertexX(vec, center, position.angleZ(), 0, 0, 1);
        }
        vertices.append(Vertex(vec + pos, QVector2D(textures[static_cast<int>(
            tex.x())], textures[static_cast<int>(tex.y())])));
    }

    // Create box for intersection tests
    m_box = QBox3D(vertices.at(static_cast<int>(count) + 20).position(),
        vertices.at(static_cast<int>(count) + 17).position());

    // Indexes
    for (i = 0; i < NB_INDEXES; i++) {
        indexes.append(INDEXES[i] + count);
    }
    count += static_cast<unsigned int>(NB_VERTICES);
}

// -------------------------------------------------------

float Object3DBoxDatas::intersection(QRay3D &ray) const {
    float minDistance = 0;

    Common::getMinDistance(minDistance, m_box.intersection(ray));

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
