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

#include "sprites.h"

// -------------------------------------------------------
//
//
//  ---------- SPRITE
//
//
// -------------------------------------------------------

QVector3D Sprite::verticesQuad[4]{
                                  QVector3D(0.0f, 1.0f, 0.0f),
                                  QVector3D(1.0f, 1.0f, 0.0f),
                                  QVector3D(1.0f, 0.0f, 0.0f),
                                  QVector3D(0.0f, 0.0f, 0.0f)
                                };

GLuint Sprite::indexesQuad[6]{0, 1, 2, 0, 2, 3};

int Sprite::nbVerticesQuad(4);

int Sprite::nbIndexesQuad(6);

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Sprite::Sprite()
{

}

Sprite::~Sprite()
{

}

// -------------------------------------------------------
//
//
//  ---------- SPRITEDATAS
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SpriteDatas::SpriteDatas() :
    SpriteDatas(0, 50, 0, new QRect(0, 0, 2, 2))
{

}

SpriteDatas::SpriteDatas(int layer, int widthPosition, int angle,
                         QRect *textureRect) :
    m_layer(layer),
    m_widthPosition(widthPosition),
    m_angle(angle),
    m_textureRect(textureRect)
{

}

SpriteDatas::~SpriteDatas()
{
    delete m_textureRect;
}

int SpriteDatas::layer() const { return m_layer; }

int SpriteDatas::widthPosition() const { return m_widthPosition; }

int SpriteDatas::angle() const { return m_angle; }

