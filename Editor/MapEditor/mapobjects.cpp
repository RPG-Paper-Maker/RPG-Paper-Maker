/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "mapobjects.h"
#include "rpm.h"
#include "common.h"
#include "systemstate.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapObjects::MapObjects() :
    m_isEmpty(true),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_programStatic(nullptr)
{

}

MapObjects::~MapObjects()
{
    QHash<Position, SystemCommonObject*>::const_iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
    {
        delete i.value();
    }
    this->clear();
}

bool MapObjects::isEmpty() const
{
    return m_isEmpty;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void MapObjects::updateEmpty()
{
    m_isEmpty = m_all.empty();
}

// -------------------------------------------------------

SystemCommonObject * MapObjects::getObjectAt(Position &p) const
{
    return m_all.value(p);
}

// -------------------------------------------------------

void MapObjects::setObject(Position &p, SystemCommonObject *object)
{
    m_all.insert(p, object);
}

// -------------------------------------------------------

SystemCommonObject * MapObjects::removeObject(Position &p)
{
    SystemCommonObject *o = m_all.value(p);
    if (o != nullptr)
    {
        m_all.remove(p);
    }
    return o;
}

// -------------------------------------------------------

bool MapObjects::addObject(Position &p, SystemCommonObject *object, QJsonObject
    &previousObj, MapEditorSubSelectionKind &previousType)
{
    SystemCommonObject *previousObject = this->removeObject(p);
    if (previousObject != nullptr)
    {
        previousObject->write(previousObj);
        previousType = MapEditorSubSelectionKind::Object;
        delete previousObject;
    }
    this->setObject(p, object);
    return true;
}

// -------------------------------------------------------

bool MapObjects::deleteObject(Position &p, QJsonObject &previousObj,
    MapEditorSubSelectionKind &previousType)
{
    SystemCommonObject *previousObject = this->removeObject(p);
    if (previousObject != nullptr) {
        previousObject->write(previousObj);
        previousType = MapEditorSubSelectionKind::Object;
        delete previousObject;
    }
    return true;
}

// -------------------------------------------------------

void MapObjects::removeObjectsOut(QList<int> &listDeletedObjectsIDs,
    MapProperties &properties)
{
    QList<Position> list;
    QHash<Position, SystemCommonObject *>::iterator i;
    Position position;
    for (i = m_all.begin(); i != m_all.end(); i++)
    {
        position = i.key();
        if (position.isOutMapPorperties(properties))
        {
            list.push_back(position);
            listDeletedObjectsIDs.push_back(i.value()->id());
            delete *i;
        }
    }
    for (int j = 0; j < list.size(); j++)
    {
        m_all.remove(list.at(j));
    }
}

// -------------------------------------------------------

QList<SystemCommonObject *> MapObjects::getObjects() const
{
    QList<SystemCommonObject *> list;
    QHash<Position, SystemCommonObject *>::const_iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
    {
        list << i.value();
    }
    return list;
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void MapObjects::clear()
{
    int index;
    QHash<int, QList<SpriteObject*>*>::const_iterator i;
    for (i = m_spritesStaticGL.begin(); i != m_spritesStaticGL.end(); i++)
    {
        QList<SpriteObject*>* list = i.value();
        for (index = 0; index < list->size(); index++)
        {
            delete list->at(index);
        }
        delete list;
    }
    QHash<int, QList<SpriteObject*>*>::const_iterator j;
    for (j = m_spritesFaceGL.begin(); j != m_spritesFaceGL.end(); j++)
    {
        QList<SpriteObject*>* list = j.value();
        for (index = 0; index < list->size(); index++)
        {
            delete list->at(index);
        }
        delete list;
    }
    QHash<int, QList<Object3DObject*>*>::const_iterator k;
    for (k = m_objects3DGL.begin(); k != m_objects3DGL.end(); k++)
    {
        QList<Object3DObject*>* list = k.value();
        for (index = 0; index < list->size(); index++)
        {
            delete list->at(index);
        }
        delete list;
    }
    QHash<Position, MapElement *>::const_iterator l;
    for (l = m_allElements.begin(); l != m_allElements.end(); l++)
    {
        delete l.value();
    }
    m_spritesStaticGL.clear();
    m_spritesFaceGL.clear();
    m_objects3DGL.clear();
    m_allElements.clear();
}

// -------------------------------------------------------

void MapObjects::initializeVertices(int squareSize, QHash<int, QOpenGLTexture *>
    &characters, QOpenGLTexture *tileset)
{
    this->clear();
    m_vertices.clear();
    m_indexes.clear();

    // Objects and their squares
    unsigned int count = 0;
    Position position;
    SystemCommonObject *o;
    SystemState *state;
    QOpenGLTexture *texture;
    QRect rect;
    SpriteDatas *sprite, *spriteEmpty;
    Object3DDatas *object3D;
    SpriteObject *spriteObject;
    Object3DObject *object3DObject;
    QHash<Position, SystemCommonObject*>::iterator i;
    SystemPicture *picture;
    int graphicsId, x, y, width, height, frames;
    for (i = m_all.begin(); i != m_all.end(); i++)
    {
        position = i.key();
        o = i.value();
        state = o->getFirstState();

        // Draw the first state graphics of the object
        if (state != nullptr)
        {
            graphicsId = state->graphicsId();
            switch (state->graphicsKind())
            {
            case MapEditorSubSelectionKind::SpritesFix:
            case MapEditorSubSelectionKind::SpritesFace:
            {
                if (graphicsId == 0) {
                    texture = tileset;
                    rect = state->rectTileset();
                    width = rect.width();
                    height = rect.height();
                    x = rect.x();
                    y = rect.y();
                } else
                {
                    texture = characters[graphicsId];
                    picture = reinterpret_cast<SystemPicture *>(SuperListItem
                        ::getById(RPM::get()->project()->picturesDatas()->model(
                        PictureKind::Characters)->invisibleRootItem(),
                        graphicsId));
                    // If texture ID doesn't exist, load missing texture
                    if (texture == nullptr)
                    {
                        texture = RPM::get()->project()->currentMap()
                            ->textureMissing();
                    }
                    frames = RPM::get()->project()->gameDatas()->systemDatas()
                        ->framesAnimation();
                    width = texture->width() / frames / squareSize;
                    height = texture->height() / picture->getRows() / squareSize;
                    x = (state->indexX() >= frames ? frames - 1 : state
                        ->indexX()) * width;
                    y = state->indexY() * height;
                }

                // Create the sprite geometry
                sprite = new SpriteDatas(state->graphicsKind(), new QRect(x, y,
                    width, height));
                spriteObject = new SpriteObject(*sprite, texture);
                spriteObject->initializeVertices(squareSize, position);

                // Adding the sprite to the GL list
                QHash<int, QList<SpriteObject *> *>& hash = (state
                    ->graphicsKind() == MapEditorSubSelectionKind::SpritesFace)
                    ? m_spritesFaceGL : m_spritesStaticGL;
                if (hash.value(graphicsId) == nullptr)
                {
                   hash[graphicsId] = new QList<SpriteObject *>;
                }
                hash[graphicsId]->append(spriteObject);
                m_allElements.insert(position, sprite);
                break;
            }
            case MapEditorSubSelectionKind::Object3D:
                object3D = Object3DDatas::instanciate(reinterpret_cast<
                    SystemObject3D *>(SuperListItem::getById(RPM::get()
                    ->project()->specialElementsDatas()->modelObjects3D()
                    ->invisibleRootItem(), state->graphicsId())));
                object3DObject = new Object3DObject(*object3D);
                object3DObject->initializeVertices(position);
                if (m_objects3DGL.value(graphicsId) == nullptr)
                {
                   m_objects3DGL[graphicsId] = new QList<Object3DObject *>;
                }
                m_objects3DGL[graphicsId]->append(object3DObject);
                m_allElements.insert(position, object3D);
                break;
            default:
                break;
            }
        } else
        {
            spriteEmpty = new SpriteDatas(MapEditorSubSelectionKind::None, new
                QRect(0, 0,0, 0));
            m_allElements.insert(position, spriteEmpty);
        }

        // Draw the square of the object
        QVector3D pos(position.x() * squareSize, position.getY() + 0.5f, position
            .z() * squareSize);
        QVector3D size(squareSize, 0.0, squareSize);
        float x = 0.0, y = 0.0, w = 1.0, h = 1.0;
        m_vertices.append(Vertex(Lands::verticesQuad[0] * size + pos, QVector2D(x, y)));
        m_vertices.append(Vertex(Lands::verticesQuad[1] * size + pos, QVector2D(x + w, y)));
        m_vertices.append(Vertex(Lands::verticesQuad[2] * size + pos, QVector2D(x + w, y + h)));
        m_vertices.append(Vertex(Lands::verticesQuad[3] * size + pos, QVector2D(x, y + h)));
        unsigned int offset = count * static_cast<unsigned int>(Lands::nbVerticesQuad);
        for (int i = 0; i < Lands::nbIndexesQuad; i++)
        {
            m_indexes.append(Lands::indexesQuad[i] + offset);
        }
        count++;
    }
}

// -------------------------------------------------------

MapElement * MapObjects::updateRaycasting(int squareSize, float &finalDistance,
    Position &finalPosition, QRay3D &ray)
{
    MapElement *element = nullptr;
    Position position;
    for (QHash<Position, MapElement *>::iterator i = m_allElements.begin(); i !=
        m_allElements.end(); i++)
    {
        position = i.key();
        if (updateRaycastingAt(position, squareSize, finalDistance,
            finalPosition, ray))
        {
            element = i.value();
        }
    }
    return element;
}

// -------------------------------------------------------

bool MapObjects::updateRaycastingAt(Position &position, int squareSize, float
    &finalDistance, Position &finalPosition, QRay3D &ray)
{
    float newDistance = LandDatas::staticIntersection(squareSize, ray, position);
    if (Common::getMinDistance(finalDistance, newDistance))
    {
        finalPosition = position;
        return true;
    }
    return false;
}

// -------------------------------------------------------

QList<QStandardItem *> MapObjects::getAllCommandsList() const
{
    QList<QStandardItem *> list;
    QHash<Position, SystemCommonObject*>::const_iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
    {
        list.append(i.value()->getAllCommandsList());
    }
    return list;
}

// -------------------------------------------------------

void MapObjects::initializeGL(QOpenGLShaderProgram *programStatic,
    QOpenGLShaderProgram *programFace)
{
    QHash<int, QList<SpriteObject *> *>::const_iterator i;
    int index;
    for (i = m_spritesStaticGL.begin(); i != m_spritesStaticGL.end(); i++)
    {
        QList<SpriteObject *> *list = i.value();
        for (index = 0; index < list->size(); index++)
        {
            list->at(index)->initializeStaticGL(programStatic);
        }
    }
    QHash<int, QList<SpriteObject *> *>::const_iterator j;
    for (j = m_spritesFaceGL.begin(); j != m_spritesFaceGL.end(); j++)
    {
        QList<SpriteObject *> *list = j.value();
        for (index = 0; index < list->size(); index++)
        {
            list->at(index)->initializeFaceGL(programFace);
        }
    }
    QHash<int, QList<Object3DObject *> *>::const_iterator k;
    for (k = m_objects3DGL.begin(); k != m_objects3DGL.end(); k++)
    {
        QList<Object3DObject *> * list = k.value();
        for (index = 0; index < list->size(); index++)
        {
            list->at(index)->initializeGL(programStatic);
        }
    }
    if (m_programStatic == nullptr)
    {
        initializeOpenGLFunctions();

        // Programs
        m_programStatic = programStatic;
    }
}

// -------------------------------------------------------

void MapObjects::updateGL()
{
    // Objects
    QHash<int, QList<SpriteObject *> *>::const_iterator i;
    int index;
    for (i = m_spritesStaticGL.begin(); i != m_spritesStaticGL.end(); i++)
    {
        QList<SpriteObject *> *list = i.value();
        for (index = 0; index < list->size(); index++)
        {
            list->at(index)->updateStaticGL();
        }
    }
    QHash<int, QList<SpriteObject *> *>::const_iterator j;
    for (j = m_spritesFaceGL.begin(); j != m_spritesFaceGL.end(); j++)
    {
        QList<SpriteObject *> *list = j.value();
        for (index = 0; index < list->size(); index++)
        {
            list->at(index)->updateFaceGL();
        }
    }
    QHash<int, QList<Object3DObject *> *>::const_iterator k;
    for (k = m_objects3DGL.begin(); k != m_objects3DGL.end(); k++)
    {
        QList<Object3DObject *> *list = k.value();
        for (index = 0; index < list->size(); index++)
        {
            list->at(index)->updateGL();
        }
    }

    // Squares of objects
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
        m_vao, m_programStatic);
}

// -------------------------------------------------------

void MapObjects::paintStaticSprites(int textureID, QOpenGLTexture *texture)
{
    QList<SpriteObject *> *list = m_spritesStaticGL.value(textureID);
    if (list != nullptr)
    {
        texture->bind();
        for (int i = 0; i < list->size(); i++)
        {
            list->at(i)->paintGL();
        }
        texture->release();
    }
}

// -------------------------------------------------------

void MapObjects::paintFaceSprites(int textureID, QOpenGLTexture *texture)
{
    QList<SpriteObject *> *list = m_spritesFaceGL.value(textureID);
    if (list != nullptr)
    {
        texture->bind();
        for (int i = 0; i < list->size(); i++)
        {
            list->at(i)->paintGL();
        }
        texture->release();
    }
}

// -------------------------------------------------------

void MapObjects::paintObjects3D(int textureID)
{
    QList<Object3DObject *> *list = m_objects3DGL.value(textureID);
    if (list != nullptr)
    {
        for (int i = 0; i < list->size(); i++)
        {
            list->at(i)->paintGL();
        }
    }
}

// -------------------------------------------------------

void MapObjects::paintSquares(){
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, nullptr);
    m_vao.release();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------


void MapObjects::read(const QJsonObject & json){
    QJsonArray tab = json["list"].toArray();
    int changed = false;
    for (int i = 0; i < tab.size(); i++) {
        QJsonObject objHash = tab.at(i).toObject();
        Position p;
        p.read(objHash["k"].toArray());
        SystemCommonObject* o = new SystemCommonObject;
        o->read(objHash["v"].toObject());
        if (!RPM::isInConfig || RPM::isInObjectConfig)
        {
             changed |= RPM::get()->project()->currentMap(true)->syncObjects(o, p);
        }
        m_all.insert(p, o);
    }
    if (changed && (!RPM::isInConfig || RPM::isInObjectConfig))
    {
        RPM::get()->project()->currentMap(true)->writeObjects(true);
        RPM::get()->project()->currentMap(true)->setToNotSaved();
    }
}

// -------------------------------------------------------

void MapObjects::write(QJsonObject & json) const{
    QJsonArray tab;
    QHash<Position, SystemCommonObject*>::const_iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
    {
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
