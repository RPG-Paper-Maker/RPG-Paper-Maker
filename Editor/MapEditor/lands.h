/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

    void initializeVertices(QList<TextureAutotile *> &texturesAutotiles,
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
