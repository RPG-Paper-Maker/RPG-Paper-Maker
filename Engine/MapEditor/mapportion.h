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
    bool isLoaded() const;
    void setIsVisible(bool b);
    void setIsLoaded(bool b);
    bool isEmpty() const;
    LandDatas* getLand(Position& p);
    bool addLand(Position& p, LandDatas* land);
    bool deleteLand(Position& p);
    bool addSprite(QSet<Portion>& portionsOverflow, Position& p,
                   SpriteDatas *sprite);
    bool deleteSprite(QSet<Portion>& portionsOverflow, Position& p);
    bool addSpriteWall(GridPosition& gridPosition, int specialID);
    bool deleteSpriteWall(GridPosition& gridPosition);
    void updateSpriteWalls();
    SpriteWallDatas* getWallAt(GridPosition& gridPosition);
    bool addObject(Position& p, SystemCommonObject* o);
    bool deleteObject(Position& p);
    void addOverflow(Position& p);
    void removeOverflow(Position& p);
    void removeLandOut(MapProperties& properties);
    void removeSpritesOut(MapProperties& properties);
    void removeObjectsOut(QList<int>& listDeletedObjectsIDs,
                          MapProperties& properties);
    void clearPreview();
    void addPreview(Position& p, MapElement* element);
    void addPreviewGrid(GridPosition& p, MapElement* element);
    void addPreviewDeleteGrid(GridPosition& p);
    MapElement* updateRaycastingLand(int squareSize, float& finalDistance,
                                     Position &finalPosition, QRay3D& ray);
    MapElement* updateRaycastingSprites(int squareSize, float& finalDistance,
                                        Position &finalPosition,
                                        GridPosition &finalGridPosition,
                                        QRay3D& ray, double cameraHAngle,
                                        bool layerOn);
    MapElement* updateRaycastingOverflowSprite(int squareSize,
                                               Position& position,
                                               float &finalDistance,
                                               Position &finalPosition,
                                               QRay3D& ray,
                                               double cameraHAngle);
    MapElement* getMapElementAt(Position& position,
                                MapEditorSelectionKind kind,
                                MapEditorSubSelectionKind subKind);
    int getLastLayerAt(Position& position, MapEditorSelectionKind kind,
                       MapEditorSubSelectionKind subKind) const;
    void updateRemoveLayer(QSet<Portion> portionsOverflow, Position& position,
                           MapEditorSelectionKind kind);

    void initializeVertices(int squareSize, QOpenGLTexture* tileset,
                            QHash<int, QOpenGLTexture*>& characters,
                            QHash<int, QOpenGLTexture *> &walls);
    void initializeVerticesObjects(int squareSize,
                                   QHash<int, QOpenGLTexture*>& characters);
    void initializeGL(QOpenGLShaderProgram *programStatic,
                      QOpenGLShaderProgram *programFace);
    void initializeGLObjects(QOpenGLShaderProgram *programStatic,
                             QOpenGLShaderProgram *programFace);
    void updateGL();
    void updateGLObjects();
    void paintFloors();
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
    QHash<GridPosition, MapElement*> m_previewGrid;
    QList<GridPosition> m_previewDeleteGrid;
    bool m_isVisible;
    bool m_isLoaded;
};

#endif // MAPPORTION_H
