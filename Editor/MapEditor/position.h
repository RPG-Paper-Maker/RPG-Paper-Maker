/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef POSITION_H
#define POSITION_H

#include "position3d.h"
#include "axiskind.h"

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
    Position(const Position3D &pos);
    Position(const Position &pos);
    Position(int x, int y, double y_plus, int z, int layer = 0);
    Position(int x, int y, double y_plus, int z, int layer, int centerX,
             int centerZ, double angleY, double angleX = 0, double angleZ = 0);
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
    double angleY() const;
    void setAngleY(double a);
    void addAngleY(double a);
    double angleX() const;
    void setAngleX(double a);
    void addAngleX(double a);
    double angleZ() const;
    void setAngleZ(double a);
    void addAngleZ(double a);

    static double filterAngle(double a);

    bool isHorizontal() const;
    void setAngle(AxisKind ak, double a);
    void addAngle(AxisKind ak, double a);
    void setHorizontal();
    void setVertical();
    void setCurrent(Position& position) const;
    void getLeft(Position& position) const;
    void getRight(Position& position) const;
    void getTopLeft(Position& position) const;
    void getTopRight(Position& position) const;
    void getBotLeft(Position& position) const;
    void getBotRight(Position& position) const;
    int getCenterXPixels() const;
    int getCenterZPixels() const;

    virtual QString toString() const;

    void read(const QJsonArray &json);
    void write(QJsonArray & json) const;

protected:
    int m_layer;
    int m_centerX;
    int m_centerZ;
    double m_angleY;
    double m_angleX;
    double m_angleZ;

    void getStringLayerYPlus(QString& infos) const;
};

inline uint qHash(const Position& pos)
{
   return (pos.x() + pos.y() + pos.yPlus() + pos.z() + pos.layer()
           + pos.centerX() + pos.centerZ() + pos.angleY() + pos.angleX() + pos
           .angleZ());
}

#endif // POSITION_H
