/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "objects3d.h"
#include "map.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//
//  ---------- Objects3DGL
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Objects3DGL::Objects3DGL() :
    m_count(0),
    m_isHovered(false),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_program(nullptr),
    m_vertexBufferHovered(QOpenGLBuffer::VertexBuffer),
    m_indexBufferHovered(QOpenGLBuffer::IndexBuffer)
{

}

Objects3DGL::~Objects3DGL()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Objects3DGL::initializeVertices(Position &position, Object3DDatas *object3D,
    MapElement *excludeElement)
{
    if (excludeElement == object3D) {
        unsigned int count = 0;
        m_isHovered = true;
        object3D->initializeVertices(m_verticesHovered, m_indexesHovered,
            position, count);
    } else {
        object3D->initializeVertices(m_vertices, m_indexes, position, m_count);
    }
}

// -------------------------------------------------------

void Objects3DGL::initializeGL(QOpenGLShaderProgram* program) {
    if (m_program == nullptr){
        initializeOpenGLFunctions();

        // Programs
        m_program = program;
    }
}

// -------------------------------------------------------

void Objects3DGL::updateGL() {
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
        m_vao, m_program);
    Map::updateGLStatic(m_vertexBufferHovered, m_indexBufferHovered,
        m_verticesHovered, m_indexesHovered, m_vaoHovered, m_program);
}

// -------------------------------------------------------

void Objects3DGL::paintGL(int uniformHovered) {
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, nullptr);
    m_vao.release();

    if (m_isHovered) {
        m_program->setUniformValue(uniformHovered, true);
        m_vaoHovered.bind();
        glDrawElements(GL_TRIANGLES, m_indexesHovered.size(), GL_UNSIGNED_INT,
            nullptr);
        m_vaoHovered.release();
        m_program->setUniformValue(uniformHovered, false);
    }
}

// -------------------------------------------------------
//
//
//  ---------- Objects3D
//
//
// -------------------------------------------------------

const QString Objects3D::JSON_ALL = "a";
const QString Objects3D::JSON_OVERFLOW = "o";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Objects3D::Objects3D() {

}

Objects3D::~Objects3D()
{
    QHash<Position, Object3DDatas*>::iterator i;
    for (i = m_all.begin(); i != m_all.end(); i++) {
        delete *i;
    }
    QHash<int, Objects3DGL*>::iterator j;
    for (j = m_allGL.begin(); j != m_allGL.end(); j++) {
        delete *j;
    }
}

