/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "sprites.h"
#include "map.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//
//  ---------- SPRITESWALLS
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SpritesWalls::SpritesWalls() :
    m_count(0),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_program(nullptr)
{

}

SpritesWalls::~SpritesWalls()
{

}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void SpritesWalls::initializeVertices(Position &position,
                                      SpriteWallDatas* sprite,
                                      int squareSize, int width, int height)
{
    sprite->initializeVertices(squareSize, width, height, m_vertices,
                               m_indexes, position, m_count);
}

// -------------------------------------------------------

void SpritesWalls::initializeGL(QOpenGLShaderProgram* program) {
    if (m_program == nullptr){
        initializeOpenGLFunctions();

        // Programs
        m_program = program;
    }
}

// -------------------------------------------------------

void SpritesWalls::updateGL(){
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
                        m_vao, m_program);
}

// -------------------------------------------------------

void SpritesWalls::paintGL(){
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, nullptr);
    m_vao.release();
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
    m_isHovered(false),
    m_vertexBufferStatic(QOpenGLBuffer::VertexBuffer),
    m_indexBufferStatic(QOpenGLBuffer::IndexBuffer),
    m_programStatic(nullptr),
    m_vertexBufferStaticHovered(QOpenGLBuffer::VertexBuffer),
    m_indexBufferStaticHovered(QOpenGLBuffer::IndexBuffer),
    m_vertexBufferFace(QOpenGLBuffer::VertexBuffer),
    m_indexBufferFace(QOpenGLBuffer::IndexBuffer),
    m_programFace(nullptr),
    m_vertexBufferFaceHovered(QOpenGLBuffer::VertexBuffer),
    m_indexBufferFaceHovered(QOpenGLBuffer::IndexBuffer)
{

}

Sprites::~Sprites()
{
    QHash<Position, SpriteDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++)
        delete *i;

    QHash<Position, SpriteWallDatas*>::iterator j;
    for (j = m_walls.begin(); j != m_walls.end(); j++)
        delete *j;
    QHash<int, SpritesWalls*>::iterator k;
    for (k = m_wallsGL.begin(); k != m_wallsGL.end(); k++)
        delete *k;
}

void Sprites::addOverflow(Position& p) {
    m_overflow += p;
}

void Sprites::removeOverflow(Position& p) {
    m_overflow -= p;
}

bool Sprites::isEmpty() const{
    return m_isEmpty;
}

