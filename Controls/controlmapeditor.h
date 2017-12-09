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

#ifndef CONTROLMAPEDITOR_H
#define CONTROLMAPEDITOR_H

#include <QMouseEvent>
#include "map.h"
#include "grid.h"
#include "camera.h"
#include "mapeditorselectionkind.h"
#include "mapeditorsubselectionkind.h"
#include "drawkind.h"
#include "contextmenulist.h"
#include "wallindicator.h"
#include "controlundoredo.h"

// -------------------------------------------------------
//
//  CLASS ControlMapEditor
//
//  The controler of the map editor. This part is handling the mouse
//  effects (adding/removing items from the map) and loading/saving
//  map.
//
// -------------------------------------------------------

class ControlMapEditor
{
public:
    ControlMapEditor();
    virtual ~ControlMapEditor();
    Map* map() const;
    Grid* grid() const;
    Cursor* cursor() const;
    Cursor* cursorObject() const;
    Camera* camera() const;
    bool displaySquareInformations() const;
    void setContextMenu(ContextMenuList* m);
    void setTreeMapNode(QStandardItem* item);
    void moveCursorToMousePosition(QPoint point, bool layerOn);
    void updateCameraTreeNode();
    void initialize();
    void reLoadTextures();
    Map* loadMap(int idMap, QVector3D *position, QVector3D *positionObject,
                 int cameraDistance, double cameraHorizontalAngle,
                 double cameraVerticalAngle);
    void deleteMap(bool updateCamera = true);
    void onResize(int width, int height);

    void update(MapEditorSubSelectionKind subSelection, bool layerOn);
    void updateMouse(QPoint point, bool layerOn);
    void updateMousePosition(QPoint point);
    bool mousePositionChanged(QPoint point);
    void updateRaycasting(bool layerOn);
    void getPortionsInRay(QList<Portion>& portions);
    void updatePortionsInRay(QList<Portion>& portions,
                             QList<Portion> &adjacents);
    void updateRaycastingLand(MapPortion*mapPortion);
    void updateRaycastingSprites(MapPortion *mapPortion,
                                 bool layerOn);
    QVector3D transformToNormalizedCoords(const QPoint& mouse);
    QVector4D transformToHomogeneousClip(QVector3D& normalized);
    QVector4D transformToEyeCoords(QVector4D& rayClip, QMatrix4x4& projection);
    QVector3D transformToWorldCoords(QVector4D& rayEye, QMatrix4x4& view);
    QVector3D getRayWorld(const QPoint& mouse, QMatrix4x4& projection,
                          QMatrix4x4& view);
    QVector3D getPositionOnRay(QVector3D& ray, int distance);
    void getCorrectPositionOnRay(Position& position, QVector3D &ray,
                                 int distance, bool accurate = false);

    void updateWallIndicator();
    void updatePreviewElements(MapEditorSelectionKind kind,
                               MapEditorSubSelectionKind subKind,
                               DrawKind drawKind, bool layerOn, QRect &tileset,
                               int specialID);
    void removePreviewElements();
    void updatePreviewFloors(MapEditorSelectionKind kind,
                             MapEditorSubSelectionKind subKind,
                             bool up, bool layerOn,
                             QRect& tileset, Position& position);
    void getWallSpritesPositions(QList<Position> &positions);
    void updatePreviewWallSprites(int specialID);
    void updatePreviewWallSprite(Position &position, int specialID);
    void updatePreviewOthers(MapEditorSelectionKind kind,
                             MapEditorSubSelectionKind subKind, bool front,
                             bool layerOn, QRect& tileset, int xOffset,
                             int yOffset, int zOffset);
    void updatePreviewElement(Position& p, Portion &portion,
                              MapElement* element);
    void updatePreviewElementGrid(Position &p, Portion &portion,
                                  MapElement* element);
    void updateMovingPortions();
    void updateMovingPortionsEastWest(Portion& newPortion);
    void updateMovingPortionsNorthSouth(Portion& newPortion);
    void updateMovingPortionsUpDown(Portion&);
    void removePortion(int i, int j, int k);
    void setPortion(int i, int j, int k, int m, int n, int o, bool visible);
    void loadPortion(Portion& currentPortion, int i, int j, int k);
    void updatePortions(MapEditorSubSelectionKind subSelection);
    void saveTempPortions();
    void clearPortionsToUpdate();
    void setToNotSaved();
    void save();

