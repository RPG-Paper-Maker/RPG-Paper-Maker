/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "object3dcustom.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Object3DCustomDatas::Object3DCustomDatas() :
    Object3DDatas()
{

}

Object3DCustomDatas::Object3DCustomDatas(SystemObject3D *datas) :
    Object3DDatas(datas)
{
    m_min = datas->obj()->minVertex();
    m_max = datas->obj()->maxVertex();
    m_box = QBox3D(m_min, m_max);
}

Object3DCustomDatas::~Object3DCustomDatas()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Object3DCustomDatas::rotateVertex(QVector3D& vec, Position &position,
    QVector3D& center)
{
    if (position.angleY() != 0.0) {
        SpriteDatas::rotateVertexX(vec, center, position.angleY(), 0, 1, 0);
    }
    if (position.angleX() != 0.0) {
        SpriteDatas::rotateVertexX(vec, center, position.angleX(), 1, 0, 0);
    }
    if (position.angleZ() != 0.0) {
        SpriteDatas::rotateVertexX(vec, center, position.angleZ(), 0, 0, 1);
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

qreal Object3DCustomDatas::xMin() const {
    return static_cast<qreal>(m_min.x()) / RPM::get()->getSquareSize();
}

// -------------------------------------------------------

qreal Object3DCustomDatas::yMin() const {
    return static_cast<qreal>(m_min.y()) / RPM::get()->getSquareSize();
}

// -------------------------------------------------------

qreal Object3DCustomDatas::zMin() const {
    return static_cast<qreal>(m_min.z()) / RPM::get()->getSquareSize();
}

// -------------------------------------------------------

qreal Object3DCustomDatas::xMax() const {
    return static_cast<qreal>(m_max.x()) / RPM::get()->getSquareSize();
}

// -------------------------------------------------------

qreal Object3DCustomDatas::yMax() const {
    return static_cast<qreal>(m_max.y()) / RPM::get()->getSquareSize();
}

// -------------------------------------------------------

qreal Object3DCustomDatas::zMax() const {
    return static_cast<qreal>(m_max.z()) / RPM::get()->getSquareSize();
}

// -------------------------------------------------------

int Object3DCustomDatas::width() const {
    return Common::ceil(static_cast<qreal>(this->widthPixels()) / RPM::get()
        ->getSquareSize());
}

// -------------------------------------------------------

int Object3DCustomDatas::height() const {
    return Common::ceil(static_cast<qreal>(this->heightPixels()) / RPM::get()
        ->getSquareSize());
}

// -------------------------------------------------------

int Object3DCustomDatas::depth() const {
    return Common::ceil(static_cast<qreal>(this->depthPixels()) / RPM::get()
        ->getSquareSize());
}

// -------------------------------------------------------

int Object3DCustomDatas::widthPixels() const {
    QVector3D minimum, maximum;

    minimum = m_box.minimum();
    maximum = m_box.maximum();

    return static_cast<int>(maximum.x() - minimum.x());
}

// -------------------------------------------------------

int Object3DCustomDatas::heightPixels() const {
    QVector3D minimum, maximum;

    minimum = m_box.minimum();
    maximum = m_box.maximum();

    return static_cast<int>(maximum.y() - minimum.y());
}

// -------------------------------------------------------

int Object3DCustomDatas::depthPixels() const {
    QVector3D minimum, maximum;

    minimum = m_box.minimum();
    maximum = m_box.maximum();

    return static_cast<int>(maximum.z() - minimum.z());
}

// -------------------------------------------------------

void Object3DCustomDatas::getCenter(QVector3D &center) const {
    QVector3D vec;

    vec = m_box.center();
    center.setX(vec.x());
    center.setY(vec.y());
    center.setZ(vec.z());
}

// -------------------------------------------------------

int Object3DCustomDatas::minDistanceFromCenter() const {
    int w, h, d, max;

    w = this->widthPixels();
    h = this->heightPixels();
    d = this->depthPixels();
    max = std::max(w, h);
    max = std::max(max, d);

    return max + ((w + h + d) / 2);
}

// -------------------------------------------------------

void Object3DCustomDatas::initializeVertices(QVector<Vertex> &vertices,
    QVector<GLuint> &indexes, Position &position, unsigned int &count)
{
    QVector3D positionOffset, size, center, vec, vecA, vecB;
    SystemCustomShape *shape;
    QPair<int, int> index;
    int i, l, squareSize;
    float scale;

    scale = static_cast<float>(m_datas->scale());
    size.setX(scale);
    size.setY(scale);
    size.setZ(scale);
    squareSize = RPM::get()->getSquareSize();
    shape = m_datas->obj();
    positionOffset.setX((position.x() * squareSize) + (RPM::getSquareSize() / 2));
    positionOffset.setY(position.getY(squareSize));
    positionOffset.setZ((position.z() * squareSize) + (RPM::getSquareSize() / 2));
    m_box = QBox3D(shape->minVertex() * size + positionOffset, shape
        ->maxVertex() * size + positionOffset);
    this->getCenter(center);
    for (i = 0, l = shape->facesCount(); i < l; i++) {
        index = shape->getFace(i);
        vec = shape->getVertexAt(index.first) * size + positionOffset;
        this->rotateVertex(vec, position, center);
        vertices.append(Vertex(vec, shape->getTextureAt(index.second)));
        indexes.append(count++);
    }

    // Create collision box according to vertex positions
    vecA = shape->minVertex() * size + positionOffset;
    vecB = shape->maxVertex() * size + positionOffset;
    this->rotateVertex(vecA, position, center);
    this->rotateVertex(vecB, position, center);
    m_box = QBox3D(vecA, vecB);
}

// -------------------------------------------------------

float Object3DCustomDatas::intersection(QRay3D &ray) const {
    float minDistance = 0;

    Common::getMinDistance(minDistance, m_box.intersection(ray));

    return minDistance;
}

// -------------------------------------------------------

void Object3DCustomDatas::read(const QJsonObject & json) {
    Object3DDatas::read(json);
}

// -------------------------------------------------------

void Object3DCustomDatas::write(QJsonObject & json) const{
    Object3DDatas::write(json);
}