void Sprites::updateEmpty(bool previewSquare) {
    m_isEmpty = m_all.isEmpty() && m_walls.isEmpty() && m_overflow.isEmpty() &&
        previewSquare;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool Sprites::contains(Position& position) const {
    return m_all.contains(position);
}

// -------------------------------------------------------

void Sprites::changePosition(Position& position, Position& newPosition) {
    SpriteDatas* sprite = m_all.value(position);
    m_all.remove(position);
    m_all.insert(newPosition, sprite);
}

// -------------------------------------------------------

SpriteDatas* Sprites::spriteAt(Position& position) const {
    return m_all.value(position);
}

// -------------------------------------------------------

void Sprites::setSprite(QSet<Portion>& portionsOverflow, Position& p,
                        SpriteDatas* sprite){
    m_all[p] = sprite;

    // Getting overflowing portions
    getSetPortionsOverflow(portionsOverflow, p, sprite);

    // Adding to overflowing
    addRemoveOverflow(portionsOverflow, p, true);
}

// -------------------------------------------------------

void Sprites::getSetPortionsOverflow(QSet<Portion>& portionsOverflow,
                                     Position& p, SpriteDatas* sprite)
{
    Portion currentPortion;
    Map::getGlobalPortion(p, currentPortion);
    int r = sprite->textureRect()->width() / 2;
    int h = sprite->textureRect()->height();

    for (int i = -r; i < r; i++) {
        for (int j = 0; j < h; j++) {
            for (int k = -r; k < r; k++) {
                Position newPosition = p;
                newPosition.addX(i);
                newPosition.addY(j);
                newPosition.addZ(k);
                Portion newPortion;
                Map::getGlobalPortion(newPosition, newPortion);
                if (newPortion != currentPortion)
                    portionsOverflow += newPortion;
            }
        }
    }
}

// -------------------------------------------------------

void Sprites::addRemoveOverflow(QSet<Portion>& portionsOverflow, Position& p,
                                bool add)
{
    Map* map = RPM::get()->project()->currentMap();
    for (QSet<Portion>::iterator i = portionsOverflow.begin();
         i != portionsOverflow.end(); i++)
    {
        Portion portion = *i;
        if (map->isPortionInGrid(portion)) {
            MapPortion* mapPortion = map->mapPortionFromGlobal(portion);
            bool write = false;
            if (mapPortion == nullptr) {
                write = true;
                mapPortion = map->loadPortionMap(portion.x(), portion.y(),
                                                 portion.z());
            }
            if (add)
                mapPortion->addOverflowSprites(p);
            else
                mapPortion->removeOverflowSprites(p);
            if (write) {
                map->savePortionMap(mapPortion);
                delete mapPortion;
            }
        }
        else {
            if (add)
                map->addOverflowSprites(p, portion);
            else
                map->removeOverflowSprites(p, portion);
        }
    }
}

// -------------------------------------------------------

SpriteDatas* Sprites::removeSprite(QSet<Portion>& portionsOverflow, Position& p)
{
    SpriteDatas* sprite = m_all.value(p);
    if (sprite != nullptr){
        m_all.remove(p);

        // Getting overflowing portions
        getSetPortionsOverflow(portionsOverflow, p, sprite);

        // Adding to overflowing
        addRemoveOverflow(portionsOverflow, p, false);

        return sprite;
    }

    return nullptr;
}

// -------------------------------------------------------

bool Sprites::addSprite(QSet<Portion>& portionsOverflow, Position& p,
                        SpriteDatas* sprite, QJsonObject &previousObj,
                        MapEditorSubSelectionKind &previousType)
{
    QSet<Portion> portionsOverflowRemove, portionsOverflowSet;
    SpriteDatas* previousSprite = removeSprite(portionsOverflowRemove, p);
    bool changed = true;

    if (previousSprite != nullptr) {
        previousSprite->write(previousObj);
        previousType = previousSprite->getSubKind();
        changed = (*previousSprite) != (*sprite);
        delete previousSprite;
    }

    setSprite(portionsOverflowSet, p, sprite);

    // Fusion of sets
    portionsOverflow.unite(portionsOverflowRemove);
    portionsOverflow.unite(portionsOverflowSet);

    return changed;
}

// -------------------------------------------------------

bool Sprites::deleteSprite(QSet<Portion>& portionsOverflow, Position& p,
                           QJsonObject &previousObj,
                           MapEditorSubSelectionKind &previousType, bool deletePtr)
{
    SpriteDatas* previousSprite = removeSprite(portionsOverflow, p);
    bool changed = false;

    if (previousSprite != nullptr) {
        previousSprite->write(previousObj);
        previousType = previousSprite->getSubKind();
        changed = true;
        if (deletePtr)
        {
            delete previousSprite;
        }
    }

    return changed;
}

// -------------------------------------------------------

void Sprites::setSpriteWall(Position &p, SpriteWallDatas* sprite) {
    m_walls[p] = sprite;
}

// -------------------------------------------------------

SpriteWallDatas* Sprites::removeSpriteWall(Position &p) {
    SpriteWallDatas* sprite = m_walls.value(p);
    if (sprite != nullptr){
        m_walls.remove(p);
        return sprite;
    }

    return nullptr;
}

// -------------------------------------------------------

bool Sprites::addSpriteWall(Position &p, SpriteWallDatas* sprite,
                            QJsonObject&previousObj,
                            MapEditorSubSelectionKind &previousType)
{
    SpriteWallDatas* previousSprite = removeSpriteWall(p);
    bool changed = true;

    if (previousSprite != nullptr) {
        previousSprite->write(previousObj);
        previousType = previousSprite->getSubKind();
        changed = (*previousSprite) != (*sprite);
        delete previousSprite;
    }

    setSpriteWall(p, sprite);

    return changed;
}

// -------------------------------------------------------

bool Sprites::deleteSpriteWall(Position &p, QJsonObject &previousObj,
                               MapEditorSubSelectionKind &previousType)
{
    SpriteWallDatas* previousSprite = removeSpriteWall(p);
    bool changed = false;

    if (previousSprite != nullptr) {
        previousSprite->write(previousObj);
        previousType = previousSprite->getSubKind();
        changed = true;
        delete previousSprite;
    }

    return changed;
}

// -------------------------------------------------------

void Sprites::updateSpriteWalls(QHash<Position, MapElement *> &preview,
                                QList<Position> &previewDelete) {
    QHash<Position, SpriteWallDatas*> spritesWallWithPreview;
    getWallsWithPreview(spritesWallWithPreview, preview, previewDelete);

    QHash<Position, SpriteWallDatas*>::iterator i;
    for (i = spritesWallWithPreview.begin(); i != spritesWallWithPreview.end();
         i++)
    {
        Position position = i.key();
        SpriteWallDatas* sprite = i.value();

        sprite->update(position);
    }
}

// -------------------------------------------------------

SpriteWallDatas* Sprites::getWallAt(QHash<Position, MapElement *> &preview,
                                    QList<Position> &previewDelete,
                                    Position &position)
{
    QHash<Position, SpriteWallDatas*> spritesWallWithPreview;
    getWallsWithPreview(spritesWallWithPreview, preview, previewDelete);

    return spritesWallWithPreview.value(position);
}

// -------------------------------------------------------

SpriteWallDatas* Sprites::getWallAtPosition(Position& position) {
    return m_walls.value(position);
}

// -------------------------------------------------------

void Sprites::getWallsWithPreview(QHash<Position, SpriteWallDatas *>
                                  &spritesWallWithPreview,
                                  QHash<Position, MapElement *> &preview,
                                  QList<Position> &previewDelete)
{
    spritesWallWithPreview = m_walls;
    QHash<Position, MapElement*>::iterator itw;
    for (itw = preview.begin(); itw != preview.end(); itw++) {
        MapElement* element = itw.value();
        if (element->getSubKind() == MapEditorSubSelectionKind::SpritesWall) {
            spritesWallWithPreview[itw.key()] = reinterpret_cast<
                SpriteWallDatas *>(element);
        }
    }
    for (int i = 0; i < previewDelete.size(); i++) {
        spritesWallWithPreview.remove(previewDelete.at(i));
    }
}

// -------------------------------------------------------

void Sprites::removeSpritesOut(MapProperties& properties) {
    QList<Position> listGlobal;
    QList<Position> listWalls;

    // Global sprites
    QHash<Position, SpriteDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        Position position = i.key();

        if (position.isOutMapPorperties(properties)) {
            delete i.value();
            listGlobal.push_back(position);
        }
    }
    for (int k = 0; k < listGlobal.size(); k++)
        m_all.remove(listGlobal.at(k));

    // Walls sprites
    QHash<Position, SpriteWallDatas*>::iterator j;
    for (j = m_walls.begin(); j != m_walls.end(); j++) {
        Position position = j.key();

        if (position.isOutMapPorperties(properties)) {
            delete j.value();
            listWalls.push_back(position);
        }
    }
    for (int k = 0; k < listWalls.size(); k++)
        m_walls.remove(listWalls.at(k));
}

