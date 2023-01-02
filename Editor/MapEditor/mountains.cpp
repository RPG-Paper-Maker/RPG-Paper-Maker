/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "mountains.h"
#include "map.h"
#include "rpm.h"
#include "common.h"
#include "controlmapeditor.h"

// -------------------------------------------------------
//
//
//  ---------- MountainsGL
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MountainsGL::MountainsGL() :
    m_count(0),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_program(nullptr)
{

}

MountainsGL::~MountainsGL()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void MountainsGL::initializeVertices(TextureSeveral *texture, Position &position,
    MountainDatas *mountain)
{
    mountain->initializeVertices(m_vertices, m_indexes, texture, position,
        m_count);
}

// -------------------------------------------------------

void MountainsGL::initializeGL(QOpenGLShaderProgram* program) {
    if (m_program == nullptr){
        initializeOpenGLFunctions();

        // Programs
        m_program = program;
    }
}

// -------------------------------------------------------

void MountainsGL::updateGL() {
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
        m_vao, m_program);
}

// -------------------------------------------------------

void MountainsGL::paintGL(){
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, nullptr);
    m_vao.release();
}

// -------------------------------------------------------
//
//
//  ---------- Mountains
//
//
// -------------------------------------------------------

const QString Mountains::JSON_ALL = "a";
const QString Mountains::JSON_OVERFLOW = "o";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Mountains::Mountains() {

}

Mountains::~Mountains()
{
    QHash<Position, MountainDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        delete *i;
    }
    this->clearMountainsGL();
}

