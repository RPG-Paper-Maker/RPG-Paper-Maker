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

#ifndef AUTOTILES_H
#define AUTOTILES_H

#include <QOpenGLFunctions>
#include "autotile.h"
#include "mapproperties.h"

// -------------------------------------------------------
//
//  CLASS Autotiles
//
//  Autotiles grouped that are having the same texture.
//
// -------------------------------------------------------

class Autotiles : public Serializable, protected QOpenGLFunctions
{
public:
    Autotiles();
    virtual ~Autotiles();
    static QHash<QString, int> initializeAutotileBorder();
    static QHash<QString, int> autotileBorder;
    static const int COUNT_LIST;
    static QString listA[];
    static QString listB[];
    static QString listC[];
    static QString listD[];

    bool isEmpty() const;
    AutotileDatas* getAutotile(Position& p) const;
    void setAutotile(Position& p, AutotileDatas* autotile);
    AutotileDatas* removeAutotile(Position& p);
    bool addAutotile(Position& p, AutotileDatas* autotile,
                     QJsonObject &previousObj,
                     MapEditorSubSelectionKind& previousType);
    bool deleteAutotile(Position& p, QJsonObject &previous,
                        MapEditorSubSelectionKind &previousType);

    void removeAutotileOut(MapProperties& properties);
    MapElement *updateRaycasting(int squareSize, float& finalDistance,
                                 Position &finalPosition, QRay3D &ray);
    bool updateRaycastingAt(Position &position, AutotileDatas *autotile,
                            int squareSize, float &finalDistance,
                            Position &finalPosition, QRay3D& ray);
    int getLastLayerAt(Position& position) const;
    void updateRemoveLayer(Position& position, QList<QJsonObject> &previous,
                           QList<MapEditorSubSelectionKind> &previousType,
                           QList<Position> &positions);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QHash<Position, AutotileDatas*> m_all;
};

#endif // AUTOTILES_H
