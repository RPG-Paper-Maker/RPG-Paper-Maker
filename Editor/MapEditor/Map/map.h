/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MAP_H
#define MAP_H

#include "mapportion.h"
#include "mapobjects.h"
#include "mapproperties.h"
#include "systemcommonobject.h"
#include "threadmapportionloader.h"
#include "cursor.h"
#include "textureseveral.h"
#include "skybox.h"

// -------------------------------------------------------
//
//  CLASS Map
//
//  The map of the map editor.
//
// -------------------------------------------------------

class Map : protected QOpenGLFunctions, QObject
{
public:
    Map();
    Map(int id);
    Map(MapProperties* properties, SystemDetection *detection);
    virtual ~Map();
    MapProperties* mapProperties() const;
    void setMapProperties(MapProperties* p);
    Cursor* cursor() const;
    Skybox * skybox() const;
    int squareSize() const;
    int portionsRay() const;
    bool saved() const;
    void setSaved(bool b);
    QStandardItemModel* modelObjects() const;
    bool needReloadObjects3DTextures() const;
    void setNeedReloadObjects3DTextures(bool b);

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
    QOpenGLTexture * textureMissing() const;
    QOpenGLShaderProgram * programFaceSprite() const;

    bool addObject(Position& p, MapPortion *mapPortion,
                   SystemCommonObject* object, QJsonObject &previous,
                   MapEditorSubSelectionKind &previousType);
    static int removeObject(QStandardItemModel* model, Position3D &p);
    bool deleteObject(Position& p, MapPortion *mapPortion,
                      QJsonObject &previous,
                      MapEditorSubSelectionKind &previousType);
    bool syncObjects(SystemCommonObject *object, Position &p);
    void addOverflowSprites(Position& p, Portion& portion);
    void removeOverflowSprites(Position& p, Portion& portion);
    void addOverflowObjects3D(Position& p, Portion& portion);
    void removeOverflowObjects3D(Position& p, Portion& portion);
    void addOverflowMountains(Position& p, Portion& portion);
    void removeOverflowMountains(Position& p, Portion& portion);

    void initializeCursor(QVector3D *position);
    void initializeSkybox();
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
    void checkNeedReloadTextures();
    void loadTextures();
    void deleteTextures();
    void deleteObjects3DTextures();
    void loadCharactersTextures();
    void loadPictures(PictureKind kind, QHash<int, QOpenGLTexture*>& textures);
    void deleteCharactersTextures();
    void loadSpecialPictures(PictureKind kind,
                             QHash<int, QOpenGLTexture*>& textures);
    static bool loadPicture(SystemPicture* picture, PictureKind kind, QImage
        &refImage);
    void loadObjects3D();
    void loadAutotiles();
    TextureSeveral *loadPictureAutotile(QPainter& painter, TextureSeveral* textureSeveral,
            QImage& newImage, SystemPicture* picture, int& offset, int id, bool isAnimated);
    static void editPictureWall(QImage& image, QImage& refImage);
    TextureSeveral *editPictureAutotile(QPainter& painter, TextureSeveral* textureSeveral,
            QImage& newImage, QImage& image, int& offset, int id, bool isAnimated);
    TextureSeveral * resetPictureAutotile(QPainter& painter, TextureSeveral
        *textureAutotile, QImage &newImage, int &offset);
    void paintPictureAutotile(QPainter& painter,
                              QImage& image, int& offset, QPoint &point);
    static void editPictureAutotilePreview(QImage& image, QImage& refImage, bool isAnimated);
    void loadMountains();
    TextureSeveral *loadPictureMountain(QPainter &painter, TextureSeveral
        *textureSeveral, QImage &newImage, SystemPicture *picture, int &offset,
        int id);
    TextureSeveral *editPictureMountain(QPainter &painter, TextureSeveral
        *textureSeveral, QImage& newImage, QImage& image, int& offset, int id);
    void paintPictureMountain(QPainter& painter, QImage& image, int& offset);
    int getMaxMountainOffsetTexture() const;
    void addEmptyPicture(QHash<int, QOpenGLTexture*>& textures);
    static QOpenGLTexture* createTexture(QImage& image);
    QString getPortionPath(int i, int j, int k);
    QString getPortionPathTemp(int i, int j, int k);
    MapPortion* loadPortionMap(int i, int j, int k, bool force = false);
    void savePortionMap(MapPortion* mapPortion);
    void saveMapProperties();
    QString getMapInfosPath() const;
    QString getMapObjectsPath() const;
    void loadPortion(int realX, int realY, int realZ, int x, int y, int z, bool
        visible);
    void loadPortionThread(MapPortion *mapPortion, QString &path);
    void replacePortion(Portion& previousPortion, Portion& newPortion,
                        bool visible);
    void updatePortion(MapPortion *mapPortion, MapElement *elementExcludeLand,
        MapElement *elementExcludeSprite, MapElement *elementExcludeObject3D);
    void updateAutotiles(int autotilesFrame);
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
    static bool isInGlobalPortion(Position3D &position, Portion& portion);
    void getLocalPortion(Position3D &position, Portion& portion) const;
    Portion getGlobalFromLocalPortion(Portion& portion) const;
    Portion getLocalFromGlobalPortion(Portion& portion) const;
    void save();
    bool isObjectIdExisting(int id) const;
    int generateObjectId() const;
    bool isOKPositionID(Position3D &p, int id) const;
    static QString generateObjectName(int id);
    QStandardItem * getAssociatedMapItem(QStandardItem *item = nullptr) const;

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
    static bool isMapIdExisting(int id);
    static int generateMapId();
    static QString generateMapName(int id);
    void setToNotSaved();

    void initializeGL();
    void paintFloors(QMatrix4x4 &modelviewProjection, int autotileFrame);
    void paintOthers(MapEditorSelectionKind selectionKind, QMatrix4x4 &modelviewProjection,
                     QVector3D& cameraRightWorldSpace,
                     QVector3D& cameraUpWorldSpace,
                     QVector3D &cameraDeepWorldSpace);

private:
    MapProperties *m_mapProperties;
    MapPortion **m_mapPortions;
    Cursor *m_cursor;
    Skybox *m_skybox;
    QStandardItemModel* m_modelObjects;
    QString m_pathMap;
    int m_portionsRay;
    int m_squareSize;
    bool m_saved;
    SystemDetection *m_detection;
    bool m_needReloadObjects3DTextures;

    // Static program
    QOpenGLShaderProgram *m_programStatic;
    int u_modelviewProjectionStatic;
    int u_hoveredStatic;

    // Face sprite program
    QOpenGLShaderProgram* m_programFaceSprite;
    int u_cameraRightWorldspace;
    int u_cameraUpWorldspace;
    int u_cameraDeepWorldspace;
    int u_modelViewProjection;
    int u_hoveredFace;
    int u_yOffset;

    // Textures
    QOpenGLTexture* m_textureTileset;
    QHash<int, QOpenGLTexture*> m_texturesCharacters;
    QHash<int, QOpenGLTexture*> m_texturesSpriteWalls;
    QHash<int, QOpenGLTexture*> m_texturesObjects3D;
    QList<TextureSeveral *> m_texturesAutotiles;
    QList<TextureSeveral *> m_texturesMountains;
    QOpenGLTexture *m_textureObjectSquare;
    QOpenGLTexture *m_textureMissing;
    QOpenGLTexture *m_textureDetection;
};

#endif // MAP_H
