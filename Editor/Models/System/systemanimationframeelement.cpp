/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemanimationframeelement.h"

const QString SystemAnimationFrameElement::JSON_X = "x";
const QString SystemAnimationFrameElement::JSON_Y = "y";
const QString SystemAnimationFrameElement::JSON_TEX_ROW = "tr";
const QString SystemAnimationFrameElement::JSON_TEX_COLUMN = "tc";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemAnimationFrameElement::SystemAnimationFrameElement() :
    SystemAnimationFrameElement(1, "", 0, 0, 0, 0)
{

}

SystemAnimationFrameElement::SystemAnimationFrameElement(int i, QString n, int x
    , int y, int tr, int tc) :
    SuperListItem(i, n),
    m_x(x),
    m_y(y),
    m_texRow(tr),
    m_texColumn(tc)
{

}

SystemAnimationFrameElement::~SystemAnimationFrameElement() {

}

int SystemAnimationFrameElement::x() const {
    return m_x;
}

void SystemAnimationFrameElement::setX(int x) {
    m_x = x;
}

int SystemAnimationFrameElement::y() const {
    return m_y;
}

void SystemAnimationFrameElement::setY(int y) {
    m_y = y;
}

int SystemAnimationFrameElement::texRow() const {
    return m_texRow;
}

void SystemAnimationFrameElement::setTexRow(int tr) {
    m_texRow = tr;
}

int SystemAnimationFrameElement::texColumn() const {
    return m_texColumn;
}

void SystemAnimationFrameElement::setTexColumn(int tc) {
    m_texColumn = tc;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem * SystemAnimationFrameElement::createCopy() const {
    SystemAnimationFrameElement *super = new SystemAnimationFrameElement;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemAnimationFrameElement::setCopy(const SuperListItem &super) {
    const SystemAnimationFrameElement *sys;

    sys = reinterpret_cast<const SystemAnimationFrameElement *>(&super);
    m_x = sys->m_x;
    m_y = sys->m_y;
    m_texRow = sys->m_texRow;
    m_texColumn = sys->m_texColumn;
}

// -------------------------------------------------------

void SystemAnimationFrameElement::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_X)) {
        m_x = json[JSON_X].toInt();
    }
    if (json.contains(JSON_Y)) {
        m_y = json[JSON_Y].toInt();
    }
    if (json.contains(JSON_TEX_ROW)) {
        m_texRow = json[JSON_TEX_ROW].toInt();
    }
    if (json.contains(JSON_TEX_COLUMN)) {
        m_texColumn = json[JSON_TEX_COLUMN].toInt();
    }
}

// -------------------------------------------------------

void SystemAnimationFrameElement::write(QJsonObject &json) const {
    SuperListItem::write(json);

    if (m_x != 0) {
        json[JSON_X] = m_x;
    }
    if (m_y != 0) {
        json[JSON_Y] = m_y;
    }
    if (m_texRow != 0) {
        json[JSON_TEX_ROW] = m_texRow;
    }
    if (m_texColumn != 0) {
        json[JSON_TEX_COLUMN] = m_texColumn;
    }
}
