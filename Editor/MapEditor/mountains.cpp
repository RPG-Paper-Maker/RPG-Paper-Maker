/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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

void MountainsGL::initializeVertices(Position &position, MountainDatas *mountain)
{
    mountain->initializeVertices(m_vertices, m_indexes, position, m_count);
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
    QHash<int, MountainsGL*>::iterator j;
    for (j = m_allGL.begin(); j != m_allGL.end(); j++) {
        delete *j;
    }
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
    /*
    Portion currentPortion;
    Map::getGlobalPortion(p, currentPortion);
    double scale = mountain->datas()->scale();
    int x = Common::ceil(mountain->xMin() * scale);
    int y = Common::ceil(mountain->yMin() * scale);
    int z = Common::ceil(mountain->zMin() * scale);
    int r = Common::ceil(mountain->xMax() * scale);
    int h = Common::ceil(mountain->yMax() * scale);
    int d = Common::ceil(mountain->zMax() * scale);

    for (int i = x; i < r; i++) {
        for (int j = y; j < h; j++) {
            for (int k = z; k < d; k++) {
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
    */
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
                                bool add)
{
    /*
    Map* map = RPM::get()->project()->currentMap();
    for (QSet<Portion>::iterator i = portionsOverflow.begin(); i !=
            portionsOverflow.end(); i++)
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
            if (add) {
                mapPortion->addOverflowMountains(p);
            } else {
                mapPortion->removeOverflowMountains(p);
            }
            if (write) {
                map->savePortionMap(mapPortion);
                delete mapPortion;
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
    */
}

// -------------------------------------------------------

MountainDatas * Mountains::removeMountain(QSet<Portion> &portionsOverflow,
    Position &p)
{
    MountainDatas *mountain = m_all.value(p);
    if (mountain != nullptr){
        m_all.remove(p);

        // Getting overflowing portions
        getSetPortionsOverflow(portionsOverflow, p, mountain);

        // Adding to overflowing
        addRemoveOverflow(portionsOverflow, p, false);

        return mountain;
    }

    return nullptr;
}

// -------------------------------------------------------

bool Mountains::addMountain(QSet<Portion> &portionsOverflow, Position &p,
    MountainDatas *mountain, QJsonObject &previousObj, MapEditorSubSelectionKind
    &previousType)
{
    QSet<Portion> portionsOverflowRemove, portionsOverflowSet;
    MountainDatas *previousmountain;
    bool changed;

    previousmountain = removeMountain(portionsOverflowRemove, p);
    changed = true;
    if (previousmountain != nullptr) {
        previousmountain->write(previousObj);
        previousType = previousmountain->getSubKind();
        changed = (*previousmountain) != (*mountain);
        delete previousmountain;
    }
    setMountain(portionsOverflowSet, p, mountain);

    // Fusion of sets
    portionsOverflow.unite(portionsOverflowRemove);
    portionsOverflow.unite(portionsOverflowSet);

    return changed;
}

// -------------------------------------------------------

bool Mountains::deleteMountain(QSet<Portion> &portionsOverflow, Position &p,
    QJsonObject &previousObj, MapEditorSubSelectionKind &previousType)
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

    return changed;
}

// -------------------------------------------------------

void Mountains::removeMountainsOut(MapProperties &properties) {
    QList<Position> list;

    QHash<Position, MountainDatas *>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        Position position = i.key();

        if (position.isOutMapPorperties(properties)) {
            delete i.value();
            list.push_back(position);
        }
    }
    for (int k = 0; k < list.size(); k++) {
        m_all.remove(list.at(k));
    }
}

// -------------------------------------------------------

MapElement* Mountains::updateRaycasting(float &finalDistance, Position
    &finalPosition, QRay3D &ray)
{
    MapElement* element = nullptr;

    for (QHash<Position, MountainDatas *>::iterator i = m_all.begin(); i !=
        m_all.end(); i++)
    {
        Position position = i.key();
        MountainDatas *mountain = i.value();
        if (this->updateRaycastingAt(position, mountain, finalDistance,
            finalPosition, ray))
        {
            element = mountain;
        }
    }

    // Overflow
    /*
    Map *map = RPM::get()->project()->currentMap();
    for (QSet<Position>::iterator i = m_overflow.begin(); i != m_overflow.end();
        i++)
    {
        Position position = *i;
        Portion portion;
        map->getLocalPortion(position, portion);
        MapPortion* mapPortion = map->mapPortion(portion);
        MapElement* newElement = mapPortion->updateRaycastingOverflowmountain(
            position, finalDistance, finalPosition, ray);
        if (newElement != nullptr) {
            element = newElement;
        }
    }
    */

    return element;
}

// -------------------------------------------------------

bool Mountains::updateRaycastingAt(Position &position, MountainDatas *mountain,
    float &finalDistance, Position &finalPosition, QRay3D &ray)
{
    float newDistance = mountain->intersection(ray);
    if (RPM::getMinDistance(finalDistance, newDistance)) {
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

void Mountains::initializeVertices(QHash<Position, MapElement *>
    &previewSquares, QList<Position> &previewDelete)
{
    // Clear
    for (QHash<int, MountainsGL *>::iterator i = m_allGL.begin(); i != m_allGL
        .end(); i++)
    {
        delete *i;
    }
    m_allGL.clear();

    // Create temp hash for preview
    QHash<Position, MountainDatas *> objectsWithPreview(m_all);
    QHash<Position, MapElement*>::iterator itw;
    for (itw = previewSquares.begin(); itw != previewSquares.end(); itw++) {
        MapElement* element = itw.value();
        if (element->getSubKind() == MapEditorSubSelectionKind::Mountains) {
            objectsWithPreview[itw.key()] = reinterpret_cast<MountainDatas *>(
                element);
        }
    }
    for (int i = 0; i < previewDelete.size(); i++) {
        objectsWithPreview.remove(previewDelete.at(i));
    }

    // Initialize vertices
    for (QHash<Position, MountainDatas *>::iterator i = objectsWithPreview
         .begin(); i != objectsWithPreview.end(); i++)
    {
        Position position = i.key();
        MountainDatas *mountain = i.value();
        int id = mountain->textureID();
        MountainsGL *objects = m_allGL.value(id);
        if (objects == nullptr) {
            objects = new MountainsGL;
            m_allGL[id] = objects;
        }
        objects->initializeVertices(position, mountain);
    }
}

// -------------------------------------------------------

void Mountains::initializeGL(QOpenGLShaderProgram* programStatic) {
    QHash<int, MountainsGL *>::iterator i;
    for (i = m_allGL.begin(); i != m_allGL.end(); i++) {
        i.value()->initializeGL(programStatic);
    }
}

// -------------------------------------------------------

void Mountains::updateGL() {
    QHash<int, MountainsGL *>::iterator i;
    for (i = m_allGL.begin(); i != m_allGL.end(); i++) {
        i.value()->updateGL();
    }
}

// -------------------------------------------------------

void Mountains::paintGL(int textureID) {
    MountainsGL *objects = m_allGL.value(textureID);
    if (objects != nullptr) {
        objects->paintGL();
    }
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
        QSet<Portion> portionsOverflow;
        getSetPortionsOverflow(portionsOverflow, p, mountain);
        addRemoveOverflow(portionsOverflow, p, true);
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
