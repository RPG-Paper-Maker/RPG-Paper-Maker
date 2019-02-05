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
    MapElement *updateRaycasting(int squareSize, float& finalDistance,
                                 Position &finalPosition, QRay3D &ray);
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
};

#endif // LANDS_H
