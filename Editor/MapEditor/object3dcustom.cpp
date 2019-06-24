/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "object3dcustom.h"
#include "rpm.h"

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
    m_box = QBox3D(datas->obj()->minVertex(), datas->obj()->maxVertex());
}

Object3DCustomDatas::~Object3DCustomDatas()
{

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

int Object3DCustomDatas::width() const {
    return this->widthPixels() / RPM::get()->getSquareSize();
}

// -------------------------------------------------------

int Object3DCustomDatas::height() const {
    return this->heightPixels() / RPM::get()->getSquareSize();
}

// -------------------------------------------------------

int Object3DCustomDatas::depth() const {
    return this->depthPixels() / RPM::get()->getSquareSize();
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
    QVector3D vec = m_box.center();

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
    QVector3D positionOffset;
    SystemCustomShape *shape;
    QPair<int, int> index;
    int i, l, squareSize;

    squareSize = RPM::get()->getSquareSize();
    shape = m_datas->obj();
    positionOffset.setX(position.x() * squareSize);
    positionOffset.setY(position.getY(squareSize));
    positionOffset.setZ(position.z() * squareSize);
    for (i = 0, l = shape->facesCount(); i < l; i++) {
        index = shape->getFace(i);
        vertices.append(Vertex(shape->getVertexAt(index.first) + positionOffset,
            shape->getTextureAt(index.second)));
        indexes.append(count++);
    }

    // Create collision box according to vertex positions
    m_box = QBox3D(shape->minVertex() + positionOffset, shape->maxVertex() +
        positionOffset);
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
