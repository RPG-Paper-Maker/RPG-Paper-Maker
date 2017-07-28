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

#ifndef MAP_H
#define MAP_H

#include <QOpenGLTexture>
#include "portion.h"
#include "mapportion.h"
#include "mapobjects.h"
#include "mapproperties.h"
#include "systemcommonobject.h"

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
    int squareSize() const;
    int portionsRay() const;
    bool saved() const;
    void setSaved(bool b);
    QStandardItemModel* modelObjects() const;

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
    void loadTextures();
    void deleteTextures();
    MapPortion* mapPortion(Portion& p) const;
    MapPortion* mapPortion(int x, int y, int z) const;
    MapPortion* mapPortionBrut(int index) const;
    int portionIndex(int x, int y, int z) const;
    int getMapPortionSize() const;
    int getMapPortionTotalSize() const;
    void setMapPortion(int x, int y, int z, MapPortion *mapPortion);
    void setMapPortion(Portion& p, MapPortion *mapPortion);
    MapPortion* createMapPortion(Portion& p);
    MapObjects* objectsPortion(Portion& p);
    MapObjects* objectsPortion(int x, int y, int z);
    bool addObject(Position& p, MapPortion *mapPortion,
                   SystemCommonObject* object);
    static int removeObject(QStandardItemModel* model,
                            SystemCommonObject *object);
    bool deleteObject(Position& p, MapPortion *mapPortion,
                      SystemCommonObject *object);
    QString getPortionPath(int i, int j, int k);
    QString getPortionPathTemp(int i, int j, int k);
    MapPortion* loadPortionMap(int i, int j, int k);
    void savePortionMap(MapPortion* mapPortion, Portion &portion);
    QString getMapInfosPath() const;
    QString getMapObjectsPath() const;
    void loadPortion(int realX, int realY, int realZ, int x, int y, int z);
    void replacePortion(Portion& previousPortion, Portion& newPortion);
    void updatePortion(Portion& p);
    void loadPortions(Portion portion);
    void deletePortions();
    bool isInGrid(Position& position) const;
    bool isInPortion(Portion& portion, int offset = 0) const;
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
                     QVector3D& cameraUpWorldSpace);

private:
    MapProperties* m_mapProperties;
    MapPortion** m_mapPortions;
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
    int u_modelViewProjection;

    // Textures
    QOpenGLTexture* m_textureTileset;
    QHash<int, QOpenGLTexture*> m_texturesCharacters;
    QOpenGLTexture* m_textureObjectSquare;
};

#endif // MAP_H
