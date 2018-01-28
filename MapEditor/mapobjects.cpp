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

#include "mapobjects.h"
#include "wanok.h"
#include "systemstate.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapObjects::MapObjects() :
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_programStatic(nullptr)
{

}

MapObjects::~MapObjects()
{
    QHash<Position, SystemCommonObject*>::const_iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
        delete i.value();

    clearSprites();
}

bool MapObjects::isEmpty() const{
    return m_all.empty();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemCommonObject* MapObjects::getObjectAt(Position& p) const{
    return m_all.value(p);
}

// -------------------------------------------------------

void MapObjects::setObject(Position& p, SystemCommonObject* object){
    m_all.insert(p, object);
}

// -------------------------------------------------------

SystemCommonObject* MapObjects::removeObject(Position& p){
    SystemCommonObject* o = m_all.value(p);

    if (o != nullptr)
        m_all.remove(p);

    return o;
}

// -------------------------------------------------------

bool MapObjects::addObject(Position& p, SystemCommonObject* object,
                           QJsonObject &previousObj,
                           MapEditorSubSelectionKind &previousType)
{
    SystemCommonObject* previousObject = removeObject(p);

    if (previousObject != nullptr) {
        previousObject->write(previousObj);
        previousType = MapEditorSubSelectionKind::Object;
        delete previousObject;
    }

    setObject(p, object);

    return true;
}

// -------------------------------------------------------

bool MapObjects::deleteObject(Position& p, QJsonObject &previousObj,
                              MapEditorSubSelectionKind &previousType)
{
    SystemCommonObject* previousObject = removeObject(p);

    if (previousObject != nullptr) {
        previousObject->write(previousObj);
        previousType = MapEditorSubSelectionKind::Object;
        delete previousObject;
    }

    return true;
}

// -------------------------------------------------------

void MapObjects::removeObjectsOut(QList<int> &listDeletedObjectsIDs,
                                  MapProperties& properties)
{
    QList<Position> list;
    QHash<Position, SystemCommonObject*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        Position position = i.key();

        if (position.x() >= properties.length() ||
            position.z() >= properties.width())
        {
            list.push_back(position);
            listDeletedObjectsIDs.push_back(i.value()->id());
            delete *i;
        }
    }

    for (int j = 0; j < list.size(); j++)
        m_all.remove(list.at(j));
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void MapObjects::clearSprites(){
    QHash<int, QList<SpriteObject*>*>::const_iterator i;
    for (i = m_spritesStaticGL.begin(); i != m_spritesStaticGL.end(); i++){
        QList<SpriteObject*>* list = i.value();
        for (int j = 0; j < list->size(); j++)
            delete list->at(j);
        delete list;
    }
    QHash<int, QList<SpriteObject*>*>::const_iterator j;
    for (j = m_spritesFaceGL.begin(); j != m_spritesFaceGL.end(); j++){
        QList<SpriteObject*>* list = j.value();
        for (int i = 0; i < list->size(); i++)
            delete list->at(i);
        delete list;
    }

    m_spritesStaticGL.clear();
    m_spritesFaceGL.clear();
}

// -------------------------------------------------------

void MapObjects::initializeVertices(int squareSize,
                                    QHash<int, QOpenGLTexture *> &characters)
{
    clearSprites();
    m_vertices.clear();
    m_indexes.clear();

    // Objects and their squares
    int count = 0;
    QHash<Position, SystemCommonObject*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++){
        Position position = i.key();
        SystemCommonObject* o = i.value();
        SystemState* state = o->getFirstState();

        // Draw the first state graphics of the object
        if (state != nullptr) {
            int graphicsId = state->graphicsId();
            QOpenGLTexture* texture = characters[graphicsId];

            // If texture ID doesn't exist, load empty texture
            if (texture == nullptr){
                graphicsId = -1;
                texture = characters[graphicsId];
            }

            // Create the sprite geometry
            int frames = Wanok::get()->project()->gameDatas()->systemDatas()
                    ->framesAnimation();
            int width = texture->width() / frames / squareSize;
            int height = texture->height() / frames / squareSize;
            SpriteDatas sprite(
                        state->graphicsKind(),
                        new QRect(state->indexX() * width,
                                  state->indexY() * height,
                                  width, height));
            SpriteObject* spriteObject = new SpriteObject(sprite, texture);
            spriteObject->initializeVertices(squareSize, position);

            // Adding the sprite to the GL list
            QHash<int, QList<SpriteObject*>*>& hash =
                    (state->graphicsKind() ==
                    MapEditorSubSelectionKind::SpritesFace) ? m_spritesFaceGL
                                                            : m_spritesStaticGL;
            if (hash.value(graphicsId) == nullptr)
               hash[graphicsId] = new QList<SpriteObject*>;
            hash[graphicsId]->append(spriteObject);
        }

        // Draw the square of the object
        QVector3D pos(position.x() * squareSize, 0.5f,
                      position.z() * squareSize);
        QVector3D size(squareSize, 0.0, squareSize);
        float x = 0.0, y = 0.0, w = 1.0, h = 1.0;
        m_vertices.append(Vertex(Lands::verticesQuad[0] * size + pos,
                          QVector2D(x, y)));
        m_vertices.append(Vertex(Lands::verticesQuad[1] * size + pos,
                          QVector2D(x + w, y)));
        m_vertices.append(Vertex(Lands::verticesQuad[2] * size + pos,
                          QVector2D(x + w, y + h)));
        m_vertices.append(Vertex(Lands::verticesQuad[3] * size + pos,
                          QVector2D(x, y + h)));
        int offset = count * Lands::nbVerticesQuad;
        for (int i = 0; i < Lands::nbIndexesQuad; i++)
            m_indexes.append(Lands::indexesQuad[i] + offset);

        count++;
    }
}

