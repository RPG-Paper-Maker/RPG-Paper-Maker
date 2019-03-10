/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef MAP_H
#define MAP_H

#include "mapportion.h"
#include "mapobjects.h"
#include "mapproperties.h"
#include "systemcommonobject.h"
#include "threadmapportionloader.h"
#include "cursor.h"
#include "textureautotile.h"

// -------------------------------------------------------
//
//  CLASS Map
//
//  The map of the map editor.
//
// -------------------------------------------------------

class Map : protected QOpenGLFunctions
{
public:
    Map();
    Map(int id);
    Map(MapProperties* properties);
    virtual ~Map();
    MapProperties* mapProperties() const;
    void setMapProperties(MapProperties* p);
    Cursor* cursor() const;
    int squareSize() const;
    int portionsRay() const;
    bool saved() const;
    void setSaved(bool b);
    QStandardItemModel* modelObjects() const;
    MapPortion* mapPortion(Portion& p) const;
    MapPortion* mapPortionFromGlobal(Portion& p) const;
    MapPortion* mapPortion(int x, int y, int z) const;
    MapPortion* mapPortionBrut(int index) const;
    int portionIndex(int x, int y, int z) const;
    int getMapPortionSize() const;
    int getMapPortionTotalSize() const;
    void setMapPortion(int x, int y, int z, MapPortion *mapPortion);
    void setMapPortion(Portion& p, MapPortion *mapPortion);
    MapObjects* objectsPortion(Portion& p);
    MapObjects* objectsPortion(int x, int y, int z);


    bool addObject(Position& p, MapPortion *mapPortion,
                   SystemCommonObject* object, QJsonObject &previous,
                   MapEditorSubSelectionKind &previousType);
    static int removeObject(QStandardItemModel* model, Position3D &p);
    bool deleteObject(Position& p, MapPortion *mapPortion,
                      QJsonObject &previous,
                      MapEditorSubSelectionKind &previousType);
    void addOverflow(Position& p, Portion& portion);
    void removeOverflow(Position& p, Portion& portion);

    void initializeCursor(QVector3D *position);
    static void writeNewMap(QString path, MapProperties& properties);
    static void correctMap(QString path, MapProperties &previousProperties,
                           MapProperties& properties);
    static void writeEmptyMap(QString path, int i, int j, int k);
    static void deleteCompleteMap(QString path, int i, int j, int k);
    static void deleteObjects(QStandardItemModel* model, int minI, int maxI,
                              int minJ, int maxJ, int minK, int maxK);
    static void deleteObjectsByID(QStandardItemModel* model,
                                  QList<int> &listDeletedObjectsIDs);
    static void deleteMapElements(QList<int> &listDeletedObjectsIDs,
                                  QString path, int i, int j, int k,
                                  MapProperties& properties);
    static void writeDefaultMap(QString path);
    static int writeDefaultBattleMap(QString path);
    static QString writeMap(QString path, MapProperties& properties,
                            QJsonArray &jsonObject);
    static QString getPortionPathMap(int i, int j, int k);
    static void setModelObjects(QStandardItemModel* model);

