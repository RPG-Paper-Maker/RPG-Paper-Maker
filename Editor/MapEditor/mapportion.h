/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MAPPORTION_H
#define MAPPORTION_H

#include <QOpenGLTexture>
#include "lands.h"
#include "sprites.h"
#include "objects3d.h"
#include "mountains.h"
#include "mapobjects.h"
#include "systemcommonobject.h"
#include "systemdetection.h"

// -------------------------------------------------------
//
//  CLASS MapPortion
//
//  A portion of the map. The map is divided in a lot of portions
//  in order to perform 3D drawing.
//
// -------------------------------------------------------

class MapPortion : public Serializable
{
public:
    const static QString JSON_LANDS;
    const static QString JSON_SPRITES;
    const static QString JSON_OBJECT_3D;
    const static QString JSON_MOUNTAINS;
    const static QString JSON_OBJECT;

    MapPortion(Portion& globalPortion);
    virtual ~MapPortion();

    void setDetection(SystemDetection *detection);
    void getGlobalPortion(Portion& portion);
    MapObjects* mapObjects() const;

    bool isVisibleLoaded() const;
    bool isVisible() const;
    void setIsVisible(bool b);
    bool isEmpty() const;
    void updateEmpty();
    void initializeDetection();
    LandDatas* getLand(Position& p);
    bool addLand(Position& p, LandDatas* land, QJsonObject &previous,
                 MapEditorSubSelectionKind &previousType,
                 QSet<MapPortion*>& update, QSet<MapPortion*>& save);
    bool deleteLand(Position& p, QList<QJsonObject> &previous,
                    QList<MapEditorSubSelectionKind> &previousType,
                    QList<Position>& positions, QSet<MapPortion *> &update,
                    QSet<MapPortion *> &save);
    bool addSprite(QSet<Portion>& portionsOverflow, Position& p,
                   SpriteDatas *sprite, QJsonObject &previous,
                   MapEditorSubSelectionKind &previousType);
    bool deleteSprite(QSet<Portion>& portionsOverflow, Position& p,
                      QList<QJsonObject> &previous,
                      QList<MapEditorSubSelectionKind> &previousType,
                      QList<Position>& positions, bool deletePtr = true);
    bool addSpriteWall(Position& position, SpriteWallDatas *sprite,
                       QJsonObject &previous,
                       MapEditorSubSelectionKind &previousType);
    bool deleteSpriteWall(Position& position, QJsonObject &previous,
                          MapEditorSubSelectionKind &previousType);
    bool addObject3D(QSet<Portion> &portionsOverflow, Position &p, Object3DDatas
        *object3D, QJsonObject &previous, MapEditorSubSelectionKind
        &previousType);
    bool deleteObject3D(QSet<Portion> &portionsOverflow, Position &p, QList<
        QJsonObject> &previous, QList<MapEditorSubSelectionKind> &previousType,
        QList<Position> &positions, bool deletePtr = true);
    bool addMountain(QSet<Portion> &portionsOverflow, Position &p, MountainDatas
        *mountain, QJsonObject &previous, MapEditorSubSelectionKind
        &previousType, QSet<MapPortion *> &update, QSet<MapPortion *> &save,
        Position &positionPreviousFloor);
    bool deleteMountain(QSet<Portion> &portionsOverflow, Position &p, QList<
        QJsonObject> &previous, QList<MapEditorSubSelectionKind> &previousType,
        QList<Position> &positions, QSet<MapPortion *> &update, QSet<MapPortion
        *> &save);
    void updateAutotiles(Position &position, QSet<MapPortion *> &update, QSet<
        MapPortion *> &save, QSet<MapPortion *> &previousPreview);
    void updateMountains(Position &position, QSet<MapPortion *> &update, QSet<
        MapPortion *> &save, QSet<MapPortion *> &previousPreview);
    void updateSpriteWalls();
    SpriteWallDatas* getWallAt(Position& position);
    void fillWithFloor(MapProperties *properties);
    bool addObject(Position& p, SystemCommonObject* o, QJsonObject &previous,
                   MapEditorSubSelectionKind &previousType);
    bool deleteObject(Position& p, QJsonObject &previous,
                      MapEditorSubSelectionKind &previousType);
    void addOverflowSprites(Position& p);
    void removeOverflowSprites(Position& p);
    void addOverflowObjects3D(Position& p);
    void removeOverflowObjects3D(Position& p);
    void addOverflowMountains(Position& p);
    void removeOverflowMountains(Position& p);
    void removeLandOut(MapProperties& properties);
    void removeSpritesOut(MapProperties& properties);
    void removeObjects3DOut(MapProperties& properties);
    void removeMountainsOut(MapProperties& properties);
    void removeObjectsOut(QList<int>& listDeletedObjectsIDs, MapProperties
        &properties);
    void clearPreview();
    void addPreview(Position& p, MapElement* element);
    void addPreviewDelete(Position& p);
    MapElement* updateRaycastingLand(int squareSize, float& finalDistance,
        Position &finalPosition, QRay3D& ray, Position &previousCoords);
    MapElement* updateRaycastingSprites(int squareSize, float& finalDistance,
                                        Position &finalPosition,
                                        QRay3D& ray, double cameraHAngle,
                                        bool layerOn);
    MapElement* updateRaycastingObjects3D(float& finalDistance,
                                        Position &finalPosition,
                                        QRay3D& ray);
    MapElement* updateRaycastingMountains(float &finalDistance, Position
        &finalPosition, QRay3D &ray);
    MapElement* updateRaycastingObjects(int squareSize, float& finalDistance,
                                        Position &finalPosition,
                                        QRay3D& ray);
    MapElement* updateRaycastingOverflowSprite(int squareSize,
                                               Position& position,
                                               float &finalDistance,
                                               Position &finalPosition,
                                               QRay3D& ray,
                                               double cameraHAngle, bool &remove);
    MapElement * updateRaycastingOverflowObject3D(Position &position, float
        &finalDistance, Position &finalPosition, QRay3D &ray, bool &remove);
    MapElement * updateRaycastingOverflowMountain(Position &position, float
        &finalDistance, Position &finalPosition, QRay3D &ray, bool &remove);
    MapElement* getMapElementAt(Position& position,
                                MapEditorSelectionKind kind,
                                MapEditorSubSelectionKind subKind);
    int getLastLayerAt(Position& position, MapEditorSelectionKind kind) const;
    MapElement * updateElementPosition(Position &previousPosition,
        MapEditorSelectionKind kind);

