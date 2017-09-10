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
#include "map.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Sprites::Sprites() :
    m_vertexBufferStatic(QOpenGLBuffer::VertexBuffer),
    m_indexBufferStatic(QOpenGLBuffer::IndexBuffer),
    m_programStatic(nullptr),
    m_vertexBufferFace(QOpenGLBuffer::VertexBuffer),
    m_indexBufferFace(QOpenGLBuffer::IndexBuffer),
    m_programFace(nullptr)
{

}

Sprites::~Sprites()
{
    QHash<Position, SpriteDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
        delete *i;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool Sprites::isEmpty() const{
    return m_all.size() == 0;
}

// -------------------------------------------------------

void Sprites::setSprite(Position& p, SpriteDatas* sprite){
    m_all[p] = sprite;
}

// -------------------------------------------------------

SpriteDatas* Sprites::removeSprite(Position& p){
    SpriteDatas* sprite = m_all.value(p);
    if (sprite != nullptr){
        m_all.remove(p);
        return sprite;
    }

    return nullptr;
}

// -------------------------------------------------------

bool Sprites::addSprite(Position& p, MapEditorSubSelectionKind kind,
                        int widthPosition, int angle, QRect *textureRect)
{
    SpriteDatas* previousSprite = removeSprite(p);
    SpriteDatas* sprite = new SpriteDatas(kind, widthPosition, angle,
                                          textureRect);

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

void Sprites::removeSpritesOut(MapProperties& properties) {
    QList<Position> list;
    QHash<Position, SpriteDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        Position position = i.key();

        if (position.x() >= properties.length() ||
            position.z() >= properties.width())
        {
            delete i.value();
            list.push_back(position);
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

void Sprites::initializeVertices(QHash<Position, MapElement *> &previewSquares,
                                 QHash<GridPosition, MapElement *> &previewGrid,
                                 int squareSize, int width, int height,
                                 int& spritesOffset)
{
    int countStatic = 0;
    int countFace = 0;

    // Clear
    m_verticesStatic.clear();
    m_indexesStatic.clear();
    m_verticesFace.clear();
    m_indexesFace.clear();

    // Create temp hash for preview
    QHash<Position, SpriteDatas*> spritesWithPreview(m_all);
    QHash<Position, MapElement*>::iterator it;
    for (it = previewSquares.begin(); it != previewSquares.end(); it++) {
        MapElement* element = it.value();
        if (element->getKind() == MapEditorSelectionKind::Sprites)
            spritesWithPreview[it.key()] = (SpriteDatas*) element;
    }
    QHash<GridPosition, SpriteWallDatas*> spritesWallWithPreview(m_walls);
    QHash<GridPosition, MapElement*>::iterator itw;
    for (itw = previewGrid.begin(); itw != previewGrid.end(); itw++) {
        MapElement* element = itw.value();
        if (element->getSubKind() == MapEditorSubSelectionKind::SpritesWall)
            spritesWallWithPreview[itw.key()] = (SpriteWallDatas*) element;
    }

    // Initialize vertices in squares
    QHash<Position, SpriteDatas*>::iterator i;
    for (i = spritesWithPreview.begin(); i != spritesWithPreview.end(); i++) {
        Position position = i.key();
        SpriteDatas* sprite = i.value();

        sprite->initializeVertices(squareSize, width, height,
                                   m_verticesStatic, m_indexesStatic,
                                   m_verticesFace, m_indexesFace,
                                   position, countStatic, countFace,
                                   spritesOffset);
    }

    // Initialize vertices for walls
    QHash<GridPosition, SpriteWallDatas*>::iterator j;
    for (j = spritesWallWithPreview.begin();
         j != spritesWallWithPreview.end(); j++)
    {
        GridPosition position = j.key();
        SpriteWallDatas* sprite = j.value();
        sprite->initializeVertices(squareSize, width, height,
                                   m_verticesStatic, m_indexesStatic,
                                   position, countStatic);
    }
}

// -------------------------------------------------------

void Sprites::initializeGL(QOpenGLShaderProgram* programStatic,
                           QOpenGLShaderProgram *programFace){
    if (m_programStatic == nullptr){
        initializeOpenGLFunctions();

        // Programs
        m_programStatic = programStatic;
        m_programFace = programFace;
    }
}

// -------------------------------------------------------

void Sprites::updateGL(){
    Map::updateGLStatic(m_vertexBufferStatic, m_indexBufferStatic,
                        m_verticesStatic, m_indexesStatic, m_vaoStatic,
                        m_programStatic);
    Map::updateGLFace(m_vertexBufferFace, m_indexBufferFace,
                      m_verticesFace, m_indexesFace, m_vaoFace,
                      m_programFace);
}

// -------------------------------------------------------

void Sprites::paintGL(){
    m_vaoStatic.bind();
    glDrawElements(GL_TRIANGLES, m_indexesStatic.size(), GL_UNSIGNED_INT, 0);
    m_vaoStatic.release();
}

// -------------------------------------------------------

void Sprites::paintFaceGL(){
    m_vaoFace.bind();
    glDrawElements(GL_TRIANGLES, m_indexesFace.size(), GL_UNSIGNED_INT, 0);
    m_vaoFace.release();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Sprites::read(const QJsonObject & json){
    QJsonArray tab = json["list"].toArray();

    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        Position p;
        p.read(obj["k"].toArray());
        QJsonObject objVal = obj["v"].toObject();
        SpriteDatas* sprite = new SpriteDatas;
        sprite->read(objVal);
        m_all[p] = sprite;
    }
}

// -------------------------------------------------------

void Sprites::write(QJsonObject & json) const{
    QJsonArray tab;

    QHash<Position, SpriteDatas*>::const_iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++){
        QJsonObject objHash;
        QJsonArray tabKey;
        i.key().write(tabKey);
        QJsonObject objSprite;
        i.value()->write(objSprite);

        objHash["k"] = tabKey;
        objHash["v"] = objSprite;
        tab.append(objHash);
    }
    json["list"] = tab;
}
