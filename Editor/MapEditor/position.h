/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef POSITION_H
#define POSITION_H

#include "position3d.h"

// -------------------------------------------------------
//
//  CLASS Position
//
//  A possible position of an element in the map (taking layer
//  into account).
//
// -------------------------------------------------------

class Position : public Position3D
{
public:
    Position();
    Position(int x, int y, double y_plus, int z, int layer = 0);
    Position(int x, int y, double y_plus, int z, int layer, int centerX,
             int centerZ, int angle);
    virtual ~Position();

    bool operator==(const Position& other) const;
    bool operator!=(const Position& other) const;
    void setX(int x);
    void setZ(int z);
    void setCoords(int x, int y, double y_plus, int z);
    int layer() const;
    void setLayer(int l);
    int centerX() const;
    void setCenterX(int x);
    int centerZ() const;
    void setCenterZ(int z);
    int angle() const;
    void setAngle(int a);

    bool isHorizontal() const;
    void setHorizontal();
    void setVertical();
    void setCurrent(Position& position) const;
    void getLeft(Position& position) const;
    void getRight(Position& position) const;
    void getTopLeft(Position& position) const;
    void getTopRight(Position& position) const;
    void getBotLeft(Position& position) const;
    void getBotRight(Position& position) const;

    virtual QString toString(int squareSize) const;

    void read(const QJsonArray &json);
    void write(QJsonArray & json) const;

protected:
    int m_layer;
    int m_centerX;
    int m_centerZ;
    int m_angle;

    void getStringLayerYPlus(QString& infos, int squareSize) const;
};

inline uint qHash(const Position& pos)
{
   return (pos.x() + pos.y() + pos.yPlus() + pos.z() + pos.layer()
           + pos.centerX() + pos.centerZ() + pos.angle());
}

#endif // POSITION_H