// -------------------------------------------------------

void MapObjects::initializeGL(QOpenGLShaderProgram *programStatic,
                              QOpenGLShaderProgram *programFace)
{
    QHash<int, QList<SpriteObject*>*>::const_iterator i;
    for (i = m_spritesStaticGL.begin(); i != m_spritesStaticGL.end(); i++){
        QList<SpriteObject*>* list = i.value();
        for (int j = 0; j < list->size(); j++)
            list->at(j)->initializeStaticGL(programStatic);
    }
    QHash<int, QList<SpriteObject*>*>::const_iterator j;
    for (j = m_spritesFaceGL.begin(); j != m_spritesFaceGL.end(); j++){
        QList<SpriteObject*>* list = j.value();
        for (int i = 0; i < list->size(); i++)
            list->at(i)->initializeFaceGL(programFace);
    }

    if (m_programStatic == nullptr){
        initializeOpenGLFunctions();

        // Programs
        m_programStatic = programStatic;
    }
}

// -------------------------------------------------------

void MapObjects::updateGL(){

    // Objects
    QHash<int, QList<SpriteObject*>*>::const_iterator i;
    for (i = m_spritesStaticGL.begin(); i != m_spritesStaticGL.end(); i++){
        QList<SpriteObject*>* list = i.value();
        for (int j = 0; j < list->size(); j++)
            list->at(j)->updateStaticGL();
    }
    QHash<int, QList<SpriteObject*>*>::const_iterator j;
    for (j = m_spritesFaceGL.begin(); j != m_spritesFaceGL.end(); j++){
        QList<SpriteObject*>* list = j.value();
        for (int i = 0; i < list->size(); i++)
            list->at(i)->updateFaceGL();
    }

    // Squares of objects
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
                        m_vao, m_programStatic);
}

// -------------------------------------------------------

void MapObjects::paintStaticSprites(int textureID, QOpenGLTexture *texture){
    QList<SpriteObject*>* list = m_spritesStaticGL.value(textureID);

    if (list != nullptr){
        texture->bind();
        for (int i = 0; i < list->size(); i++)
            list->at(i)->paintGL();
        texture->release();
    }
}

// -------------------------------------------------------

void MapObjects::paintFaceSprites(int textureID, QOpenGLTexture* texture){
    QList<SpriteObject*>* list = m_spritesFaceGL.value(textureID);

    if (list != nullptr){
        texture->bind();
        for (int i = 0; i < list->size(); i++)
            list->at(i)->paintGL();
        texture->release();
    }
}

// -------------------------------------------------------

void MapObjects::paintSquares(){
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, 0);
    m_vao.release();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void MapObjects::read(const QJsonObject & json){
    QJsonArray tab = json["list"].toArray();

    for (int i = 0; i < tab.size(); i++){
        QJsonObject objHash = tab.at(i).toObject();
        Position p;
        p.read(objHash["k"].toArray());
        SystemCommonObject* o = new SystemCommonObject;
        o->read(objHash["v"].toObject());
        m_all.insert(p, o);
    }
}

// -------------------------------------------------------

void MapObjects::write(QJsonObject & json) const{
    QJsonArray tab;

    QHash<Position, SystemCommonObject*>::const_iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++){
        QJsonObject objHash;
        QJsonArray tabKeyPosition;
        QJsonObject objValueObject;
        i.key().write(tabKeyPosition);
        i.value()->write(objValueObject);
        objHash["k"] = tabKeyPosition;
        objHash["v"] = objValueObject;
        tab.append(objHash);
    }
    json["list"] = tab;
}
