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

int Camera::defaultDistance = 400;

int Camera::defaultHeight = 250;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Camera::Camera() :
    m_horizontalAngle(-90.0),
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

double Camera::horizontalAngle() const { return m_horizontalAngle; }

void Camera::setDistance(int d){ m_distance = d; }

void Camera::setHeight(int h){ m_height = h; }

void Camera::addDistance(int d){ m_distance += d; }

void Camera::addHeight(int h){ m_height += h; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Camera::update(Cursor *cursor, int squareSize){

    // Horizontal angle should stay in [-450;270] interval
    if (m_horizontalAngle >= 270.0 || m_horizontalAngle <= -450.0)
        m_horizontalAngle = -90.0;

    // Update target
    m_target.setX(cursor->getX() + (squareSize / 2));
    m_target.setY(cursor->getY());
    m_target.setZ(cursor->getZ() + (squareSize / 2));

    // Update position
    m_position.setX(m_target.x() - (float)(m_distance * qCos(m_horizontalAngle *
                                                             M_PI / 180.0)));
    m_position.setY(m_target.y() + (float)(m_height));
    m_position.setZ(m_target.z() - (float)(m_distance * qSin(m_horizontalAngle *
                                                             M_PI / 180.0)));
}

// -------------------------------------------------------

void Camera::zoomPlus(int gridHeight){
    if (m_height != 0){
        if (positionY() >= gridHeight){
            double dist = m_distance / m_height;
            m_distance -= dist * 20;
            if (m_distance < dist * 20)
                m_distance = dist * 20;
            m_height -= 20;
            if (m_height < 20)
                m_height = 20;
        }
        else{
            double dist = m_distance / -m_height;
            m_distance -= dist * 20;
            if (m_distance < dist * 20)
                m_distance = dist * 20;
            m_height += 20;
            if (m_height >= -20)
                m_height = -20;
        }
    }
}

// -------------------------------------------------------

void Camera::zoomLess(int gridHeight){
    if (m_height != 0){
        if (positionY() >= gridHeight){
            double dist = m_distance / m_height;
            m_distance += dist * 20;
            m_height += 20;
        }
        else{
            double dist = m_distance / -m_height;
            m_distance += dist * 20;
            m_height -= 20;
        }
    }
}

// -------------------------------------------------------

void Camera::onMouseWheelPressed(QPoint& mouse, QPoint& mouseBeforeUpdate){
    m_height += (mouse.y() - mouseBeforeUpdate.y()) * 2;
    m_horizontalAngle += (mouse.x() - mouseBeforeUpdate.x()) / 2;
}
