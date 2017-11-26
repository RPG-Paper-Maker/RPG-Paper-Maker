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

#ifndef LANDS_H
#define LANDS_H

#include "land.h"
#include "floors.h"

class Lands : public Serializable
{
public:
    Lands();
    virtual ~Lands();

    bool isEmpty() const;
    LandDatas* getLand(Position& p);
    bool addLand(Position& p, LandDatas* land);
    bool deleteLand(Position& p);
    void removeLandOut(MapProperties& properties);
    MapElement *updateRaycasting(int squareSize, float& finalDistance,
                                 Position &finalPosition, QRay3D &ray);
    MapElement* getMapElementAt(Position& position,
                                MapEditorSubSelectionKind subKind);
    int getLastLayerAt(Position& position, MapEditorSubSelectionKind subKind);

    void initializeVertices(QHash<Position, MapElement*>& previewSquares,
                            int squareSize, int width, int height);
    void initializeGL(QOpenGLShaderProgram* programStatic);
    void updateGL();
    void paintGL();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    Floors* m_floors;
};

#endif // LANDS_H
