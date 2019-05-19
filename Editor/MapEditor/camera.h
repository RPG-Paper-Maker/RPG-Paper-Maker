/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
