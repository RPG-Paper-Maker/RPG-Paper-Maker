/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QtMath>
#include "position.h"
#include "common.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Position::Position() : Position(0, 0, 0, 0, 0) {}

Position::Position(const Position3D &pos) :
    Position(pos.x(), pos.y(), pos.yPlus(), pos.z(), 0)
{

}

Position::Position(const Position &pos) :
    Position(pos.x(), pos.y(), pos.yPlus(), pos.z(), pos.layer(), pos.centerX(),
        pos.centerZ(), pos.angleY(), pos.angleX(), pos.angleZ(), pos.scaleX(),
        pos.scaleY(), pos.scaleZ())
{

}

Position::Position(int x, int y, double y_plus, int z, int layer) :
    Position(x, y, y_plus, z, layer, 50, 50, 0, 0, 0)
{

}

Position::Position(int x, int y, double y_plus, int z, int layer, double centerX,
    double centerZ, double angleY, double angleX, double angleZ, double scaleX,
    double scaleY, double scaleZ) :
    Position3D(x, y, y_plus, z),
    m_layer(layer),
    m_centerX(centerX),
    m_centerZ(centerZ),
    m_angleY(angleY),
    m_angleX(angleX),
    m_angleZ(angleZ),
    m_scaleX(scaleX),
    m_scaleY(scaleY),
    m_scaleZ(scaleZ)
{

}

Position::~Position()
{

}

bool Position::operator==(const Position& other) const
{
    return m_x == other.x() && m_y == other.y() && qFuzzyCompare(m_y_plus, other
        .yPlus()) && m_z == other.z() && m_layer == other.layer() && m_centerX
        == other.centerX() && m_centerZ == other.centerZ() && qFuzzyCompare(
        m_angleY, other.m_angleY) && qFuzzyCompare(m_angleX, other.m_angleX) &&
        qFuzzyCompare(m_angleZ, other.m_angleZ) && qFuzzyCompare(m_scaleX, other
        .m_scaleX) && qFuzzyCompare(m_scaleY, other.m_scaleY) && qFuzzyCompare(
        m_scaleZ, other.m_scaleZ);
}

bool Position::operator!=(const Position& other) const
{
    return !operator==(other);
}

void Position::setX(int x)
{
    m_x = x;
}

void Position::setZ(int z)
{
    m_z = z;
}

void Position::setCoords(int x, int y, double y_plus, int z)
{
    m_x = x;
    m_y = y;
    m_y_plus = y_plus;
    m_z = z;
}

int Position::layer() const
{
    return m_layer;
}

void Position::setLayer(int l)
{
    m_layer = l;
}

double Position::centerX() const{
    return m_centerX;
}

void Position::setCenterX(double x){
    m_centerX = x;
}

void Position::addCenterX(double x)
{
    m_centerX += x;
}

double Position::centerZ() const
{
    return m_centerZ;
}

void Position::setCenterZ(double z)
{
    m_centerZ = z;
}

void Position::addCenterZ(double z)
{
    m_centerZ += z;
}

double Position::angleY() const
{
    return m_angleY;
}

void Position::setAngleY(double a)
{
    m_angleY = Position::filterAngle(a);
}

void Position::addAngleY(double a)
{
    this->setAngleY(Position::filterAngle(this->angleY() + a));
}

double Position::angleX() const
{
    return m_angleX;
}

void Position::setAngleX(double a)
{
    m_angleX = Position::filterAngle(a);
}

void Position::addAngleX(double a)
{
    this->setAngleX(Position::filterAngle(this->angleX() + a));
}

double Position::angleZ() const
{
    return m_angleZ;
}

void Position::setAngleZ(double a)
{
    m_angleZ = Position::filterAngle(a);
}

void Position::addAngleZ(double a)
{
    this->setAngleZ(Position::filterAngle(this->angleZ() + a));
}

double Position::scaleX() const
{
    return m_scaleX;
}

void Position::setScaleX(double scaleX)
{
    m_scaleX = scaleX;
}

double Position::scaleY() const
{
    return m_scaleY;
}

void Position::setScaleY(double scaleY)
{
    m_scaleY = scaleY;
}

double Position::scaleZ() const
{
    return m_scaleZ;
}

