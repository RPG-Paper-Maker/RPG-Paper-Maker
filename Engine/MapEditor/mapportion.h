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

#include "floors.h"
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
    MapPortion();
    virtual ~MapPortion();
    MapObjects* mapObjects() const;
    bool isEmpty() const;
    LandDatas* getLand(Position& p);
    bool addLand(Position& p, LandDatas* land);
    bool deleteLand(Position& p);
    bool addSprite(Position& p, SpriteDatas* sprite);
    bool deleteSprite(Position& p);
    bool addObject(Position& p, SystemCommonObject* o);
    bool deleteObject(Position& p);

    void initializeVertices(int squareSize, QOpenGLTexture* tileset,
                            QHash<int, QOpenGLTexture*>& characters);
    void initializeGL(QOpenGLShaderProgram *programStatic,
                      QOpenGLShaderProgram *programFace);
    void updateGL();
    void paintFloors();
    void paintSprites();
    void paintFaceSprites();
    void paintObjectsSprites(int textureID, QOpenGLTexture* texture);
    void paintObjectsSquares();

    void read(const QJsonObject &json);
    void write(QJsonObject &json) const;

private:
    Floors* m_floors;
    Sprites* m_sprites;
    MapObjects* m_mapObjects;
};

#endif // MAPPORTION_H
