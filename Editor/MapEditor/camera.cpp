/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "camera.h"
#include "rpm.h"
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

OrientationKind Camera::orientationFromTargetKind() const {
    int basic = ((int) orientationKind());

    return (OrientationKind) ((basic + 2) % 4);
}

// -------------------------------------------------------

bool Camera::cameraUp() const {
    return m_verticalAngle < 90 ? true : false;
}

// -------------------------------------------------------

bool Camera::cameraFront(const QVector3D &direction, double angle) const {
    QVector3D planeDirection = QVector3D(0, 0, 1);
    QMatrix4x4 m;
    m.rotate(-static_cast<float>(angle), 0.0, 1.0, 0.0);
    planeDirection = planeDirection * m;

    return QVector3D::dotProduct(direction, planeDirection) < 0;
}

// -------------------------------------------------------

void Camera::update(Cursor *cursor, int squareSize) {
    m_target.setX(cursor->getX() + (squareSize / 2));
    m_target.setY(cursor->getY());
    m_target.setZ(cursor->getZ() + (squareSize / 2));

    updateTarget(m_target);
}

// -------------------------------------------------------

void Camera::updateTarget(QVector3D &target) {
    // Horizontal angle should stay in [-450;270] interval
    m_horizontalAngle = fmod(m_horizontalAngle * M_PI / 180.0, 2 * M_PI)
            * 180.0 / M_PI;

    // Update target
    m_target.setX(target.x());
    m_target.setY(target.y());
    m_target.setZ(target.z());

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
    float coef = squareSize / ((float)(RPM::BASIC_SQUARE_SIZE));
    return (50 + (m_distance / squareSize)) * coef;
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