bool Mountains::isEmpty() const{
    return m_isEmpty;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Mountains::getSetPortionsOverflow(QSet<Portion> &portionsOverflow, Position
    &p, MountainDatas *mountain)
{
    Portion currentPortion;
    int width, height;

    Map::getGlobalPortion(p, currentPortion);
    width = mountain->width();
    height = mountain->height(p.getYpx());

    for (int i = -width; i <= width; i++) {
        for (int j = 0; j <= height; j++) {
            for (int k = -width; k <= width; k++) {
                Position newPosition = p;
                newPosition.addX(i);
                newPosition.addY(j);
                newPosition.addZ(k);
                Portion newPortion;
                Map::getGlobalPortion(newPosition, newPortion);
                if (newPortion != currentPortion) {
                    portionsOverflow += newPortion;
                }
            }
        }
    }
}

// -------------------------------------------------------

MountainDatas* Mountains::tileExisting(Position &position, Portion &portion,
    QHash<Position, MountainDatas*> &preview)
{
    Portion newPortion;
    MapPortion *mapPortion;

    RPM::get()->project()->currentMap()->getLocalPortion(position, newPortion);
    MountainDatas * mountain = nullptr;
    if (portion == newPortion) {
        mountain = reinterpret_cast<MountainDatas *>(preview.value(position));
    } else { // If out of current portion
        mapPortion = RPM::get()->project()->currentMap()->mapPortion(newPortion);
        if (mapPortion == nullptr)
        {
            return nullptr;
        } else
        {
            mountain = reinterpret_cast<MountainDatas *>(mapPortion
                ->getMapElementAt(position, MapEditorSelectionKind::Mountains,
                MapEditorSubSelectionKind::Mountains));
        }
    }
    return mountain == nullptr ? mountain : (mountain->isInvisible() ? nullptr :
        mountain);
}


// -------------------------------------------------------

MountainDatas* Mountains::tileOnWhatever(Position &position, Portion &portion,
    int id, int width, int height, QHash<Position, MountainDatas *> &preview)
{
    MountainDatas *mountain;

    mountain = Mountains::tileExisting(position, portion, preview);

    return mountain != nullptr && mountain->specialID() == id && width ==
        mountain->widthTotalPixels() && height == mountain->heightTotalPixels()
        ? mountain : nullptr;
}

// -------------------------------------------------------

bool Mountains::tileOnLeft(Position &position, Portion &portion, int id, int
    width, int height, QHash<Position, MountainDatas *> &preview)
{
    Position newPosition(position.x() - 1, position.y(), position.yPlus(),
        position.z(), position.layer());

    return Mountains::tileOnWhatever(newPosition, portion, id, width, height,
        preview) != nullptr;
}

// -------------------------------------------------------

bool Mountains::tileOnRight(Position &position, Portion &portion, int id, int
    width, int height, QHash<Position, MountainDatas *> &preview)
{
    Position newPosition(position.x() + 1, position.y(), position.yPlus(),
        position.z(), position.layer());

    return Mountains::tileOnWhatever(newPosition, portion, id, width, height,
        preview) != nullptr;
}

// -------------------------------------------------------

bool Mountains::tileOnTop(Position &position, Portion &portion, int id, int
    width, int height, QHash<Position, MountainDatas *> &preview)
{
    Position newPosition(position.x(), position.y(), position.yPlus(),
        position.z() - 1, position.layer());

    return Mountains::tileOnWhatever(newPosition, portion, id, width, height,
        preview) != nullptr;
}

// -------------------------------------------------------

bool Mountains::tileOnBottom(Position &position, Portion &portion, int id, int
    width, int height, QHash<Position, MountainDatas *> &preview)
{
    Position newPosition(position.x(), position.y(), position.yPlus(),
        position.z() + 1, position.layer());

    return Mountains::tileOnWhatever(newPosition, portion, id, width, height,
        preview) != nullptr;
}

// -------------------------------------------------------

void Mountains::clearMountainsGL() {
    for (int i = 0; i < m_allGL.size(); i++)
        delete m_allGL.at(i);
    m_allGL.clear();
}

// -------------------------------------------------------

bool Mountains::contains(Position &position) const {
    return m_all.contains(position);
}

// -------------------------------------------------------

void Mountains::addOverflow(Position &p) {
    m_overflow += p;
}

// -------------------------------------------------------

void Mountains::removeOverflow(Position &p) {
    m_overflow -= p;
}

// -------------------------------------------------------

void Mountains::updateEmpty(bool previewSquare) {
    m_isEmpty = m_all.isEmpty() && m_overflow.isEmpty() && previewSquare;
}

// -------------------------------------------------------

void Mountains::changePosition(Position& position, Position& newPosition) {
    MountainDatas *mountain;

    mountain = m_all.value(position);
    m_all.remove(position);
    m_all.insert(newPosition, mountain);
}

// -------------------------------------------------------

MountainDatas * Mountains::mountainAt(Position &position) const {
    return m_all.value(position);
}

// -------------------------------------------------------

void Mountains::setMountain(QSet<Portion> &portionsOverflow, Position &p,
    MountainDatas *mountain)
{
    m_all[p] = mountain;

    // Getting overflowing portions
    getSetPortionsOverflow(portionsOverflow, p, mountain);

    // Adding to overflowing
    addRemoveOverflow(portionsOverflow, p, true);
}

// -------------------------------------------------------

void Mountains::addRemoveOverflow(QSet<Portion>& portionsOverflow, Position& p,
    bool add, bool forceWrite)
{
    Map* map = RPM::get()->project()->currentMap();
    for (QSet<Portion>::iterator i = portionsOverflow.begin(); i !=
            portionsOverflow.end(); i++)
    {
        Portion portion = *i;
        if (map->isPortionInGrid(portion)) {
            MapPortion* mapPortion = map->mapPortionFromGlobal(portion);
            bool write = forceWrite;
            bool needDelete = false;
            if (mapPortion == nullptr) {
                write = true;
                needDelete = true;
                mapPortion = map->loadPortionMap(portion.x(), portion.y(),
                    portion.z());
            }
            if (add) {
                mapPortion->addOverflowMountains(p);
            } else {
                mapPortion->removeOverflowMountains(p);
            }
            if (write) {
                map->savePortionMap(mapPortion);
                if (needDelete)
                {
                    delete mapPortion;
                }
            }
        }
        else {
            if (add) {
                map->addOverflowMountains(p, portion);
            } else {
                map->removeOverflowMountains(p, portion);
            }
        }
    }
}

// -------------------------------------------------------

MountainDatas * Mountains::removeMountain(QSet<Portion> &portionsOverflow,
    Position &p, bool forceWrite)
{
    MountainDatas *mountain = m_all.value(p);
    if (mountain != nullptr){
        m_all.remove(p);

        // Getting overflowing portions
        getSetPortionsOverflow(portionsOverflow, p, mountain);

        // Adding to overflowing
        addRemoveOverflow(portionsOverflow, p, false, forceWrite);

        return mountain;
    }

    return nullptr;
}

// -------------------------------------------------------

bool Mountains::addMountain(QSet<Portion> &portionsOverflow, Position &p,
    MountainDatas *mountain, QJsonObject &previousObj, MapEditorSubSelectionKind
    &previousType, QSet<MapPortion *> &update, QSet<MapPortion *> &save,
    Position &positionPreviousFloor)
{
    QSet<Portion> portionsOverflowRemove, portionsOverflowSet;
    MountainDatas *previousmountain;
    bool changed;
    int y;
    double yPlus;

    previousmountain = removeMountain(portionsOverflowRemove, p);
    changed = true;
    if (previousmountain != nullptr) {
        y = previousmountain->heightSquares();
        yPlus = previousmountain->heightPixels();
        previousmountain->write(previousObj);
        previousType = previousmountain->getSubKind();
        changed = (*previousmountain) != (*mountain);
        delete previousmountain;
    } else {
        y = mountain->heightSquares();
        yPlus = mountain->heightPixels();
    }
    ControlMapEditor::getMountainTopFloorPosition(positionPreviousFloor,
        p, y, yPlus);
    setMountain(portionsOverflowSet, p, mountain);
    this->updateWithoutPreview(p, update, save);

    // Fusion of sets
    portionsOverflow.unite(portionsOverflowRemove);
    portionsOverflow.unite(portionsOverflowSet);

    return changed;
}

// -------------------------------------------------------

bool Mountains::deleteMountain(QSet<Portion> &portionsOverflow, Position &p,
    QJsonObject &previousObj, MapEditorSubSelectionKind &previousType, QSet<
    MapPortion *> &update, QSet<MapPortion *> &save)
{
    MountainDatas *previousmountain;
    bool changed;

    previousmountain = removeMountain(portionsOverflow, p);
    changed = false;
    if (previousmountain != nullptr) {
        previousmountain->write(previousObj);
        previousType = previousmountain->getSubKind();
        changed = true;
        delete previousmountain;
    }

    this->updateWithoutPreview(p, update, save);

    return changed;
}

// -------------------------------------------------------

void Mountains::removeMountainsOut(MapProperties &properties) {
    QList<Position> list;
    QSet<Portion> portionsOverflow;
    QHash<Position, MountainDatas *>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        Position position = i.key();

        if (position.isOutMapPorperties(properties)) {
            list.push_back(position);
        }
    }
    for (int k = 0; k < list.size(); k++) {
        Position p = list.at(k);
        delete this->removeMountain(portionsOverflow, p, true);
    }
}