QRect* SpriteDatas::textureRect() const { return m_textureRect; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SpriteDatas::initializeVertices(int squareSize,
                                     int width, int height,
                                     QVector<Vertex>& vertices,
                                     QVector<GLuint>& indexes,
                                     Position3D& position, int& count)
{
    float x, y, w, h;
    x = (float)(m_textureRect->x() * squareSize) / width;
    y = (float)(m_textureRect->y() * squareSize) / height;
    w = (float)(m_textureRect->width() * squareSize) / width;
    h = (float)(m_textureRect->height() * squareSize) / height;

    QVector3D pos((float) position.x() * squareSize -
                  ((textureRect()->width() - 1) * squareSize / 2),
                  (float) position.getY(squareSize),
                  (float) position.z() * squareSize +
                  (widthPosition() * squareSize / 100)
                  );
    QVector3D size((float) textureRect()->width() * squareSize,
                   (float) textureRect()->height() * squareSize,
                   0.0f
                   );

    // Vertices
    vertices.append(Vertex(Sprite::verticesQuad[0] * size + pos,
                    QVector2D(x, y)));
    vertices.append(Vertex(Sprite::verticesQuad[1] * size + pos,
                    QVector2D(x + w, y)));
    vertices.append(Vertex(Sprite::verticesQuad[2] * size + pos,
                    QVector2D(x + w, y + h)));
    vertices.append(Vertex(Sprite::verticesQuad[3] * size + pos,
                    QVector2D(x, y + h)));

    // indexes
    int offset = count * Sprite::nbVerticesQuad;
    for (int i = 0; i < Sprite::nbIndexesQuad; i++)
        indexes.append(Sprite::indexesQuad[i] + offset);
    count++;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SpriteDatas::read(const QJsonObject & json){
    m_layer = json["l"].toInt();
    m_widthPosition = json["p"].toInt();
    m_angle = json["a"].toInt();

    QJsonArray tab = json["t"].toArray();
    m_textureRect->setLeft(tab[0].toInt());
    m_textureRect->setTop(tab[1].toInt());
    m_textureRect->setWidth(tab[2].toInt());
    m_textureRect->setHeight(tab[3].toInt());
}

// -------------------------------------------------------

void SpriteDatas::write(QJsonObject & json) const{
    QJsonArray tab;

    json["l"] = m_layer;
    json["p"] = m_widthPosition;
    json["a"] = m_angle;

    // Texture
    tab.append(m_textureRect->left());
    tab.append(m_textureRect->top());
    tab.append(m_textureRect->width());
    tab.append(m_textureRect->height());
    json["t"] = tab;
}

// -------------------------------------------------------
//
//
//  ---------- SPRITEOBJECT
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SpriteObject::SpriteObject(SpriteDatas &datas, QOpenGLTexture* texture) :
    m_datas(datas),
    m_texture(texture),
    m_vertexBufferStatic(QOpenGLBuffer::VertexBuffer),
    m_indexBufferStatic(QOpenGLBuffer::IndexBuffer),
    m_programStatic(nullptr)
{

}

SpriteObject::~SpriteObject()
{

}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void SpriteObject::initializeVertices(int squareSize, Position3D& position)
{
    m_verticesStatic.clear();
    m_indexesStatic.clear();
    int count = 0;
    m_datas.initializeVertices(squareSize,
                               m_texture->width(),
                               m_texture->height(),
                               m_verticesStatic, m_indexesStatic,
                               position, count);
}

// -------------------------------------------------------

void SpriteObject::initializeGL(QOpenGLShaderProgram* programStatic){
    if (m_programStatic == nullptr){
        initializeOpenGLFunctions();

        // Programs
        m_programStatic = programStatic;
    }
}

// -------------------------------------------------------

void SpriteObject::updateGL(){

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

void SpriteObject::paintGL(){
    m_texture->bind();
    m_vaoStatic.bind();
    glDrawElements(GL_TRIANGLES, m_indexesStatic.size(), GL_UNSIGNED_INT, 0);
    m_vaoStatic.bind();
}

// -------------------------------------------------------
//
//
//  ---------- SPRITES
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Sprites::Sprites() :
    m_vertexBufferStatic(QOpenGLBuffer::VertexBuffer),
    m_indexBufferStatic(QOpenGLBuffer::IndexBuffer),
    m_programStatic(nullptr)
{

}

Sprites::~Sprites()
{
    QHash<Position3D, QVector<SpriteDatas*>*>::iterator i;
    for (i = m_allStatic.begin(); i != m_allStatic.end(); i++){
        QVector<SpriteDatas*>* list = *i;
        for (int j = 0; j < list->size(); j++)
            delete list->at(j);
        delete list;
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool Sprites::isEmpty() const{
    return m_allStatic.size() == 0;
}

// -------------------------------------------------------

void Sprites::setSprite(Position& p, SpriteDatas* sprite){
    QVector<SpriteDatas*>* list = m_allStatic.value(p);
    if (list != nullptr){
        for (int i = 0; i < list->size(); i++){
            SpriteDatas* sprite = list->at(i);
            if (p.layer() < sprite->layer()){
                list->insert(i, sprite);
                return;
            }
        }
        list->append(sprite);
    }
    else{
        QVector<SpriteDatas*>* l = new QVector<SpriteDatas*>;
        l->append(sprite);
        m_allStatic[p] = l;
    }
}

// -------------------------------------------------------

SpriteDatas* Sprites::removeSprite(Position& p){
    QVector<SpriteDatas*>* list = m_allStatic.value(p);
    if (list != nullptr){
        for (int i = 0; i < list->size(); i++){
            SpriteDatas* sprite = list->at(i);
            if (p.layer() == sprite->layer()){
                list->removeAt(i);
                if (list->size() == 0){
                    delete list;
                    m_allStatic.remove(p);
                }
                return sprite;
            }
        }
    }

    return nullptr;
}

// -------------------------------------------------------

bool Sprites::addSprite(Position& p, SpriteDatas *sprite){
    SpriteDatas* previousSprite = removeSprite(p);

    if (previousSprite != nullptr)
        delete previousSprite;

    setSprite(p, sprite);

    return true;
}

// -------------------------------------------------------

bool Sprites::deleteSprite(Position& p){
    SpriteDatas* previousSprite = removeSprite(p);

    if (previousSprite != nullptr)
        delete previousSprite;

    return true;
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Sprites::initializeVertices(int squareSize, int width, int height){
    m_verticesStatic.clear();
    m_indexesStatic.clear();

    int count = 0;
    QHash<Position3D, QVector<SpriteDatas*>*>::iterator i;
    for (i = m_allStatic.begin(); i != m_allStatic.end(); i++){
        Position3D position = i.key();
        QVector<SpriteDatas*>* list = i.value();
        for (int j = 0; j < list->size(); j++){
            SpriteDatas* sprite = list->at(j);
            sprite->initializeVertices(squareSize, width, height,
                                       m_verticesStatic, m_indexesStatic,
                                       position, count);
        }
    }
}

// -------------------------------------------------------

void Sprites::initializeGL(QOpenGLShaderProgram* programStatic){
    if (m_programStatic == nullptr){
        initializeOpenGLFunctions();

        // Programs
        m_programStatic = programStatic;
    }
}

// -------------------------------------------------------

void Sprites::updateGL(){

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

void Sprites::paintGL(){
    m_vaoStatic.bind();
    glDrawElements(GL_TRIANGLES, m_indexesStatic.size(), GL_UNSIGNED_INT, 0);
    m_vaoStatic.bind();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Sprites::read(const QJsonObject & json){
    QJsonArray tab = json["statics"].toArray();

    // All statics
    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        Position3D p;
        p.read(obj["k"].toArray());
        QJsonArray tabVal = obj["v"].toArray();
        QVector<SpriteDatas*>* l = new QVector<SpriteDatas*>;
        for (int j = 0; j < tabVal.size(); j++){
            SpriteDatas* sprite = new SpriteDatas;
            sprite->read(tabVal.at(j).toObject());
            l->append(sprite);
        }
        m_allStatic[p] = l;
    }
}

// -------------------------------------------------------

void Sprites::write(QJsonObject & json) const{
    QJsonArray tab;

    // All statics
    QHash<Position3D, QVector<SpriteDatas*>*>::const_iterator i;
    for (i = m_allStatic.begin(); i != m_allStatic.end(); i++){
        QJsonObject objHash;
        QJsonArray tabKey;
        QJsonArray tabValue;
        i.key().write(tabKey);
        QVector<SpriteDatas*>* list = i.value();
        for (int j = 0; j < list->size(); j++){
            QJsonObject objSprite;
            list->at(j)->write(objSprite);
            tabValue.append(objSprite);
        }

        objHash["k"] = tabKey;
        objHash["v"] = tabValue;
        tab.append(objHash);
    }
    json["statics"] = tab;
}