// -------------------------------------------------------

MapElement* Sprites::updateRaycasting(int squareSize, float &finalDistance,
                                      Position& finalPosition,
                                      QRay3D &ray, double cameraHAngle,
                                      bool layerOn)
{
    MapElement* element = nullptr;

    for (QHash<Position, SpriteDatas*>::iterator i = m_all.begin();
         i != m_all.end(); i++)
    {
        Position position = i.key();
        SpriteDatas *sprite = i.value();
        if (updateRaycastingAt(position, sprite, squareSize, finalDistance,
                               finalPosition, ray, cameraHAngle))
        {
            element = sprite;
        }
    }

    // Overflow
    Map* map = RPM::get()->project()->currentMap();
    for (QSet<Position>::iterator i = m_overflow.begin();
         i != m_overflow.end(); i++)
    {
        Position position = *i;
        Portion portion;
        map->getLocalPortion(position, portion);
        MapPortion* mapPortion = map->mapPortion(portion);
        bool remove = false;
        MapElement* newElement = mapPortion->updateRaycastingOverflowSprite(
                    squareSize, position, finalDistance, finalPosition, ray,
                    cameraHAngle, remove);
        if (newElement != nullptr)
            element = newElement;
    }

    // If layer on, also check the walls
    if (layerOn) {
        for (QHash<Position, SpriteWallDatas*>::iterator i =
             m_walls.begin(); i != m_walls.end(); i++)
        {
            Position position = i.key();
            SpriteWallDatas *wall = i.value();
            if (updateRaycastingWallAt(position, wall, finalDistance,
                                       finalPosition, ray))
            {
                element = wall;
            }
        }
    }

    return element;
}

