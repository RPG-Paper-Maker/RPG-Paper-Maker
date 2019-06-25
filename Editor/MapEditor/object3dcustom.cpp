/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    QVector3D positionOffset, size;
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
    positionOffset.setX(position.x() * squareSize);
    positionOffset.setY(position.getY(squareSize));
    positionOffset.setZ(position.z() * squareSize);
    for (i = 0, l = shape->facesCount(); i < l; i++) {
        index = shape->getFace(i);
        vertices.append(Vertex(shape->getVertexAt(index.first) * size +
            positionOffset, shape->getTextureAt(index.second)));
        indexes.append(count++);
    }

    // Create collision box according to vertex positions
    m_box = QBox3D(shape->minVertex() * size + positionOffset, shape
        ->maxVertex() * size + positionOffset);
}

// -------------------------------------------------------

float Object3DCustomDatas::intersection(QRay3D &ray) const {
    float minDistance = 0;

    RPM::getMinDistance(minDistance, m_box.intersection(ray));

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
