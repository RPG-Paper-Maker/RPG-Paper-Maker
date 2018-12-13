/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef CAMERA_H
#define CAMERA_H

#include <QVector3D>
#include <QMatrix4x4>
#include "cursor.h"
#include "orientationkind.h"

// -------------------------------------------------------
//
//  CLASS Camera
//
//  The camera of the map editor.
//
// -------------------------------------------------------

class Camera
{
public:
    Camera();
    static int defaultDistance;
    static double defaultHAngle;
    static double defaultVAngle;

    QMatrix4x4 view() const;
    void setProjection(int width, int height);
    QMatrix4x4 projection() const;
    float positionX() const;
    float positionY() const;
    float positionZ() const;
    void getPosition(QVector3D& position) const;
    double horizontalAngle() const;
    double verticalAngle() const;
    int distance() const;
    void setDistance(int d);
    void setHorizontalAngle(double a);
    void setVerticalAngle(double a);
    void addDistance(int d);
    OrientationKind orientationKind() const;
    OrientationKind orientationFromTargetKind() const;
    bool cameraUp() const;
    bool cameraFront(const QVector3D &direction, int angle) const;
    void update(Cursor* cursor, int squareSize);
    void zoomPlus(int squareSize);
    void zoomLess(int squareSize);
    int getZoom(int squareSize) const;
    void onMouseWheelPressed(QPoint& mouse, QPoint& mouseBeforeUpdate);

private:
    int m_distance;
    double m_horizontalAngle;
    double m_verticalAngle;
    QVector3D m_position;
    QVector3D m_target;
    QVector3D m_up;
    QMatrix4x4 m_projection;
    QMatrix4x4 m_world;

    double getDistance() const;
    double getHeight() const;
};

#endif // CAMERA_H