// -------------------------------------------------------

bool Sprites::updateRaycastingAt(
        Position &position, SpriteDatas *sprite, int squareSize,
        float &finalDistance, Position &finalPosition, QRay3D& ray,
        double cameraHAngle)
{
    float newDistance = sprite->intersection(squareSize, ray, position,
                                             cameraHAngle);
    if (Common::getMinDistance(finalDistance, newDistance)) {
        finalPosition = position;
        return true;
    }

    return false;
}

// -------------------------------------------------------

bool Sprites::updateRaycastingWallAt(
        Position &position, SpriteWallDatas* wall, float &finalDistance,
        Position &finalPosition, QRay3D& ray)
{
    float newDistance = wall->intersection(ray);
    if (Common::getMinDistance(finalDistance, newDistance)) {
        finalPosition = position;
        return true;
    }

    return false;
}

// -------------------------------------------------------

MapElement* Sprites::getMapElementAt(Position& position,
                                     MapEditorSubSelectionKind subKind, bool includeWalls)
{
    MapElement* element;

    switch (subKind) {
    case MapEditorSubSelectionKind::SpritesWall:
        return getWallAtPosition(position);
    case MapEditorSubSelectionKind::None:
        element = spriteAt(position);
        return element == nullptr && includeWalls ? getWallAtPosition(position) : element;
    default:
        return spriteAt(position);
    }
}

// -------------------------------------------------------

int Sprites::getLastLayerAt(Position& position) const {
    int count = position.layer() + 1;
    Position p(position.x(), position.y(), position.yPlus(), position.z(),
        count, position.centerX(), position.centerZ(), position.angleY(),
        position.angleX(), position.angleZ());
    SpriteDatas* sprite = spriteAt(p);

    while (sprite != nullptr) {
        count++;
        p.setLayer(count);
        sprite = spriteAt(p);
    }

    return count - 1;
}

// -------------------------------------------------------