    static void updateGLStatic(QOpenGLBuffer& vertexBuffer,
                               QOpenGLBuffer& indexBuffer,
                               QVector<Vertex>& vertices,
                               QVector<GLuint>& indexes,
                               QOpenGLVertexArrayObject& vao,
                               QOpenGLShaderProgram* program);
    static void updateGLFace(QOpenGLBuffer& vertexBuffer,
                             QOpenGLBuffer& indexBuffer,
                             QVector<VertexBillboard>& vertices,
                             QVector<GLuint>& indexes,
                             QOpenGLVertexArrayObject& vao,
                             QOpenGLShaderProgram* program);
    static QOpenGLShaderProgram* createProgram(QString shaderName);
    void loadTextures();
    void deleteTextures();
    void loadCharactersTextures();
    void loadPictures(PictureKind kind, QHash<int, QOpenGLTexture*>& textures);
    void deleteCharactersTextures();
    void loadSpecialPictures(PictureKind kind,
                             QHash<int, QOpenGLTexture*>& textures);
    void loadPicture(SystemPicture* picture, PictureKind kind, QImage &refImage);
    void loadAutotiles();
    TextureAutotile *loadPictureAutotile(
            QPainter& painter, TextureAutotile* textureAutotile,
            QImage& newImage, SystemPicture* picture, int& offset, int id);
    static void editPictureWall(QImage& image, QImage& refImage);
    TextureAutotile *editPictureAutotile(
            QPainter& painter, TextureAutotile* textureAutotile,
            QImage& newImage, QImage& image, int& offset, int id);
    void paintPictureAutotile(QPainter& painter,
                              QImage& image, int& offset, QPoint &point);
    static void editPictureAutotilePreview(QImage& image, QImage& refImage);
    void addEmptyPicture(QHash<int, QOpenGLTexture*>& textures);
    QOpenGLTexture* createTexture(QImage& image);
    QString getPortionPath(int i, int j, int k);
    QString getPortionPathTemp(int i, int j, int k);
    MapPortion* loadPortionMap(int i, int j, int k, bool force = false);
    void savePortionMap(MapPortion* mapPortion);
    void saveMapProperties();
    QString getMapInfosPath() const;
    QString getMapObjectsPath() const;
    void loadPortion(int realX, int realY, int realZ, int x, int y, int z,
                     bool visible);
    void loadPortionThread(MapPortion *portion);
    void replacePortion(Portion& previousPortion, Portion& newPortion,
                        bool visible);
    void updatePortion(MapPortion *mapPortion);
    void updateSpriteWalls(MapEditorSubSelectionKind subSelection);
    void updateMapObjects();
    void loadPortions(Portion portion);
    void deletePortions();
    bool isInGrid(Position3D& position, int offset = 0) const;
    bool isPortionInGrid(Portion& portion) const;
    bool isInPortion(Portion& portion, int offset = -1) const;
    bool isInSomething(Position3D& position, Portion& portion,
                       int offset = -1) const;
    static void getGlobalPortion(Position3D &position, Portion& portion);
    void getLocalPortion(Position3D &position, Portion& portion) const;
    Portion getGlobalFromLocalPortion(Portion& portion) const;
    Portion getLocalFromGlobalPortion(Portion& portion) const;
    void save();
    bool isObjectIdExisting(int id) const;
    int generateObjectId() const;
    static QString generateObjectName(int id);


    void readObjects();
    static void loadObjects(QStandardItemModel *model, QString pathMap,
                            bool temp);
    void writeObjects(bool temp = false) const;
    static void saveObjects(QStandardItemModel *model, QString pathMap,
                            bool temp);
    static void readJSONArray(QStandardItemModel* model,
                              const QJsonArray & tab);
    static void writeJSONArray(QStandardItemModel* model,
                               QJsonArray & tab);

    void initializeGL();
    void paintFloors(QMatrix4x4 &modelviewProjection);
    void paintOthers(QMatrix4x4 &modelviewProjection,
                     QVector3D& cameraRightWorldSpace,
                     QVector3D& cameraUpWorldSpace,
                     QVector3D &cameraDeepWorldSpace);

private:
    QList<ThreadMapPortionLoader> m_threadMapPortionLoaders;
    MapProperties* m_mapProperties;
    MapPortion** m_mapPortions;
    Cursor* m_cursor;
    QStandardItemModel* m_modelObjects;
    QString m_pathMap;
    int m_portionsRay;
    int m_squareSize;
    bool m_saved;

    // Static program
    QOpenGLShaderProgram* m_programStatic;
    int u_modelviewProjectionStatic;

    // Face sprite program
    QOpenGLShaderProgram* m_programFaceSprite;
    int u_cameraRightWorldspace;
    int u_cameraUpWorldspace;
    int u_cameraDeepWorldspace;
    int u_modelViewProjection;

    // Textures
    QOpenGLTexture* m_textureTileset;
    QHash<int, QOpenGLTexture*> m_texturesCharacters;
    QHash<int, QOpenGLTexture*> m_texturesSpriteWalls;
    QList<TextureAutotile*> m_texturesAutotiles;
    QOpenGLTexture* m_textureObjectSquare;
};

#endif // MAP_H