    void addRemove(MapEditorSelectionKind selection,
                   MapEditorSubSelectionKind subSelection, DrawKind drawKind,
                   bool layerOn, QRect& tileset, int specialID);
    MapElement* getPositionSelected(
            Position &position, MapEditorSelectionKind selection,
            MapEditorSubSelectionKind subSelection, bool layerOn,
            bool isForDisplay = false) const;
    void add(MapEditorSelectionKind selection,
             MapEditorSubSelectionKind subSelection, DrawKind drawKind,
             bool layerOn, QRect& tileset, int specialID, Position& p);
    void remove(MapElement* element, MapEditorSelectionKind selection,
                DrawKind drawKind, Position& p, bool layerOn);
    void addFloor(Position& p, MapEditorSubSelectionKind kind,
                  DrawKind drawKind, bool layerOn, QRect& tileset,
                  int specialID);
    void paintPinLand(Position& p, MapEditorSubSelectionKind kindAfter,
                      QRect &textureAfter, bool layerOn);
    LandDatas* getLand(Portion& portion, Position& p);
    void getFloorTextureReduced(QRect &rect, QRect& rectAfter,
                                int localX, int localZ);
    bool areLandsEquals(LandDatas* landBefore,
                        QRect &textureAfter,
                        MapEditorSubSelectionKind kindAfter);
    LandDatas* getLandAfter(MapEditorSubSelectionKind kindAfter,
                            QRect &textureAfter);
    void getLandTexture(QRect& rect, LandDatas* land);
    void stockLand(Position& p, LandDatas* landDatas,
                   MapEditorSubSelectionKind kind, bool layerOn,
                   bool undoRedo = false);
    void removeLand(Position& p, DrawKind drawKind, bool layerOn);
    void eraseLand(Position& p, bool undoRedo = false);
    void addSprite(Position& p, MapEditorSubSelectionKind kind, DrawKind drawKind,
            bool layerOn, QRect& tileset);
    SpriteDatas *getCompleteSprite(MapEditorSubSelectionKind kind, int xOffset,
                                   int yOffset, int zOffset, QRect& tileset,
                                   bool front, bool layerOn) const;
    void addSpriteWall(DrawKind drawKind, int specialID);
    void stockSprite(Position& p, SpriteDatas *sprite,
                     MapEditorSubSelectionKind kind, bool layerOn);
    void stockSpriteWall(Position& position, int specialID);
    void removeSprite(Position& p, DrawKind drawKind);
    void removeSpriteWall(DrawKind drawKind);
    void eraseSprite(Position& p);
    void eraseSpriteWall(Position& position);
    void setCursorObjectPosition(Position& p);
    void showObjectMenuContext();
    void defineAsHero();
    void addObject(Position& p);
    void updateMapObjects();
    void removeObject(Position& p);
    void updatePortionsToSaveOverflow(QSet<Portion>& portionsOverflow);
    void traceLine(Position& previousCoords, Position& coords,
                   QList<Position>& positions);
    bool isTinPaintPossible(MapEditorSelectionKind selection,
                            DrawKind drawKind, QString& messageError) const;
    int getLayer(MapPortion* mapPortion, float d, Position& p, bool layerOn,
                 MapEditorSelectionKind kind,
                 MapEditorSubSelectionKind subKind);
    void updatePositionLayer(Position& p, bool layerOn);
    bool isPutLayerPossible(MapEditorSubSelectionKind subSelectionCurrent,
                            DrawKind drawKind, bool layerOn,
                            QString& messageError) const;
    void showHideGrid();
    void showHideSquareInformations();
    void undo();
    void redo();
    void undoRedo(QJsonArray& states, bool reverseAction);
    void performUndoRedoAction(MapEditorSubSelectionKind kind, bool before,
                               QJsonObject& obj, Position &position);

    void deleteTempUndoRedo();
    QString getSquareInfos(MapEditorSelectionKind kind,
                           MapEditorSubSelectionKind subKind, bool layerOn);

    void paintGL(QMatrix4x4& modelviewProjection,
                 QVector3D& cameraRightWorldSpace,
                 QVector3D& cameraUpWorldSpace,
                 QVector3D& cameraDeepWorldSpace,
                 MapEditorSelectionKind selectionKind,
                 MapEditorSubSelectionKind subSelectionKind, DrawKind drawKind);

    void onMouseWheelMove(QWheelEvent *event, bool updateTree = true);
    void onMouseMove(QPoint point, Qt::MouseButton button,
                     bool updateTree = true);
    void onMousePressed(MapEditorSelectionKind selection,
                        MapEditorSubSelectionKind subSelection,
                        DrawKind drawKind, bool layerOn, QRect& tileset,
                        int specialID, QPoint point, Qt::MouseButton button);
    void onMouseReleased(MapEditorSelectionKind, MapEditorSubSelectionKind,
                         DrawKind drawKind, QRect &,
                         int specialID,  QPoint, Qt::MouseButton button);
    void onKeyPressed(int k, double speed);
    void onKeyReleased(int);

private:
    ControlUndoRedo m_controlUndoRedo;
    QJsonArray m_changes;

    // Widgets
    Map* m_map;
    Grid* m_grid;
    WallIndicator* m_beginWallIndicator;
    WallIndicator* m_endWallIndicator;
    Cursor* m_cursorObject;
    Camera* m_camera;

    // Others
    int m_width;
    int m_height;
    QPoint m_mouse;
    QPoint m_mouseMove;
    QPoint m_mouseBeforeUpdate;
    QRay3D m_ray;
    Position m_positionOnPlane;
    Position m_positionOnPlaneWallIndicator;
    Position m_positionOnLand;
    Position m_positionOnSprite;
    Position m_positionRealOnSprite;
    MapElement* m_elementOnLand;
    MapElement* m_elementOnSprite;
    float m_distancePlane;
    float m_distanceLand;
    float m_distanceSprite;
    Position m_positionPreviousPreview;
    QSet<MapPortion*> m_portionsPreviousPreview;
    bool m_isGridOnTop;
    Position m_previousMouseCoords;
    Portion m_currentPortion;
    QSet<MapPortion*> m_portionsToUpdate;
    QSet<MapPortion*> m_portionsToSave;
    bool m_needMapInfosToSave;
    bool m_needMapObjectsUpdate;
    bool m_displayGrid;
    bool m_displaySquareInformations;
    QStandardItem* m_treeMapNode;
    SystemCommonObject* m_selectedObject;
    ContextMenuList* m_contextMenu;
    bool m_isDrawingWall;
    bool m_isDeletingWall;
    bool m_isDeleting;
    int m_currentLayer = -1;
};

#endif // CONTROLMAPEDITOR_H
