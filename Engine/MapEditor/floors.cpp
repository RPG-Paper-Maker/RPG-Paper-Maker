/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "floors.h"

// -------------------------------------------------------
//
//
//  ---------- FLOOR
//
//
// -------------------------------------------------------

QVector3D Floor::verticesQuad[4]{
                                  QVector3D(0.0f, 0.0f, 0.0f),
                                  QVector3D(1.0f, 0.0f, 0.0f),
                                  QVector3D(1.0f, 0.0f, 1.0f),
                                  QVector3D(0.0f, 0.0f, 1.0f)
                                };

GLuint Floor::indexesQuad[6]{0, 1, 2, 0, 2, 3};

int Floor::nbVerticesQuad(4);

int Floor::nbIndexesQuad(6);

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Floor::Floor()
{

}

Floor::~Floor()
{

}

// -------------------------------------------------------
//
//
//  ---------- FLOORDATAS
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

FloorDatas::FloorDatas() :
    FloorDatas(0)
{

}

FloorDatas::FloorDatas(int layer) :
    m_layer(layer)
{

}

FloorDatas::~FloorDatas()
{

}

int FloorDatas::layer() const { return m_layer; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------


// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void FloorDatas::read(const QJsonObject & json){
    m_layer = json["l"].toInt();
}

// -------------------------------------------------------

void FloorDatas::write(QJsonObject &json) const{
    json["l"] = m_layer;
}

// -------------------------------------------------------
//
//
//  ---------- FLOORS
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Floors::Floors() :
    m_vertexBufferStatic(QOpenGLBuffer::VertexBuffer),
    m_indexBufferStatic(QOpenGLBuffer::IndexBuffer),
    m_programStatic(nullptr)
{

}