bool Objects3D::isEmpty() const{
    return m_isEmpty;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Objects3D::getSetPortionsOverflow(QSet<Portion> &portionsOverflow, Position
    &p, Object3DDatas *object3D)
{
    Portion currentPortion;
    Map::getGlobalPortion(p, currentPortion);
    double scale = object3D->datas()->scale();
    int x = Common::ceil(object3D->xMin() * scale * p.scaleX());
    int y = Common::ceil(object3D->yMin() * scale * p.scaleY());
    int z = Common::ceil(object3D->zMin() * scale * p.scaleZ());
    int r = Common::ceil(object3D->xMax() * scale * p.scaleX());
    int h = Common::ceil(object3D->yMax() * scale * p.scaleY());
    int d = Common::ceil(object3D->zMax() * scale * p.scaleZ());
    int min = qMin(qMin(x, y), z);
    int max = qMax(qMax(r, h), d);
    int cx = object3D->xOverflowCenter();
    int cy = object3D->yOverflowCenter();
    int cz = object3D->zOverflowCenter();

    for (int i = min; i < max; i++) {
        for (int j = min; j < max; j++) {
            for (int k = min; k < max; k++) {
                Position newPosition = p;
                newPosition.addX(i + cx);
                newPosition.addY(j + cy);
                newPosition.addZ(k + cz);
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

bool Objects3D::contains(Position &position) const {
    return m_all.contains(position);
}

// -------------------------------------------------------

void Objects3D::addOverflow(Position &p) {
    m_overflow += p;
}

// -------------------------------------------------------

void Objects3D::removeOverflow(Position &p) {
    m_overflow -= p;
}

// -------------------------------------------------------

void Objects3D::updateEmpty(bool previewSquare) {
    m_isEmpty = m_all.isEmpty() && m_overflow.isEmpty() && previewSquare;
}

// -------------------------------------------------------

void Objects3D::changePosition(Position& position, Position& newPosition) {
    Object3DDatas *object3D;

    object3D = m_all.value(position);
    m_all.remove(position);
    m_all.insert(newPosition, object3D);
}

// -------------------------------------------------------

Object3DDatas * Objects3D::object3DAt(Position &position) const {
    return m_all.value(position);
}

// -------------------------------------------------------

void Objects3D::setObject3D(QSet<Portion> &portionsOverflow, Position &p,
    Object3DDatas *object3D)
{
    m_all[p] = object3D;

    // Getting overflowing portions
    getSetPortionsOverflow(portionsOverflow, p, object3D);

    // Adding to overflowing
    addRemoveOverflow(portionsOverflow, p, true);
}

// -------------------------------------------------------

void Objects3D::addRemoveOverflow(QSet<Portion>& portionsOverflow, Position& p,
                                bool add)
{
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
                mapPortion->addOverflowObjects3D(p);
            } else {
                mapPortion->removeOverflowObjects3D(p);
            }
            if (write) {
                map->savePortionMap(mapPortion);
                delete mapPortion;
            }
        }
        else {
            if (add) {
                map->addOverflowObjects3D(p, portion);
            } else {
                map->removeOverflowObjects3D(p, portion);
            }
        }
    }
}

// -------------------------------------------------------

Object3DDatas * Objects3D::removeObject3D(QSet<Portion> &portionsOverflow,
    Position &p)
{
    Object3DDatas *object3D = m_all.value(p);
    if (object3D != nullptr){
        m_all.remove(p);

        // Getting overflowing portions
        getSetPortionsOverflow(portionsOverflow, p, object3D);

        // Adding to overflowing
        addRemoveOverflow(portionsOverflow, p, false);

        return object3D;
    }

    return nullptr;
}

// -------------------------------------------------------

bool Objects3D::addObject3D(QSet<Portion> &portionsOverflow, Position &p,
    Object3DDatas *object3D, QJsonObject &previousObj, MapEditorSubSelectionKind
    &previousType)
{
    QSet<Portion> portionsOverflowRemove, portionsOverflowSet;
    Object3DDatas *previousObject3D;
    bool changed;

    previousObject3D = removeObject3D(portionsOverflowRemove, p);
    changed = true;
    if (previousObject3D != nullptr) {
        previousObject3D->write(previousObj);
        previousType = previousObject3D->getSubKind();
        changed = (*previousObject3D) != (*object3D);
        delete previousObject3D;
    }
    setObject3D(portionsOverflowSet, p, object3D);

    // Fusion of sets
    portionsOverflow.unite(portionsOverflowRemove);
    portionsOverflow.unite(portionsOverflowSet);

    return changed;
}

// -------------------------------------------------------

bool Objects3D::deleteObject3D(QSet<Portion> &portionsOverflow, Position &p,
    QJsonObject &previousObj, MapEditorSubSelectionKind &previousType, bool deletePtr)
{
    Object3DDatas *previousObject3D;
    bool changed;

    previousObject3D = removeObject3D(portionsOverflow, p);
    changed = false;
    if (previousObject3D != nullptr) {
        previousObject3D->write(previousObj);
        previousType = previousObject3D->getSubKind();
        changed = true;
        if (deletePtr)
        {
            delete previousObject3D;
        }
    }

    return changed;
}

// -------------------------------------------------------

void Objects3D::removeObjects3DOut(MapProperties &properties) {
    QList<Position> list;

    QHash<Position, Object3DDatas *>::iterator i;
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

MapElement* Objects3D::updateRaycasting(float &finalDistance, Position
    &finalPosition, QRay3D &ray)
{
    MapElement* element = nullptr;
    bool remove;

    for (QHash<Position, Object3DDatas *>::iterator i = m_all.begin(); i !=
        m_all.end(); i++)
    {
        Position position = i.key();
        Object3DDatas *object3D = i.value();
        if (this->updateRaycastingAt(position, object3D, finalDistance,
            finalPosition, ray))
        {
            element = object3D;
        }
    }

    // Overflow
    Map *map = RPM::get()->project()->currentMap();
    for (QSet<Position>::iterator i = m_overflow.begin(); i != m_overflow.end();
        i++)
    {
        Position position = *i;
        Portion portion;
        map->getLocalPortion(position, portion);
        if (map->isInPortion(portion))
        {
            MapPortion* mapPortion = map->mapPortion(portion);
            MapElement* newElement = mapPortion->updateRaycastingOverflowObject3D(
                position, finalDistance, finalPosition, ray, remove);
            if (newElement != nullptr) {
                element = newElement;
            }
        }
    }

    return element;
}

// -------------------------------------------------------

bool Objects3D::updateRaycastingAt(Position &position, Object3DDatas *object3D,
    float &finalDistance, Position &finalPosition, QRay3D &ray)
{
    if (object3D != nullptr) {
        float newDistance;

        newDistance = object3D->intersection(ray);
        if (Common::getMinDistance(finalDistance, newDistance)) {
            finalPosition = position;
            return true;
        }
    }

    return false;
}

// -------------------------------------------------------

MapElement * Objects3D::getMapElementAt(Position &position) {
    return this->object3DAt(position);
}

// -------------------------------------------------------

int Objects3D::getLastLayerAt(Position &) const {
    return 0;
}

// -------------------------------------------------------

void Objects3D::initializeVertices(QHash<Position, MapElement *>
    &previewSquares, QList<Position> &previewDelete, MapElement *excludeElement)
{
    // Clear
    for (QHash<int, Objects3DGL *>::iterator i = m_allGL.begin(); i != m_allGL
        .end(); i++)
    {
        delete *i;
    }
    m_allGL.clear();

    // Create temp hash for preview
    QHash<Position, Object3DDatas *> objectsWithPreview(m_all);
    QHash<Position, MapElement*>::iterator itw;
    for (itw = previewSquares.begin(); itw != previewSquares.end(); itw++) {
        MapElement* element = itw.value();
        if (element->getSubKind() == MapEditorSubSelectionKind::Object3D) {
            objectsWithPreview[itw.key()] = reinterpret_cast<Object3DDatas *>(
                element);
        }
    }
    for (int i = 0; i < previewDelete.size(); i++) {
        objectsWithPreview.remove(previewDelete.at(i));
    }

    // Initialize vertices
    for (QHash<Position, Object3DDatas *>::iterator i = objectsWithPreview
         .begin(); i != objectsWithPreview.end(); i++)
    {
        Position position = i.key();
        Object3DDatas *object3D = i.value();

        if (object3D->textureID() != -1) {
            int id = object3D->datas()->id();
            Objects3DGL *objects = m_allGL.value(id);
            if (objects == nullptr) {
                objects = new Objects3DGL;
                m_allGL[id] = objects;
            }
            objects->initializeVertices(position, object3D, excludeElement);
        }
    }
}

// -------------------------------------------------------

void Objects3D::initializeGL(QOpenGLShaderProgram* programStatic) {
    QHash<int, Objects3DGL *>::iterator i;
    for (i = m_allGL.begin(); i != m_allGL.end(); i++) {
        i.value()->initializeGL(programStatic);
    }
}

// -------------------------------------------------------

void Objects3D::updateGL() {
    QHash<int, Objects3DGL *>::iterator i;
    for (i = m_allGL.begin(); i != m_allGL.end(); i++) {
        i.value()->updateGL();
    }
}

// -------------------------------------------------------

void Objects3D::paintGL(int textureID, int uniformHovered) {
    Objects3DGL *objects = m_allGL.value(textureID);
    if (objects != nullptr) {
        objects->paintGL(uniformHovered);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Objects3D::read(const QJsonObject & json) {
    QJsonArray tab;

    // All
    tab = json[JSON_ALL].toArray();
    for (int i = 0; i < tab.size(); i++){
        QJsonObject obj = tab.at(i).toObject();
        Position p;
        p.read(obj[RPM::JSON_KEY].toArray());
        QJsonObject objVal = obj[RPM::JSON_VALUE].toObject();
        Object3DDatas *object3D = Object3DDatas::instanciateFromJSON(objVal);
        object3D->read(objVal);
        m_all[p] = object3D;
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

void Objects3D::write(QJsonObject &json) const {
    QJsonArray tabAll, tabOverflow;

    // All
    for (QHash<Position, Object3DDatas *>::const_iterator i = m_all.begin(); i
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
