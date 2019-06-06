/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef MAPPORTION_H
#define MAPPORTION_H

#include "lands.h"
#include "sprites.h"
#include "mapobjects.h"
#include "systemcommonobject.h"
#include <QOpenGLTexture>

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
    MapPortion(Portion& globalPortion);
    virtual ~MapPortion();
    void getGlobalPortion(Portion& portion);
    MapObjects* mapObjects() const;
    bool isVisibleLoaded() const;
    bool isVisible() const;
    void setIsVisible(bool b);
    bool isEmpty() const;
    void updateEmpty();
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
                      QList<Position>& positions);
    bool addSpriteWall(Position& position, SpriteWallDatas *sprite,
                       QJsonObject &previous,
                       MapEditorSubSelectionKind &previousType);
    bool deleteSpriteWall(Position& position, QJsonObject &previous,
                          MapEditorSubSelectionKind &previousType);
    void updateAutotiles(Position& position, QSet<MapPortion*> &update,
                         QSet<MapPortion*> &save,
                         QSet<MapPortion*> &previousPreview);
    void updateSpriteWalls();
    SpriteWallDatas* getWallAt(Position& position);
    void fillWithFloor();
    bool addObject(Position& p, SystemCommonObject* o, QJsonObject &previous,
                   MapEditorSubSelectionKind &previousType);
    bool deleteObject(Position& p, QJsonObject &previous,
                      MapEditorSubSelectionKind &previousType);
    void addOverflow(Position& p);
    void removeOverflow(Position& p);
    void removeLandOut(MapProperties& properties);
    void removeSpritesOut(MapProperties& properties);
    void removeObjectsOut(QList<int>& listDeletedObjectsIDs,
                          MapProperties& properties);
    void clearPreview();
    void addPreview(Position& p, MapElement* element);
    void addPreviewDelete(Position& p);
    MapElement* updateRaycastingLand(int squareSize, float& finalDistance,
        Position &finalPosition, QRay3D& ray, Position &previousCoords);
    MapElement* updateRaycastingSprites(int squareSize, float& finalDistance,
                                        Position &finalPosition,
                                        QRay3D& ray, double cameraHAngle,
                                        bool layerOn);
    MapElement* updateRaycastingObjects(int squareSize, float& finalDistance,
                                        Position &finalPosition,
                                        QRay3D& ray);
    MapElement* updateRaycastingOverflowSprite(int squareSize,
                                               Position& position,
                                               float &finalDistance,
                                               Position &finalPosition,
                                               QRay3D& ray,
                                               double cameraHAngle);
    MapElement* getMapElementAt(Position& position,
                                MapEditorSelectionKind kind,
                                MapEditorSubSelectionKind subKind);
    int getLastLayerAt(Position& position, MapEditorSelectionKind kind) const;

    void initializeVertices(int squareSize, QOpenGLTexture* tileset,
                            QList<TextureAutotile *> &autotiles,
                            QHash<int, QOpenGLTexture*>& characters,
                            QHash<int, QOpenGLTexture *> &walls);
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
    void paintSprites();
    void paintSpritesWalls(int textureID);
    void paintFaceSprites();
    void paintObjectsStaticSprites(int textureID, QOpenGLTexture* texture);
    void paintObjectsFaceSprites(int textureID, QOpenGLTexture* texture);
    void paintObjectsSquares();

    void read(const QJsonObject &json);
    void write(QJsonObject &json) const;

private:
    Portion m_globalPortion;
    Lands* m_lands;
    Sprites* m_sprites;
    MapObjects* m_mapObjects;
    QHash<Position, MapElement*> m_previewSquares;
    QList<Position> m_previewDelete;
    bool m_isVisible;
    bool m_isEmpty;
};

#endif // MAPPORTION_H