void Position::setScaleZ(double scaleZ)
{
    m_scaleZ = scaleZ;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

double Position::filterAngle(double a)
{
    int r;
    if (a > 0)
    {
        r = qFloor(a / 360);
    } else {
        r = qCeil(a / 360);
    }
    a -= r * 360;
    return a;
}

// -------------------------------------------------------

bool Position::isHorizontal() const
{
    return m_angleY == 0.0;
}

// -------------------------------------------------------

void Position::setAngle(AxisKind axisKind, double a)
{
    switch (axisKind)
    {
    case AxisKind::X:
        this->setAngleX(a);
        break;
    case AxisKind::Y:
        this->setAngleY(a);
        break;
    case AxisKind::Z:
        this->setAngleZ(a);
        break;
    }
}

// -------------------------------------------------------

void Position::addAngle(AxisKind axisKind, double a)
{
    switch (axisKind)
    {
    case AxisKind::X:
        this->addAngleX(a);
        break;
    case AxisKind::Y:
        this->addAngleY(a);
        break;
    case AxisKind::Z:
        this->addAngleZ(a);
        break;
    }
}

// -------------------------------------------------------

void Position::setScale(AxisKind axisKind, double scale)
{
    switch (axisKind)
    {
    case AxisKind::X:
        this->setScaleX(scale);
        break;
    case AxisKind::Y:
        this->setScaleY(scale);
        break;
    case AxisKind::Z:
        this->setScaleZ(scale);
        break;
    }
}

// -------------------------------------------------------

void Position::setHorizontal()
{
    setCenterX(50);
    setCenterZ(0);
    setAngleY(0);
}

// -------------------------------------------------------

void Position::setVertical()
{
    setCenterX(0);
    setCenterZ(50);
    setAngleY(90);
}

// -------------------------------------------------------

void Position::setCurrent(Position& position) const
{
    position.setCenterX(m_centerX);
    position.setCenterZ(m_centerZ);
    position.setAngleY(m_angleY);
    position.setAngleX(m_angleX);
    position.setAngleZ(m_angleZ);
}

// -------------------------------------------------------

void Position::getLeft(Position& position) const
{
    if (this->isHorizontal())
    {
        position.setCoords(m_x - 1, m_y, m_y_plus, m_z);
    } else
    {
        position.setCoords(m_x, m_y, m_y_plus, m_z + 1);
    }
    this->setCurrent(position);
}

// -------------------------------------------------------

void Position::getRight(Position &position) const
{
    if (this->isHorizontal())
    {
        position.setCoords(m_x + 1, m_y, m_y_plus, m_z);
    } else
    {
        position.setCoords(m_x, m_y, m_y_plus, m_z - 1);
    }
    this->setCurrent(position);
}

// -------------------------------------------------------

void Position::getTopLeft(Position &position) const
{
    if (this->isHorizontal())
    {
        position.setCoords(m_x, m_y, m_y_plus, m_z - 1);
        position.setVertical();
    } else
    {
        position.setCoords(m_x - 1, m_y, m_y_plus, m_z + 1);
        position.setHorizontal();
    }
}

// -------------------------------------------------------

void Position::getTopRight(Position &position) const
{
    if (this->isHorizontal())
    {
        position.setCoords(m_x + 1, m_y, m_y_plus, m_z - 1);
        position.setVertical();
    } else
    {
        position.setCoords(m_x - 1, m_y, m_y_plus, m_z);
        position.setHorizontal();
    }
}

// -------------------------------------------------------

void Position::getBotLeft(Position &position) const
{
    if (this->isHorizontal())
    {
        position.setCoords(m_x, m_y, m_y_plus, m_z);
        position.setVertical();
    } else
    {
        position.setCoords(m_x, m_y, m_y_plus, m_z + 1);
        position.setHorizontal();
    }
}

// -------------------------------------------------------

void Position::getBotRight(Position &position) const
{
    if (this->isHorizontal())
    {
        position.setCoords(m_x + 1, m_y, m_y_plus, m_z);
        position.setVertical();
    } else
    {
        position.setCoords(m_x, m_y, m_y_plus, m_z);
        position.setHorizontal();
    }
}

// -------------------------------------------------------

int Position::getCenterXPixels() const
{
    return m_centerX * RPM::getSquareSize() / 100;
}

// -------------------------------------------------------

int Position::getCenterZPixels() const
{
    return m_centerZ * RPM::getSquareSize() / 100;
}

// -------------------------------------------------------

void Position::getStringLayerYPlus(QString &infos) const
{
    int yPlus = this->getYpx();
    if (yPlus > 0)
    {
        infos += RPM::translate(Translations::Y) + "+ = " + QString::number(yPlus) +
            RPM::translate(Translations::PX);
    }
    infos += RPM::NEW_LINE +RPM::translate(Translations::LAYER) + RPM::SPACE +
        RPM::EQUAL + RPM::SPACE + QString::number(m_layer) + RPM::NEW_LINE + RPM
        ::translate(Translations::ANGLES) + RPM::SPACE + RPM::EQUAL + RPM::SPACE
        + RPM::BRACKET_LEFT + RPM::SPACE + QString::number(m_angleX) + ", " +
        QString::number(m_angleY) + ", " + QString::number(m_angleZ) + RPM
        ::BRACKET_RIGHT + RPM::NEW_LINE + RPM::translate(Translations::SCALE) +
        RPM::SPACE + RPM::EQUAL + RPM::SPACE + RPM::BRACKET_LEFT + RPM::SPACE +
        QString::number(m_scaleX) + ", " + QString::number(m_scaleY) + ", " +
        QString::number(m_scaleZ) + RPM::BRACKET_RIGHT + RPM::NEW_LINE + RPM
        ::translate(Translations::CENTER) + RPM::SPACE + RPM::translate(
        Translations::X) + RPM::SPACE + RPM::EQUAL + RPM::SPACE + QString
        ::number(this->getCenterXPixels()) + "px" + RPM::NEW_LINE + RPM
        ::translate(Translations::CENTER) + RPM::SPACE + RPM::translate(
        Translations::Z) + RPM::SPACE + RPM::EQUAL + RPM::SPACE + QString
        ::number(this->getCenterZPixels()) + "px";
}

// -------------------------------------------------------

QString Position::toString() const
{
    QString infos = RPM::BRACKET_LEFT + RPM::translate(Translations::X) + RPM::SPACE +
        RPM::EQUAL + RPM::SPACE + QString::number(m_x) + "," + RPM::SPACE + RPM
        ::translate(Translations::Y) + RPM::SPACE + RPM::EQUAL + RPM::SPACE +
        QString::number(m_y) + "," + RPM::SPACE + RPM::translate(Translations::Z
        ) + RPM::SPACE + RPM::EQUAL + RPM::SPACE + QString::number(m_z) + RPM
        ::BRACKET_RIGHT + RPM::SPACE;
    this->getStringLayerYPlus(infos);
    return infos;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void Position::read(const QJsonArray &json)
{
    Position3D::read(json);
    m_layer = json[4].toInt();
    int size = json.size();
    if (size > 5)
    {
        m_centerX = json[5].toDouble();
        m_centerZ = json[6].toDouble();
        m_angleY = json[7].toDouble();
        if (size > 8)
        {
            m_angleX = json[8].toDouble();
            m_angleZ = json[9].toDouble();
            if (size > 10)
            {
                m_scaleX = json[10].toDouble();
                m_scaleY = json[11].toDouble();
                m_scaleZ = json[12].toDouble();
            }
        }
    }
}

// -------------------------------------------------------

void Position::write(QJsonArray &json) const
{
    Position3D::write(json);
    json.append(m_layer);
    if (m_centerX != 50.0 || m_centerZ != 50.0 || m_angleY != 0.0 || m_angleX != 0.0
        || m_angleZ != 0.0)
    {
        json.append(m_centerX);
        json.append(m_centerZ);
        json.append(m_angleY);
        if (m_angleX != 0.0 || m_angleZ != 0.0)
        {
            json.append(m_angleX);
            json.append(m_angleZ);
            if (m_scaleX != 1.0 || m_scaleY != 1.0 || m_scaleZ != 1.0)
            {
                json.append(m_scaleX);
                json.append(m_scaleY);
                json.append(m_scaleZ);
            }
        }
    }
}