// -------------------------------------------------------

MapElement* Mountains::updateRaycasting(float &finalDistance, Position
    &finalPosition, QRay3D &ray)
{
    MapElement *element, *newElement;
    Position position;
    Portion portion;
    MountainDatas *mountain;
    Map *map;
    MapPortion *mapPortion;
    bool remove;

    element = nullptr;
    for (QHash<Position, MountainDatas *>::iterator i = m_all.begin(); i !=
        m_all.end(); i++)
    {
        position = i.key();
        mountain = i.value();
        if (this->updateRaycastingAt(position, mountain, finalDistance,
            finalPosition, ray))
        {
            element = mountain;
        }
    }

    // Overflow
    map = RPM::get()->project()->currentMap();
    for (QSet<Position>::iterator i = m_overflow.begin(); i != m_overflow.end();
        i++)
    {
        position = *i;
        map->getLocalPortion(position, portion);
        mapPortion = map->mapPortion(portion);
        if (mapPortion != nullptr) {
            newElement = mapPortion->updateRaycastingOverflowMountain(position,
                finalDistance, finalPosition, ray, remove);
            if (newElement != nullptr) {
                element = newElement;
            }
        }
    }

    return element;
}

// -------------------------------------------------------

bool Mountains::updateRaycastingAt(Position &position, MountainDatas *mountain,
    float &finalDistance, Position &finalPosition, QRay3D &ray)
{
    float newDistance = mountain->intersection(ray);
    if (Common::getMinDistance(finalDistance, newDistance)) {
        finalPosition = position;
        return true;
    }

    return false;
}

