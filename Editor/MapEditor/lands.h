/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef LANDS_H
#define LANDS_H

#include "land.h"
#include "floors.h"
#include "autotiles.h"

class MapPortion;

class Lands : public Serializable
{
public:
    Lands();
    virtual ~Lands();
    static QVector3D verticesQuad[];
    static GLuint indexesQuad[];
    static int nbVerticesQuad;
    static int nbIndexesQuad;

    bool isEmpty() const;
    void updateEmpty(bool preview);
    LandDatas* getLand(Position& p) const;
    void setLand(Position& p, LandDatas* land);
    LandDatas* removeLand(Position& p);
    bool addLand(Position& p, LandDatas* land, QJsonObject& previous,
                 MapEditorSubSelectionKind& previousType,
                 QSet<MapPortion *> &update, QSet<MapPortion *> &save);
    bool deleteLand(Position& p, QList<QJsonObject> &previous,
                    QList<MapEditorSubSelectionKind> &previousType,
                    QList<Position> &positions, QSet<MapPortion *> &update,
                    QSet<MapPortion *> &save, bool removeLayers = true);
    void removeLandOut(MapProperties& properties);
    MapElement *updateRaycasting(int squareSize, float& finalDistance, Position
        &finalPosition, QRay3D &ray, Position &previousCoords);
    MapElement* getMapElementAt(Position& position,
                                MapEditorSubSelectionKind subKind);
    int getLastLayerAt(Position& position) const;
    void updateRemoveLayer(Position& position, QList<QJsonObject> &previous,
                           QList<MapEditorSubSelectionKind> &previousType,
                           QList<Position> &positions,
                           QSet<MapPortion*>& update, QSet<MapPortion*>& save);
    void updateAutotiles(Position& position,
                         QHash<Position, MapElement *> &preview,
                         QSet<MapPortion*> &update, QSet<MapPortion*> &save,
                         QSet<MapPortion*> &previousPreview);

    void initializeVertices(QList<TextureSeveral *> &texturesAutotiles,
                            QHash<Position, MapElement*>& previewSquares,
                            int squareSize, int width, int height);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL();
    void paintAutotilesGL(int textureID);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    Floors* m_floors;
    Autotiles* m_autotiles;
    bool m_isEmpty;
};

#endif // LANDS_H
