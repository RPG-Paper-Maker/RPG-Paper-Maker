/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef HEIGHT_H
#define HEIGHT_H

#include <QJsonArray>

// -------------------------------------------------------
//
//  CLASS Height
//
//  A possible height of an element in the map.
//
// -------------------------------------------------------

class Height
{
public:
    Height();
    Height(int y, int y_plus);

    bool operator==(const Height& other) const;
    bool operator!=(const Height& other) const;
    int y() const;
    int yPlus() const;
    int getY(int squareSize) const;

    void read(const QJsonArray &json);
    void write(QJsonArray & json) const;

protected:
    int m_y;
    int m_y_plus;
};

inline uint qHash(const Height& pos)
{
   return (pos.y() + pos.yPlus());
}

#endif // HEIGHT_H