// -------------------------------------------------------

MapElement * Mountains::getMapElementAt(Position &position) {
    return this->mountainAt(position);
}

// -------------------------------------------------------

int Mountains::getLastLayerAt(Position &) const {
    return 0;
}

// -------------------------------------------------------

void Mountains::getMountainsWithPreview(QHash<Position, MountainDatas *>
    &mountainsWithPreview, QHash<Position, MapElement *> &preview)
{
    QHash<Position, MapElement*>::iterator itw;
    MapElement *element;

    mountainsWithPreview = m_all;
    for (itw = preview.begin(); itw != preview.end(); itw++) {
        element = itw.value();
        if (element->getSubKind() == MapEditorSubSelectionKind::Mountains) {
            mountainsWithPreview[itw.key()] = reinterpret_cast<MountainDatas *>(
                element);
        }
    }
}

// -------------------------------------------------------

void Mountains::updateAround(Position &position, QHash<Position, MountainDatas *
    > &mountains, QSet<MapPortion *> &update, QSet<MapPortion *> &save, QSet<
    MapPortion *> *previousPreview)
{
    Portion portion, newPortion;
    Position newPosition;
    MountainDatas *newMountain, *previewMountain;
    MapPortion *mapPortion;
    bool changed, center;
    int i, j;

    RPM::get()->project()->currentMap()->getLocalPortion(position, portion);
    for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
            newPosition = Position(position.x() + i, position.y(), position
                .yPlus(), position.z() + j, position.layer());
            newMountain = Mountains::tileExisting(newPosition, portion,
                mountains);
            if (newMountain != nullptr) {

                // Update the current mountain
                previewMountain = nullptr;
                if (previousPreview == nullptr) {
                    changed = newMountain->update(newPosition, portion,
                        mountains);
                } else {
                    center = (i == 0 && j == 0);
                    if (center) {
                        previewMountain = newMountain;
                    } else {
                        previewMountain = new MountainDatas(*newMountain);
                    }
                    changed = previewMountain->update(newPosition, portion,
                        mountains);
                    if (!changed && !center) {
                        delete previewMountain;
                    }
                }

                if (changed) {
                    RPM::get()->project()->currentMap()->getLocalPortion(
                        newPosition, newPortion);

                    // Update view in different portion
                    if (portion != newPortion) {
                        mapPortion = RPM::get()->project()->currentMap()
                            ->mapPortion(newPortion);
                        update += mapPortion;
                        if (previousPreview == nullptr) {
                            save += mapPortion;
                        } else {
                            *previousPreview += mapPortion;
                        }
                    }

                    // If preview, add the autotile to it
                    if (previousPreview != nullptr && previewMountain != nullptr && previewMountain != newMountain) {
                        RPM::get()->project()->currentMap()->mapPortion(
                            newPortion)->addPreview(newPosition,
                            previewMountain);
                    }
                }
            }
        }
    }
}

// -------------------------------------------------------

void Mountains::updateWithoutPreview(Position &position, QSet<MapPortion *>
    &update, QSet<MapPortion *> &save)
{
    Mountains::updateAround(position, m_all, update, save, nullptr);
}


// -------------------------------------------------------

void Mountains::updateMountains(Position &position, QHash<Position, MapElement *>
    &preview, QSet<MapPortion *> &update, QSet<MapPortion *> &save, QSet<
    MapPortion *> &previousPreview)
{
    QHash<Position, MountainDatas *> mountainsWithPreview;

    this->getMountainsWithPreview(mountainsWithPreview, preview);
    this->updateAround(position, mountainsWithPreview, update, save,
        &previousPreview);
}

