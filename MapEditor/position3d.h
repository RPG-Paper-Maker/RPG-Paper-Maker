/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef POSITION3D_H
#define POSITION3D_H

#include "portion.h"

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
    Position3D(int x, int y, int yPlus, int z);
    virtual ~Position3D();

    bool operator==(const Position3D& other) const;
    bool operator!=(const Position3D& other) const;
    int yPlus() const;
    void setYPlus(int yPlus);
    int getY(int squareSize) const;
    int getYpx(int squareSize) const;
    void setCoords(int x, int y, int yPlus, int z);
    void setInGrid(Position3D &p, int w, int h);

    virtual QString toString() const;

    void read(const QJsonArray &json);
    void write(QJsonArray & json) const;

protected:
    int m_y_plus;
};

inline uint qHash(const Position3D& pos)
{
   return (pos.x() + pos.y() + pos.yPlus() + pos.z());
}

#endif // POSITION3D_H
