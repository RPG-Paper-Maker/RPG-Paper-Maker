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

#include "camera.h"
#include <QtMath>

int Camera::defaultDistance = 800;
double Camera::defaultHAngle = -90.0;
double Camera::defaultVAngle = 55.0;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Camera::Camera() :
    m_horizontalAngle(Camera::defaultHAngle),
    m_verticalAngle(Camera::defaultVAngle),
    m_up(QVector3D(0.0,1.0,0.0))
{}

QMatrix4x4 Camera::view() const{
    QMatrix4x4 m;
    m.lookAt(m_position, m_target, m_up);

    return m;
}

void Camera::setProjection(int width, int height){
    m_projection.setToIdentity();
    m_projection.perspective(45.0f, width / float(height), 1.0f, 100000.0f);
}

QMatrix4x4 Camera::projection() const { return m_projection; }

float Camera::positionX() const { return m_position.x(); }

float Camera::positionY() const { return m_position.y(); }

float Camera::positionZ() const { return m_position.z(); }

void Camera::getPosition(QVector3D& position) const {
    position.setX(positionX());
    position.setY(positionY());
    position.setZ(positionZ());
}

double Camera::horizontalAngle() const { return m_horizontalAngle; }

double Camera::verticalAngle() const { return m_verticalAngle; }

int Camera::distance() const { return m_distance; }

void Camera::setDistance(int d){ m_distance = d; }

void Camera::setHorizontalAngle(double a) { m_horizontalAngle = a; }

void Camera::setVerticalAngle(double a) { m_verticalAngle = a; }

void Camera::addDistance(int d){ m_distance += d; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

OrientationKind Camera::orientationKind() const {
    float val = fmod(-(m_horizontalAngle * M_PI / 180.0), 2 * M_PI);
    float cos = qCos(val);
    float sin = qSin(val);

    if (sin >= qSin(-M_PI / 4.0f) && sin <= qSin(M_PI / 4.0f)) {
        return (cos >= 0.0f) ? OrientationKind::East
                             : OrientationKind::West;
    }
    else {
        return (sin >= 0.0f) ? OrientationKind::North
                             : OrientationKind::South;
    }
}

// -------------------------------------------------------

CameraUpDownKind Camera::cameraUpDownKind() const {
    return m_verticalAngle < 90 ? CameraUpDownKind::Up : CameraUpDownKind::Down;
}

// -------------------------------------------------------

void Camera::update(Cursor *cursor, int squareSize){

    // Horizontal angle should stay in [-450;270] interval
    m_horizontalAngle = fmod(m_horizontalAngle * M_PI / 180.0, 2 * M_PI)
            * 180.0 / M_PI;

    // Update target
    m_target.setX(cursor->getX() + (squareSize / 2));
    m_target.setY(cursor->getY());
    m_target.setZ(cursor->getZ() + (squareSize / 2));

    // Update position
    double distance = getDistance();
    double height = getHeight();

    m_position.setX(m_target.x() - (float)(distance * qCos(m_horizontalAngle *
                                                           M_PI / 180.0)));
    m_position.setY(m_target.y() + (float)(height));
    m_position.setZ(m_target.z() - (float)(distance * qSin(m_horizontalAngle *
                                                           M_PI / 180.0)));
}

// -------------------------------------------------------

void Camera::zoomPlus(int squareSize) {
    m_distance -= getZoom(squareSize);

    if (m_distance < 10)
        m_distance = 10;
}

// -------------------------------------------------------

void Camera::zoomLess(int squareSize) {
    m_distance += getZoom(squareSize);
}

// -------------------------------------------------------

int Camera::getZoom(int squareSize) const {
    return 10 + (m_distance / squareSize);
}

// -------------------------------------------------------

void Camera::onMouseWheelPressed(QPoint& mouse, QPoint& mouseBeforeUpdate){
    m_horizontalAngle += (mouse.x() - mouseBeforeUpdate.x()) / 2;
    m_verticalAngle -= (mouse.y() - mouseBeforeUpdate.y()) / 2;
    if (m_verticalAngle < 1)
        m_verticalAngle = 1;
    if (m_verticalAngle > 179)
        m_verticalAngle = 179;
}

// -------------------------------------------------------

double Camera::getDistance() const {
    return m_distance * qSin(m_verticalAngle * M_PI / 180.0);
}

// -------------------------------------------------------

double Camera::getHeight() const {
    return m_distance * qCos(m_verticalAngle * M_PI / 180.0);
}
