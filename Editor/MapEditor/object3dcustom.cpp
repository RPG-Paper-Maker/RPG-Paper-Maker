/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "object3dcustom.h"
#include "rpm.h"

const QString Object3DCustomDatas::PARSE_VERTEX = "v ";
const QString Object3DCustomDatas::PARSE_NORMAL = "vn ";
const QString Object3DCustomDatas::PARSE_TEXTURE = "vt ";
const QString Object3DCustomDatas::PARSE_FACE = "f ";

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

}

Object3DCustomDatas::~Object3DCustomDatas()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Object3DCustomDatas::parseVertices(QString &fileLine, Position &position,
    QVector3D &minVertex, QVector3D &maxVertex, bool &firstVertex)
{
    QStringList lineList;
    QVector3D temp3D;
    int squareSize;

    squareSize = RPM::get()->getSquareSize();
    if (fileLine.startsWith(PARSE_VERTEX)) {
        lineList = fileLine.split(" ");
        lineList.removeAll("");
        temp3D.setX(lineList[1].toFloat() + (position.x() * squareSize));
        temp3D.setY(lineList[2].toFloat() + (position.getY(squareSize)));
        temp3D.setZ(lineList[3].toFloat() + (position.z() * squareSize));

        // Determine min and max border for creating box collision
        if (firstVertex) {
            minVertex = temp3D;
            maxVertex = temp3D;
            firstVertex = false;
        } else {
            if (temp3D.x() < minVertex.x()) {
                minVertex.setX(temp3D.x());
            }
            if (temp3D.y() < minVertex.y()) {
                minVertex.setY(temp3D.y());
            }
            if (temp3D.z() < minVertex.z()) {
                minVertex.setZ(temp3D.z());
            }
            if (temp3D.x() > maxVertex.x()) {
                maxVertex.setX(temp3D.x());
            }
            if (temp3D.y() > maxVertex.y()) {
                maxVertex.setY(temp3D.y());
            }
            if (temp3D.z() > maxVertex.z()) {
                maxVertex.setZ(temp3D.z());
            }
        }
    }
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
    QList<QVector3D> listVertices;
    QList<QVector2D> listTextures;
    QHash<QPair<int, int>, int> verticesHash;
    QVector3D temp3D, minVertex, maxVertex;
    QVector2D temp2D;
    QStringList lineList, arg;
    QString fileLine, fileName;
    int i, index, indexVertex, indexTexture, squareSize;
    bool firstVertex;

    // Parsing .obj file
    firstVertex = true;
    squareSize = RPM::get()->getSquareSize();
    fileName = m_datas->obj()->getPath(CustomShapeKind::OBJ);
    if (fileName.isEmpty()) {
        return;
    }
    QFile file(m_datas->obj()->getPath(CustomShapeKind::OBJ));
    if (file.open(QIODevice::ReadOnly | QIODevice::Text)) {
        QTextStream fileText(&file);
        while (!fileText.atEnd()) {
            fileLine = fileText.readLine();
            if (fileLine.startsWith(PARSE_VERTEX)) {
                lineList = fileLine.split(" ");
                lineList.removeAll("");
                temp3D.setX(lineList[1].toFloat() + (position.x() * squareSize));
                temp3D.setY(lineList[2].toFloat() + (position.getY(squareSize)));
                temp3D.setZ(lineList[3].toFloat() + (position.z() * squareSize));
                listVertices.append(temp3D);

                // Determine min and max border for creating box collision
                if (firstVertex) {
                    minVertex = temp3D;
                    maxVertex = temp3D;
                    firstVertex = false;
                } else {
                    if (temp3D.x() < minVertex.x()) {
                        minVertex.setX(temp3D.x());
                    }
                    if (temp3D.y() < minVertex.y()) {
                        minVertex.setY(temp3D.y());
                    }
                    if (temp3D.z() < minVertex.z()) {
                        minVertex.setZ(temp3D.z());
                    }
                    if (temp3D.x() > maxVertex.x()) {
                        maxVertex.setX(temp3D.x());
                    }
                    if (temp3D.y() > maxVertex.y()) {
                        maxVertex.setY(temp3D.y());
                    }
                    if (temp3D.z() > maxVertex.z()) {
                        maxVertex.setZ(temp3D.z());
                    }
                }
            }
            else if (fileLine.startsWith(PARSE_TEXTURE)) {
                lineList = fileLine.split(" ");
                lineList.removeAll("");
                temp2D.setX(lineList[1].toFloat());
                temp2D.setY(1.0f - lineList[2].toFloat());
                listTextures.append(temp2D);
            }
            else if (fileLine.startsWith(PARSE_FACE)) {
                lineList = fileLine.split(" ");
                lineList.removeAll("");

                for (i = 1; i <= 3; i++) {
                    arg = lineList[i].split("/");

                    indexVertex = arg[0].toInt() - 1;
                    indexTexture = arg[1].toInt() - 1;
                    index = verticesHash.value(QPair<int, int>(indexVertex,
                        indexTexture), -1);

                    if (index == -1) { // If textures & vertex not already added
                        verticesHash.insert(QPair<int, int>(indexVertex,
                            indexTexture), static_cast<int>(count));
                        vertices.append(Vertex(listVertices.at(indexVertex),
                            listTextures.at(indexTexture)));
                        indexes.append(count);
                        count++;
                    } else { // If already added, only push index
                        indexes.append(static_cast<unsigned int>(index));
                    }
                }
            }
        }
    }
    file.close();

    // Create collision box according to vertex positions
    m_box = QBox3D(minVertex, maxVertex);
}

// -------------------------------------------------------

float Object3DCustomDatas::intersection(QRay3D &ray) const {
    float minDistance = 0;

    RPM::getMinDistance(minDistance, m_box.intersection(ray));

    return minDistance;
}

// -------------------------------------------------------

void Object3DCustomDatas::preLoadSize(Position &position) {
    QVector3D minVertex, maxVertex;
    QString fileLine, fileName;
    int squareSize;
    bool firstVertex;

    // Parsing .obj file
    firstVertex = true;
    squareSize = RPM::get()->getSquareSize();
    fileName = m_datas->obj()->getPath(CustomShapeKind::OBJ);
    if (fileName.isEmpty()) {
        return;
    }
    QFile file(m_datas->obj()->getPath(CustomShapeKind::OBJ));
    if (file.open(QIODevice::ReadOnly | QIODevice::Text)) {
        QTextStream fileText(&file);
        while (!fileText.atEnd()) {
            fileLine = fileText.readLine();
            this->parseVertices(fileLine, position, minVertex, maxVertex,
                firstVertex);
        }
    }
    file.close();

    // Create collision box according to vertex positions
    m_box = QBox3D(minVertex, maxVertex);
}

// -------------------------------------------------------

void Object3DCustomDatas::read(const QJsonObject & json) {
    Object3DDatas::read(json);
}

// -------------------------------------------------------

void Object3DCustomDatas::write(QJsonObject & json) const{
    Object3DDatas::write(json);
}
