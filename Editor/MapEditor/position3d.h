/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef POSITION3D_H
#define POSITION3D_H

#include "portion.h"

class MapProperties;

// -------------------------------------------------------
//
//  CLASS Position3D
//
//  A possible position of an element in the map.
//
// -------------------------------------------------------

class Position3D : public Portion
{
public:
    Position3D();
    Position3D(int x, int y, double yPlus, int z);
    virtual ~Position3D();

    bool operator==(const Position3D& other) const;
    bool operator!=(const Position3D& other) const;
    double yPlus() const;
    void setYPlus(double yPlus);
    int getY() const;
    int getYpx() const;
    void setCoords(int x, int y, double yPlus, int z);
    void setInGrid(Position3D &p, int w, int h);
    bool isOutMapPorperties(MapProperties& properties);
    void setCopy(const Position3D &position);

    virtual QString toString() const;

    void read(const QJsonArray &json);
    void write(QJsonArray & json) const;

protected:
    double m_y_plus;
};

inline uint qHash(const Position3D& pos)
{
   return static_cast<uint>(pos.x() + pos.y() + pos.yPlus() + pos.z());
}

#endif // POSITION3D_H
