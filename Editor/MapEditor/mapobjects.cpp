/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "mapobjects.h"
#include "rpm.h"
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

        if (position.isOutMapPorperties(properties)) {
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
    for (i = m_spritesStaticGL.begin(); i != m_spritesStaticGL.end(); i++) {
        QList<SpriteObject*>* list = i.value();
        for (int j = 0; j < list->size(); j++)
            delete list->at(j);
        delete list;
    }
    QHash<int, QList<SpriteObject*>*>::const_iterator j;
    for (j = m_spritesFaceGL.begin(); j != m_spritesFaceGL.end(); j++) {
        QList<SpriteObject*>* list = j.value();
        for (int i = 0; i < list->size(); i++)
            delete list->at(i);
        delete list;
    }
    QHash<Position, MapElement *>::const_iterator k;
    for (k = m_allElements.begin(); k != m_allElements.end(); k++) {
        delete k.value();
    }

    m_spritesStaticGL.clear();
    m_spritesFaceGL.clear();
    m_allElements.clear();
}

// -------------------------------------------------------

void MapObjects::initializeVertices(int squareSize,
                                    QHash<int, QOpenGLTexture *> &characters,
                                    QOpenGLTexture *tileset)
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
            int x, y, width, height;
            QOpenGLTexture *texture;
            QRect rect;

            if (graphicsId == 0) {
                texture = tileset;
                rect = state->rectTileset();
                width = rect.width();
                height = rect.height();
                x = rect.x();
                y = rect.y();
            } else {
                texture = characters[graphicsId];

                // If texture ID doesn't exist, load empty texture
                if (texture == nullptr){
                    graphicsId = -1;
                    texture = characters[graphicsId];
                }

                int frames = RPM::get()->project()->gameDatas()->systemDatas()
                        ->framesAnimation();
                width = texture->width() / frames / squareSize;
                height = texture->height() / frames / squareSize;
                x = state->indexX() * width;
                y = state->indexY() * height;
            }

            // Create the sprite geometry
            SpriteDatas *sprite = new SpriteDatas(state->graphicsKind(), new
                QRect(x, y, width, height));
            SpriteObject* spriteObject = new SpriteObject(*sprite, texture);
            spriteObject->initializeVertices(squareSize, position);

            // Adding the sprite to the GL list
            QHash<int, QList<SpriteObject*>*>& hash =
                    (state->graphicsKind() ==
                    MapEditorSubSelectionKind::SpritesFace) ? m_spritesFaceGL
                                                            : m_spritesStaticGL;
            if (hash.value(graphicsId) == nullptr)
               hash[graphicsId] = new QList<SpriteObject*>;
            hash[graphicsId]->append(spriteObject);
            m_allElements.insert(position, sprite);
        } else {
            SpriteDatas *spriteEmpty = new SpriteDatas(MapEditorSubSelectionKind
                ::None, new QRect(0, 0,0, 0));
            m_allElements.insert(position, spriteEmpty);
        }

        // Draw the square of the object
        QVector3D pos(position.x() * squareSize, position.getY(squareSize) +
            0.5f, position.z() * squareSize);
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

MapElement * MapObjects::updateRaycasting(int squareSize, float& finalDistance,
    Position &finalPosition, QRay3D &ray)
{
    MapElement *element = nullptr;

    for (QHash<Position, MapElement *>::iterator i = m_allElements.begin();
         i != m_allElements.end(); i++)
    {
        Position position = i.key();
        if (updateRaycastingAt(position, squareSize, finalDistance,
                               finalPosition, ray))
        {
            element = i.value();
        }
    }

    return element;
}

// -------------------------------------------------------

bool MapObjects::updateRaycastingAt(
        Position &position, int squareSize,
        float &finalDistance, Position &finalPosition, QRay3D& ray)
{
    float newDistance = LandDatas::staticIntersection(squareSize, ray, position);
    if (RPM::getMinDistance(finalDistance, newDistance)) {
        finalPosition = position;
        return true;
    }

    return false;
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
    bool isMapHero = RPM::get()->project()->gameDatas()->systemDatas()
        ->idMapHero() == RPM::get()->project()->currentMap()->mapProperties()
        ->id();

    for (int i = 0; i < tab.size(); i++) {
        QJsonObject objHash = tab.at(i).toObject();
        Position p;
        p.read(objHash["k"].toArray());
        SystemCommonObject* o = new SystemCommonObject;
        o->read(objHash["v"].toObject());
        o->setIsHero(isMapHero && o->id() == RPM::get()->project()->gameDatas()
            ->systemDatas()->idObjectHero());
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
