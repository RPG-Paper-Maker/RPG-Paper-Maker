/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "mapelement.h"
#include "sprite.h"

QString MapElement::jsonX = "xOff";
QString MapElement::jsonY = "yOff";
QString MapElement::jsonZ = "zOff";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapElement::MapElement() :
    m_xOffset(0),
    m_yOffset(0),
    m_zOffset(0),
    m_isHovered(false),
    m_isInvisible(false)
{

}

MapElement::~MapElement()
{

}

bool MapElement::operator==(const MapElement& other) const{
    return m_xOffset == other.m_xOffset && m_yOffset == other.m_yOffset &&
           m_zOffset == other.m_zOffset;
}

bool MapElement::operator!=(const MapElement& other) const{
    return !operator==(other);
}

int MapElement::xOffset() const
{
    return m_xOffset;
}

int MapElement::yOffset() const
{
    return m_yOffset;
}

int MapElement::zOffset() const
{
    return m_zOffset;
}

void MapElement::setXOffset(int x) {
    m_xOffset = x;
}

void MapElement::setYOffset(int y) {
    m_yOffset = y;
}

void MapElement::setZOffset(int z) {
    m_zOffset = z;
}

bool MapElement::isHovered() const {
    return m_isHovered;
}

void MapElement::setIsHovered(bool b) {
    m_isHovered = b;
}

bool MapElement::isInvisible() const
{
    return m_isInvisible;
}

void MapElement::setIsInvisible(bool isInvisible)
{
    m_isInvisible = isInvisible;
}

MapEditorSelectionKind MapElement::getKind() const{
    return MapEditorSelectionKind::Land;
}

MapEditorSubSelectionKind MapElement::getSubKind() const{
    return MapEditorSubSelectionKind::None;
}

QString MapElement::toString() const { return ""; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void MapElement::getPosSizeCenter(
        QVector3D& pos, QVector3D& size, QVector3D& center, QVector3D &offset,
        int squareSize, Position &position, int width, int height, bool front)
{
    // Offset
    float zPlus = 0, off = position.layer() * 0.05f;
    if (getSubKind() == MapEditorSubSelectionKind::SpritesFace || front) {
        zPlus += off;
    } else {
        zPlus -= off;
    }
    offset.setZ(zPlus);

    // Size
    size.setX(static_cast<float>(width * squareSize * position.scaleX()));
    size.setY(static_cast<float>(height * squareSize * position.scaleY()));
    size.setZ(1.0f * position.scaleZ());

    // Center
    center.setX((position.x() + m_xOffset) * squareSize +
                ((int)(squareSize * position.centerX() / 100.0)));
    center.setY((float) position.getY() + (m_yOffset * squareSize));
    center.setZ((position.z() + m_zOffset) * squareSize +
                ((int)(squareSize * position.centerZ() / 100.0)));

    // Position
    pos = center + offset;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

MapElement * MapElement::createCopy()
{
    MapElement *element = new MapElement;
    element->setCopy(*this);
    return element;
}

// -------------------------------------------------------

void MapElement::setCopy(const MapElement &element)
{
    m_xOffset = element.m_xOffset;
    m_yOffset = element.m_yOffset;
    m_zOffset = element.m_zOffset;
    m_isHovered = element.m_isHovered;
}

// -------------------------------------------------------

void MapElement::read(const QJsonObject & json){
    if (json.contains(MapElement::jsonX))
        m_xOffset = json[MapElement::jsonX].toInt();
    if (json.contains(MapElement::jsonY))
        m_yOffset = json[MapElement::jsonY].toInt();
    if (json.contains(MapElement::jsonZ))
        m_zOffset = json[MapElement::jsonZ].toInt();
}

// -------------------------------------------------------

void MapElement::write(QJsonObject &json) const{
    if (m_xOffset != 0)
        json[MapElement::jsonX] = m_xOffset;
    if (m_yOffset != 0)
        json[MapElement::jsonY] = m_yOffset;
    if (m_zOffset != 0)
        json[MapElement::jsonZ] = m_zOffset;
}