Floors::~Floors()
{
    QHash<Position3D, QVector<FloorDatas*>*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++){
        QVector<FloorDatas*>* list = *i;
        for (int j = 0; j < list->size(); j++)
            delete list->at(j);
        delete list;
    }

    QHash<Height, QRect*>::iterator j;
    for (j = m_squares.begin(); j != m_squares.end(); j++){
        QRect* r = j.value();
        if (r != nullptr) delete r;
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool Floors::isEmpty() const{
    return m_all.size() == 0;
}

// -------------------------------------------------------

void Floors::setFloor(Position& p, FloorDatas *floor){
    QVector<FloorDatas*>* list = m_all.value(p);
    if (list != nullptr){
        for (int i = 0; i < list->size(); i++){
            FloorDatas* floor = list->at(i);
            if (p.layer() < floor->layer()){
                list->insert(i, floor);
                return;
            }
        }
        list->append(floor);
    }
    else{
        QVector<FloorDatas*>* l = new QVector<FloorDatas*>;
        l->append(floor);
        m_all[p] = l;
    }
}

// -------------------------------------------------------

FloorDatas *Floors::removeFloor(Position& p){
    QVector<FloorDatas*>* list = m_all.value(p);
    if (list != nullptr){
        for (int i = 0; i < list->size(); i++){
            FloorDatas* floor = list->at(i);
            if (p.layer() == floor->layer()){
                list->removeAt(i);
                if (list->size() == 0){
                    delete list;
                    m_all.remove(p);
                }
                return floor;
            }
        }
    }

    return nullptr;
}

// -------------------------------------------------------

bool Floors::addFloor(Position& p){
    FloorDatas* floor = new FloorDatas(p.layer());
    FloorDatas* previousFloor = removeFloor(p);

    if (previousFloor != nullptr)
        delete previousFloor;

    setFloor(p, floor);

    updateFloorSquareAdding(p);

    return true;
}

// -------------------------------------------------------

void Floors::updateFloorSquareAdding(Position& p){
    Height h(p.y(), p.yPlus());
    QRect* rect = m_squares[h];
    if (rect == nullptr){
        rect = new QRect(p.x(), p.z(), 1, 1);
        m_squares[h] = rect;
    }

    if (p.x() < rect->left()){
        rect->setLeft(p.x());
        rect->setWidth(rect->width() + rect->left() - p.x());
    }
    if (p.x() > rect->left() + rect->width() - 1){
        rect->setWidth(p.x() - rect->left() + 1);
    }
    if (p.z() < rect->top()){
        rect->setTop(p.z());
        rect->setHeight(rect->height() + rect->top() - p.z());
    }
    if (p.z() > rect->top() + rect->height() - 1){
        rect->setHeight(p.z() - rect->top() + 1);
    }
}

// -------------------------------------------------------

bool Floors::deleteFloor(Position& p){
    FloorDatas* previousFloor = removeFloor(p);

    if (previousFloor != nullptr)
        delete previousFloor;

    updateFloorSquareDeleting(p);

    return true;
}

// -------------------------------------------------------

void Floors::updateFloorSquareDeleting(Position& p){
    Height height(p.y(), p.yPlus());
    QRect* rect = m_squares.value(height);
    if (rect != nullptr){

        // If only one square, delete
        if (p.x() == rect->left() && p.z() == rect->top() &&
                rect->width() == 1 && rect->height() == 1){
            delete rect;
            m_squares.remove(height);
            return;
        }

        // Top border
        if (p.z() == rect->top()){
            int y = 0;
            for (int j = 0; j < rect->height() - 1; j++){
                if (updateFloorSquareDeletingCheck(false, j, y, rect, height,
                                                   rect->width()))
                    break;
            }
            rect->setTop(rect->top() + y);
        }

        // Bot border
        if (p.z() == rect->top() + rect->height() - 1){
            int h = 0;
            for (int j = rect->height() - 1; j > 0; j--){
                if (updateFloorSquareDeletingCheck(false, j, h, rect, height,
                                                   rect->width()))
                    break;
            }
            rect->setHeight(rect->height() - h);
        }

        // Left border
        if (p.x() == rect->left()){
            int x = 0;
            for (int i = 0; i < rect->width() - 1; i++){
                if (updateFloorSquareDeletingCheck(true, i, x, rect, height,
                                                   rect->height()))
                    break;
            }
            rect->setLeft(rect->left() + x);
        }

        // Right border
        if (p.x() == rect->left() + rect->width() - 1){
            int w = 0;
            for (int i = rect->width() - 1; i > 0; i--){
                if (updateFloorSquareDeletingCheck(true, i, w, rect, height,
                                                   rect->height()))
                    break;
            }
            rect->setWidth(rect->width() - w);
        }
    }
}

// -------------------------------------------------------

bool Floors::updateFloorSquareDeletingCheck(bool isVertical, int i, int& v,
                                            QRect* rect, Height& height,
                                            int size)
{
    bool test = false;
    for (int j = 0; j < size; j++){
        int x, y;
        if (isVertical){
            x = i;
            y = j;
        }
        else{
            x = j;
            y = i;
        }
        Position3D p3d(x + rect->left(), height.y(), height.yPlus(),
                       y + rect->top());
        QVector<FloorDatas*>* list = m_all.value(p3d);
        if (list != nullptr){
            test = true;
            break;
        }
    }
    if (test)
        return true;
    else
        v++;

    return false;
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Floors::initializeVertices(int squareSize){
    m_verticesStatic.clear();
    m_indexesStatic.clear();

    float w = 16.0f / 128.0f;

    int count = 0;
    QHash<Height, QRect*>::iterator i;
    for (i = m_squares.begin(); i != m_squares.end(); i++){
        int h = i.key().getY(squareSize);
        QRect* rect = i.value();
        QVector3D pos((float) rect->left() * squareSize, (float) h,
                      (float) rect->top() * squareSize);
        QVector3D size((float) rect->width() * squareSize, 0.0,
                       (float) rect->height() * squareSize);

        // Vertices
        m_verticesStatic.append(Vertex(Floor::verticesQuad[0] * size + pos,
                                QVector2D(0.0f, 0.0f)));
        m_verticesStatic.append(Vertex(Floor::verticesQuad[1] * size + pos,
                                QVector2D(w, 0.0f)));
        m_verticesStatic.append(Vertex(Floor::verticesQuad[2] * size + pos,
                                QVector2D(w, w)));
        m_verticesStatic.append(Vertex(Floor::verticesQuad[3] * size + pos,
                                QVector2D(0.0f, w)));

        // indexes
        int offset = count * Floor::nbVerticesQuad;
        for (int i = 0; i < Floor::nbIndexesQuad; i++)
            m_indexesStatic.append(Floor::indexesQuad[i] + offset);

        count++;
    }
}

// -------------------------------------------------------

void Floors::initializeGL(QOpenGLShaderProgram *programStatic){
    if (m_programStatic == nullptr){
        initializeOpenGLFunctions();

        // Programs
        m_programStatic = programStatic;
    }
}

// -------------------------------------------------------

void Floors::updateGL(){

    // If existing VAO or VBO, destroy it
    if (m_vaoStatic.isCreated())
        m_vaoStatic.destroy();
    if (m_vertexBufferStatic.isCreated())
        m_vertexBufferStatic.destroy();
    if (m_indexBufferStatic.isCreated())
        m_indexBufferStatic.destroy();

    // Create new VBO for vertex
    m_vertexBufferStatic.create();
    m_vertexBufferStatic.bind();
    m_vertexBufferStatic.setUsagePattern(QOpenGLBuffer::StaticDraw);
    m_vertexBufferStatic.allocate(m_verticesStatic.constData(),
                                  m_verticesStatic.size() * sizeof(Vertex));

    // Create new VBO for indexes
    m_indexBufferStatic.create();
    m_indexBufferStatic.bind();
    m_indexBufferStatic.setUsagePattern(QOpenGLBuffer::StaticDraw);
    m_indexBufferStatic.allocate(m_indexesStatic.constData(),
                                 m_indexesStatic.size() * sizeof(GLuint));

    // Create new VAO
    m_vaoStatic.create();
    m_vaoStatic.bind();
    m_programStatic->enableAttributeArray(0);
    m_programStatic->enableAttributeArray(1);
    m_programStatic->setAttributeBuffer(0, GL_FLOAT, Vertex::positionOffset(),
                                        Vertex::positionTupleSize,
                                        Vertex::stride());
    m_programStatic->setAttributeBuffer(1, GL_FLOAT, Vertex::texOffset(),
                                        Vertex::texCoupleSize,
                                        Vertex::stride());
    m_indexBufferStatic.bind();

    // Releases
    m_vaoStatic.release();
    m_indexBufferStatic.release();
    m_vertexBufferStatic.release();
}

// -------------------------------------------------------

void Floors::paintGL(){
    m_vaoStatic.bind();
    glDrawElements(GL_TRIANGLES, m_indexesStatic.size(), GL_UNSIGNED_INT, 0);
    m_vaoStatic.bind();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Floors::read(const QJsonObject & json){
    QJsonArray tab = json["all"].toArray();

    // All
    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        Position3D p;
        p.read(obj["k"].toArray());
        QJsonArray tabVal = obj["v"].toArray();
        QVector<FloorDatas*>* l = new QVector<FloorDatas*>;
        for (int j = 0; j < tabVal.size(); j++){
            FloorDatas* floor = new FloorDatas;
            floor->read(tabVal.at(j).toObject());
            l->append(floor);
        }
        m_all[p] = l;
    }

    // Squares
    tab = json["squares"].toArray();
    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        Height h;
        h.read(obj["k"].toArray());
        QJsonArray tabVal = obj["v"].toArray();
        QRect* r = new QRect;
        r->setLeft(tabVal[0].toInt());
        r->setTop(tabVal[1].toInt());
        r->setWidth(tabVal[2].toInt());
        r->setHeight(tabVal[3].toInt());
        m_squares[h] = r;
    }
}

// -------------------------------------------------------

void Floors::write(QJsonObject & json) const{
    QJsonArray tab;

    // All
    QHash<Position3D, QVector<FloorDatas*>*>::const_iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++){
        QJsonObject objHash;
        QJsonArray tabKey;
        QJsonArray tabValue;
        i.key().write(tabKey);
        QVector<FloorDatas*>* list = i.value();
        for (int j = 0; j < list->size(); j++){
            QJsonObject objFloor;
            list->at(j)->write(objFloor);
            tabValue.append(objFloor);
        }

        objHash["k"] = tabKey;
        objHash["v"] = tabValue;
        tab.append(objHash);
    }
    json["all"] = tab;

    // Squares
    tab = QJsonArray();
    QHash<Height, QRect*>::const_iterator j;
    for (j = m_squares.begin(); j != m_squares.end(); j++){
        QJsonObject objHash;
        QJsonArray tabKey;
        QJsonArray tabValue;
        j.key().write(tabKey);
        QRect* rect = j.value();
        tabValue.append(rect->left());
        tabValue.append(rect->top());
        tabValue.append(rect->width());
        tabValue.append(rect->height());

        objHash["k"] = tabKey;
        objHash["v"] = tabValue;
        tab.append(objHash);
    }
    json["squares"] = tab;
}