void Sprites::updateRemoveLayer(QSet<Portion> portionsOverflow,
                                Position& position, QList<QJsonObject> previous,
                                QList<MapEditorSubSelectionKind> previousType,
                                QList<Position> positions)
{
    int i = position.layer() + 1;
    Position p(position.x(), position.y(), position.yPlus(), position.z(), i,
        position.centerX(), position.centerZ(), position.angleY(), position
        .angleY(), position.angleZ());
    SpriteDatas* sprite = spriteAt(p);

    while (sprite != nullptr) {
        QJsonObject obj;
        MapEditorSubSelectionKind kind;
        deleteSprite(portionsOverflow, p, obj, kind);
        previous.append(obj);
        previousType.append(kind);
        positions.append(p);
        p.setLayer(++i);
        sprite = spriteAt(p);
    }
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Sprites::initializeVertices(QHash<int, QOpenGLTexture *> &texturesWalls,
                                 QHash<Position, MapElement *> &previewSquares,
                                 QList<Position> &previewDelete,
                                 int squareSize, int width, int height, MapElement *elementExclude)
{
    int countStatic = 0;
    int countFace = 0;
    m_isHovered = false;

    // Clear
    m_verticesStatic.clear();
    m_indexesStatic.clear();
    m_verticesStaticHovered.clear();
    m_indexesStaticHovered.clear();
    m_verticesFace.clear();
    m_indexesFace.clear();
    m_verticesFaceHovered.clear();
    m_indexesFaceHovered.clear();
    for (QHash<int, SpritesWalls*>::iterator i = m_wallsGL.begin();
         i != m_wallsGL.end(); i++)
    {
        delete *i;
    }
    m_wallsGL.clear();

    // Create temp hash for preview
    QHash<Position, SpriteDatas*> spritesWithPreview(m_all);
    for (QHash<Position, MapElement*>::iterator i = previewSquares.begin();
         i != previewSquares.end(); i++)
    {
        MapElement* element = i.value();
        if (element->getKind() == MapEditorSelectionKind::Sprites &&
            element->getSubKind() != MapEditorSubSelectionKind::SpritesWall)
        {
            spritesWithPreview[i.key()] = reinterpret_cast<SpriteDatas *>(element);
        }
    }
    QHash<Position, SpriteWallDatas*> spritesWallWithPreview;
    getWallsWithPreview(spritesWallWithPreview, previewSquares, previewDelete);

    // Initialize vertices in squares
    for (QHash<Position, SpriteDatas*>::iterator i = spritesWithPreview.begin();
         i != spritesWithPreview.end(); i++)
    {
        Position position = i.key();
        SpriteDatas* sprite = i.value();
        int count = 0;

        if (sprite == elementExclude) {
            m_isHovered = true;
            sprite->initializeVertices(squareSize, width, height,
                m_verticesStaticHovered, m_indexesStaticHovered,
                m_verticesFaceHovered, m_indexesFaceHovered, position, count,
                count);
        } else {
            sprite->initializeVertices(squareSize, width, height,
                m_verticesStatic, m_indexesStatic, m_verticesFace, m_indexesFace
                , position, countStatic, countFace);
        }
    }

    // Initialize vertices for walls
    for (QHash<Position, SpriteWallDatas*>::iterator i =
         spritesWallWithPreview.begin(); i != spritesWallWithPreview.end(); i++)
    {
        Position position = i.key();
        SpriteWallDatas* sprite = i.value();
        int id = sprite->wallID();
        QOpenGLTexture* texture = texturesWalls.value(id);

        if (texture != nullptr) {
            SpritesWalls* sprites = m_wallsGL.value(id);
            if (sprites == nullptr) {
                sprites = new SpritesWalls;
                m_wallsGL[id] = sprites;
            }
            sprites->initializeVertices(position, sprite, squareSize,
                                        texture->width(), texture->height());
        }
    }
}

// -------------------------------------------------------

void Sprites::initializeGL(QOpenGLShaderProgram* programStatic,
                           QOpenGLShaderProgram *programFace)
{
    if (m_programStatic == nullptr){
        initializeOpenGLFunctions();

        // Programs
        m_programStatic = programStatic;
        m_programFace = programFace;
    }

    QHash<int, SpritesWalls*>::iterator i;
    for (i = m_wallsGL.begin(); i != m_wallsGL.end(); i++)
        i.value()->initializeGL(programStatic);
}

// -------------------------------------------------------

void Sprites::updateGL() {
    Map::updateGLStatic(m_vertexBufferStatic, m_indexBufferStatic,
        m_verticesStatic, m_indexesStatic, m_vaoStatic, m_programStatic);
    Map::updateGLStatic(m_vertexBufferStaticHovered, m_indexBufferStaticHovered,
        m_verticesStaticHovered, m_indexesStaticHovered, m_vaoStaticHovered,
        m_programStatic);
    Map::updateGLFace(m_vertexBufferFace, m_indexBufferFace, m_verticesFace,
        m_indexesFace, m_vaoFace, m_programFace);
    Map::updateGLFace(m_vertexBufferFaceHovered, m_indexBufferFaceHovered,
        m_verticesFaceHovered, m_indexesFaceHovered, m_vaoFaceHovered,
        m_programFace);
    QHash<int, SpritesWalls*>::iterator i;
    for (i = m_wallsGL.begin(); i != m_wallsGL.end(); i++)
        i.value()->updateGL();
}

// -------------------------------------------------------

void Sprites::paintGL(int uniformHovered) {
    m_vaoStatic.bind();
    glDrawElements(GL_TRIANGLES, m_indexesStatic.size(), GL_UNSIGNED_INT,
        nullptr);
    m_vaoStatic.release();

    if (m_isHovered) {
        m_programStatic->setUniformValue(uniformHovered, true);
        m_vaoStaticHovered.bind();
        glDrawElements(GL_TRIANGLES, m_indexesStaticHovered.size(),
            GL_UNSIGNED_INT, nullptr);
        m_vaoStaticHovered.release();
        m_programStatic->setUniformValue(uniformHovered, false);
    }
}

// -------------------------------------------------------

void Sprites::paintFaceGL(int uniformHovered) {
    m_vaoFace.bind();
    glDrawElements(GL_TRIANGLES, m_indexesFace.size(), GL_UNSIGNED_INT, nullptr);
    m_vaoFace.release();

    if (m_isHovered) {
        m_programFace->setUniformValue(uniformHovered, true);
        m_vaoFaceHovered.bind();
        glDrawElements(GL_TRIANGLES, m_indexesFaceHovered.size(),
            GL_UNSIGNED_INT, nullptr);
        m_vaoFaceHovered.release();
        m_programFace->setUniformValue(uniformHovered, false);
    }
}

// -------------------------------------------------------

void Sprites::paintSpritesWalls(int textureID) {
    SpritesWalls* sprites = m_wallsGL.value(textureID);
    if (sprites != nullptr)
        sprites->paintGL();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Sprites::read(const QJsonObject & json){
    QJsonArray tab = json["list"].toArray();

    // Globals
    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        Position p;
        p.read(obj["k"].toArray());
        QJsonObject objVal = obj["v"].toObject();
        SpriteDatas* sprite = new SpriteDatas;
        sprite->read(objVal);
        m_all[p] = sprite;
    }

    // Walls
    tab = json["walls"].toArray();
    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        Position p;
        p.read(obj["k"].toArray());
        QJsonObject objVal = obj["v"].toObject();
        SpriteWallDatas* sprite = new SpriteWallDatas;
        sprite->read(objVal);
        m_walls[p] = sprite;
    }

    // Overflow
    tab = json["overflow"].toArray();
    for (int i = 0; i < tab.size(); i++){
        QJsonArray tabPosition = tab.at(i).toArray();
        Position position;
        position.read(tabPosition);
        m_overflow += position;
    }
}