// -------------------------------------------------------

void Mountains::initializeVertices(QList<TextureSeveral *> &texturesMountains,
    QHash<Position, MapElement *> &previewSquares, QList<Position>
    &previewDelete)
{
    int j, l;

    // Clear
    this->clearMountainsGL();
    for (j = 0, l = texturesMountains.size(); j < l; j++) {
        m_allGL.append(new MountainsGL);
    }

    // Create temp hash for preview
    QHash<Position, MountainDatas *> mountainsWithPreview(m_all);
    QHash<Position, MapElement*>::iterator itw;
    for (itw = previewSquares.begin(); itw != previewSquares.end(); itw++) {
        MapElement* element = itw.value();
        if (element->getSubKind() == MapEditorSubSelectionKind::Mountains) {
            mountainsWithPreview[itw.key()] = reinterpret_cast<MountainDatas *>(
                element);
        }
    }
    for (int i = 0; i < previewDelete.size(); i++) {
        mountainsWithPreview.remove(previewDelete.at(i));
    }

    // Initialize vertices
    QHash<Position, MountainDatas*>::iterator i;
    for (i = mountainsWithPreview.begin(); i != mountainsWithPreview.end(); i++)
    {
        Position position = i.key();
        MountainDatas *mountain = i.value();
        TextureSeveral *texture = nullptr;
        int index = 0;
        for (; index < texturesMountains.size(); index++) {
            TextureSeveral* textureMountain = texturesMountains[index];
            if (textureMountain->isInTexture(mountain->specialID(), nullptr))
            {
                texture = textureMountain;
                break;
            }
        }
        if (texture != nullptr && texture->texture() != nullptr) {
            MountainsGL* mountainsGL = m_allGL.at(index);
            mountainsGL->initializeVertices(texture, position, mountain);
        }
    }
}

// -------------------------------------------------------

void Mountains::initializeGL(QOpenGLShaderProgram* programStatic) {
    for (int i = 0, l = m_allGL.size(); i < l; i++) {
        m_allGL.at(i)->initializeGL(programStatic);
    }
}

// -------------------------------------------------------

void Mountains::updateGL() {
    for (int i = 0, l = m_allGL.size(); i < l; i++) {
        m_allGL.at(i)->updateGL();
    }
}

// -------------------------------------------------------

void Mountains::paintGL(int textureID) {
    m_allGL.at(textureID)->paintGL();
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Mountains::read(const QJsonObject & json) {
    QJsonArray tab;

    // All
    tab = json[JSON_ALL].toArray();
    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        Position p;
        p.read(obj[RPM::JSON_KEY].toArray());
        QJsonObject objVal = obj[RPM::JSON_VALUE].toObject();
        MountainDatas *mountain = new MountainDatas;
        mountain->read(objVal);
        m_all[p] = mountain;
    }

    // Overflow
    tab = json[JSON_OVERFLOW].toArray();
    for (int i = 0; i < tab.size(); i++){
        QJsonArray tabPosition = tab.at(i).toArray();
        Position position;
        position.read(tabPosition);
        m_overflow += position;
    }
}

// -------------------------------------------------------

void Mountains::write(QJsonObject &json) const {
    QJsonArray tabAll, tabOverflow;

    // All
    for (QHash<Position, MountainDatas *>::const_iterator i = m_all.begin(); i
         != m_all.end(); i++)
    {
        QJsonObject objHash;
        QJsonArray tabKey;
        i.key().write(tabKey);
        QJsonObject obj3D;
        i.value()->write(obj3D);

        objHash[RPM::JSON_KEY] = tabKey;
        objHash[RPM::JSON_VALUE] = obj3D;
        tabAll.append(objHash);
    }
    json[JSON_ALL] = tabAll;

    // Overflow
    for (QSet<Position>::const_iterator i = m_overflow.begin();
         i != m_overflow.end(); i++)
    {
        Position position = *i;
        QJsonArray tabPosition;
        position.write(tabPosition);
        tabOverflow.append(tabPosition);
    }
    json[JSON_OVERFLOW] = tabOverflow;
}
