/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "lands.h"
#include "floors.h"

QVector3D Lands::verticesQuad[4]{
    QVector3D(0.0f, 0.0f, 0.0f),
    QVector3D(1.0f, 0.0f, 0.0f),
    QVector3D(1.0f, 0.0f, 1.0f),
    QVector3D(0.0f, 0.0f, 1.0f)
};

GLuint Lands::indexesQuad[6]{0, 1, 2, 0, 2, 3};

int Lands::nbVerticesQuad(4);

int Lands::nbIndexesQuad(6);

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Lands::Lands() :
    m_floors(new Floors),
    m_autotiles(new Autotiles)
{

}

Lands::~Lands()
{
    delete m_floors;
    delete m_autotiles;
}

bool Lands::isEmpty() const {
    return m_floors->isEmpty() && m_autotiles->isEmpty();
}

void Lands::updateEmpty(bool preview) {
    m_floors->updateEmpty(preview);
    m_autotiles->updateEmpty(preview);
    m_isEmpty = m_floors->isEmpty() && m_autotiles->isEmpty() && preview;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

LandDatas* Lands::getLand(Position& p) const {
    LandDatas* land = m_floors->getFloor(p);

    if (land != nullptr)
        return land;

    land = m_autotiles->getAutotile(p);

    return land;
}

// -------------------------------------------------------

void Lands::setLand(Position& p, LandDatas* land) {
    switch (land->getSubKind()) {
    case MapEditorSubSelectionKind::Floors:
        m_floors->setFloor(p, reinterpret_cast<FloorDatas *>(land));
        break;
    case MapEditorSubSelectionKind::Autotiles:
        m_autotiles->setAutotile(p, reinterpret_cast<AutotileDatas *>(land));
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

LandDatas* Lands::removeLand(Position& p) {
    LandDatas* land = m_floors->removeFloor(p);

    if (land != nullptr)
        return land;

    land = m_autotiles->removeAutotile(p);

    return land;
}

// -------------------------------------------------------

bool Lands::addLand(Position& p, LandDatas* land, QJsonObject &previous,
                    MapEditorSubSelectionKind &previousType,
                    QSet<MapPortion*>& update, QSet<MapPortion*>& save)
{
    LandDatas* previousLand = removeLand(p);
    bool changed = true;

    if (previousLand != nullptr) {
        previousLand->write(previous);
        previousType = previousLand->getSubKind();
        changed = (previousType == land->getSubKind())
                ? (*previousLand) != (*land) : true;
        delete previousLand;
    }

    setLand(p, land);
    m_autotiles->updateWithoutPreview(p, update, save);

    return changed;
}

// -------------------------------------------------------

bool Lands::deleteLand(Position& p, QList<QJsonObject> &previous, QList<
    MapEditorSubSelectionKind> &previousType, QList<Position>& positions, QSet<
    MapPortion *> &update, QSet<MapPortion *> &save, bool removeLayers, bool
    deletePtr)
{ 
    QJsonObject prev;
    MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::None;
    LandDatas* previousLand = removeLand(p);
    bool changed = false;

    if (previousLand != nullptr) {
        previousLand->write(prev);
        kind = previousLand->getSubKind();
        changed = true;
        if (deletePtr)
        {
            delete previousLand;
        }
    }
    m_autotiles->updateWithoutPreview(p, update, save);
    if (changed)
    {
        previous.append(prev);
        previousType.append(kind);
        positions.append(p);
        if (removeLayers)
            updateRemoveLayer(p, previous, previousType, positions, update,
                              save);
    }

    return changed;
}

// -------------------------------------------------------

void Lands::removeLandOut(MapProperties& properties) {
    m_floors->removeFloorOut(properties);
    m_autotiles->removeAutotileOut(properties);
}

// -------------------------------------------------------

MapElement* Lands::updateRaycasting(int squareSize, float& finalDistance,
    Position &finalPosition, QRay3D &ray, Position &previousCoords)
{
    MapElement* elementFloor, *elementAutotile;
    elementFloor = m_floors->updateRaycasting(squareSize, finalDistance,
        finalPosition, ray, previousCoords);
    elementAutotile = m_autotiles->updateRaycasting(squareSize, finalDistance,
        finalPosition, ray, previousCoords);

    return elementAutotile == nullptr ? elementFloor : elementAutotile;
}

// -------------------------------------------------------

MapElement* Lands::getMapElementAt(Position& position,
                                   MapEditorSubSelectionKind subKind)
{
    switch (subKind) {
    case MapEditorSubSelectionKind::Floors:
        return m_floors->getFloor(position);
    case MapEditorSubSelectionKind::Autotiles:
        return m_autotiles->getAutotile(position);
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

int Lands::getLastLayerAt(Position& position) const
{
    int count = position.layer() + 1;
    Position p(position.x(), position.y(), position.yPlus(), position.z(),
               count);
    LandDatas* land = getLand(p);

    while (land != nullptr) {
        count++;
        p.setLayer(count);
        land = getLand(p);
    }

    return count - 1;
}

// -------------------------------------------------------

void Lands::updateRemoveLayer(Position& position, QList<QJsonObject> &previous,
                             QList<MapEditorSubSelectionKind> &previousType,
                             QList<Position> &positions,
                             QSet<MapPortion*>& update, QSet<MapPortion*>& save)
{
    int i = position.layer() + 1;
    Position p(position.x(), position.y(), position.yPlus(),
               position.z(), i);
    LandDatas* land = getLand(p);

    while (land != nullptr) {
        deleteLand(p, previous, previousType, positions, update, save, false);
        p.setLayer(++i);
        land = getLand(p);
    }
}

// -------------------------------------------------------

void Lands::updateAutotiles(Position &position, QHash<Position, MapElement *>
    &preview, QSet<MapPortion *> &update, QSet<MapPortion *> &save, QSet<
    MapPortion *> &previousPreview)
{
    QHash<Position, AutotileDatas *> autotilesWithPreview;

    m_autotiles->getAutotilesWithPreview(autotilesWithPreview, preview);
    m_autotiles->updateAround(position, autotilesWithPreview, update, save,
        &previousPreview);
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Lands::initializeVertices(QList<TextureSeveral *> &texturesAutotiles, QHash<
    Position, MapElement *> &previewSquares, int squareSize, int width, int
    height, MapElement *excludeElement)
{
    m_floors->initializeVertices(previewSquares, squareSize, width, height,
        excludeElement);
    m_autotiles->initializeVertices(texturesAutotiles, previewSquares, squareSize);
}

// -------------------------------------------------------

void Lands::initializeGL(QOpenGLShaderProgram *programStatic){
    m_floors->initializeGL(programStatic);
    m_autotiles->initializeGL(programStatic);
}

// -------------------------------------------------------

void Lands::updateGL(){
    m_floors->updateGL();
    m_autotiles->updateGL();
}

// -------------------------------------------------------

void Lands::paintGL(int uniformHovered)
{
    if (!m_floors->isEmpty()) {
        m_floors->paintGL(uniformHovered);
    }
}

// -------------------------------------------------------

void Lands::paintAutotilesGL(QOpenGLShaderProgram *program, int textureID, bool
    isAnimated, int frame, int uniform)
{
    if (!m_autotiles->isEmpty()) {
        m_autotiles->paintGL(program, textureID, isAnimated, frame, uniform);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Lands::read(const QJsonObject & json){
    m_floors->read(json);
    m_autotiles->read(json);
}

// -------------------------------------------------------

void Lands::write(QJsonObject & json) const{
    m_floors->write(json);
    m_autotiles->write(json);
}