// -------------------------------------------------------

void Sprites::write(QJsonObject & json) const{
    QJsonArray tabGlobals, tabWalls, tabOverflow;

    // Globals
    for (QHash<Position, SpriteDatas*>::const_iterator i = m_all.begin();
         i != m_all.end(); i++)
    {
        QJsonObject objHash;
        QJsonArray tabKey;
        Position position = i.key();
        position.write(tabKey);
        QJsonObject objSprite;
        i.value()->write(objSprite);

        objHash["k"] = tabKey;
        objHash["v"] = objSprite;
        tabGlobals.append(objHash);
    }
    json["list"] = tabGlobals;

    // Walls
    for (QHash<Position, SpriteWallDatas*>::const_iterator i =
         m_walls.begin(); i != m_walls.end(); i++)
    {
        QJsonObject objHash;
        QJsonArray tabKey;
        i.key().write(tabKey);
        QJsonObject objSprite;
        i.value()->write(objSprite);

        objHash["k"] = tabKey;
        objHash["v"] = objSprite;
        tabWalls.append(objHash);
    }
    json["walls"] = tabWalls;

    // Overflow
    for (QSet<Position>::const_iterator i = m_overflow.begin();
         i != m_overflow.end(); i++)
    {
        Position position = *i;
        QJsonArray tabPosition;
        position.write(tabPosition);
        tabOverflow.append(tabPosition);
    }
    json["overflow"] = tabOverflow;
}