    void initializeVertices(int squareSize, QOpenGLTexture* tileset, QList<
        TextureSeveral *> &autotiles, QList<TextureSeveral *> &mountains, QHash<
        int, QOpenGLTexture *>& characters, QHash<int, QOpenGLTexture *> &walls,
        MapElement *elementExcludeSprite, MapElement *elementExcludeObject3D);
    void initializeVerticesObjects(int squareSize,
                                   QHash<int, QOpenGLTexture*>& characters,
                                   QOpenGLTexture *tileset);
    void initializeGL(QOpenGLShaderProgram *programStatic,
                      QOpenGLShaderProgram *programFace);
    void initializeGLObjects(QOpenGLShaderProgram *programStatic,
                             QOpenGLShaderProgram *programFace);
    void updateGL();
    void updateGLObjects();
    void paintFloors();
    void paintAutotiles(int textureID);
    void paintSprites(int uniformHovered);
    void paintSpritesWalls(int textureID);
    void paintFaceSprites(int uniformHovered);
    void paintObjects3D(int textureID, int uniformHovered);
    void paintMountains(int textureID);
    void paintObjectsStaticSprites(int textureID, QOpenGLTexture* texture);
    void paintObjectsFaceSprites(int textureID, QOpenGLTexture* texture);
    void paintObjectsSquares();

    void read(const QJsonObject &json);
    void write(QJsonObject &json) const;

private:
    Portion m_globalPortion;
    Lands *m_lands;
    Sprites *m_sprites;
    Objects3D *m_objects3D;
    Mountains *m_mountains;
    MapObjects *m_mapObjects;
    QHash<Position, MapElement*> m_previewSquares;
    QList<Position> m_previewDelete;
    SystemDetection *m_detection;
    bool m_isVisible;
    bool m_isEmpty;
};

#endif // MAPPORTION_H
