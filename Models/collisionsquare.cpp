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

#include "collisionsquare.h"
#include "wanok.h"

const QString CollisionSquare::JSON_RECT = "rec";
const QString CollisionSquare::JSON_LEFT = "l";
const QString CollisionSquare::JSON_RIGHT = "r";
const QString CollisionSquare::JSON_TOP = "t";
const QString CollisionSquare::JSON_BOT = "b";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

CollisionSquare::CollisionSquare() :
    CollisionSquare(nullptr)
{

}

CollisionSquare::CollisionSquare(QRectF* rect) :
    m_rect(rect),
    m_left(true),
    m_right(true),
    m_top(true),
    m_bot(true)
{

}

CollisionSquare::~CollisionSquare() {
    if (m_rect != nullptr)
        delete m_rect;
}

QRectF *CollisionSquare::rect() const {
    return m_rect;
}

void CollisionSquare::setRect(QRectF *rect) {
    if (m_rect != nullptr)
        delete m_rect;
    m_rect = rect;
}

bool CollisionSquare::left() const {
    return m_left;
}

bool CollisionSquare::right() const {
    return m_right;
}

bool CollisionSquare::top() const {
    return m_top;
}

bool CollisionSquare::bot() const {
    return m_bot;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool CollisionSquare::hasAllDirections() const {
    return m_left && m_right && m_top && m_bot;
}

// -------------------------------------------------------

void CollisionSquare::setDefaultPraticable() {
    if (m_rect != nullptr)
        delete m_rect;
    m_rect = new QRectF(0, 0, 100, 100);
}

// -------------------------------------------------------

void CollisionSquare::revertAllDirections() {
    revertTop();
    revertRight();
    revertBot();
    revertLeft();
}

// -------------------------------------------------------

void CollisionSquare::revertTop() {
    m_top = !m_top;
}

// -------------------------------------------------------

void CollisionSquare::revertRight() {
    m_right = !m_right;
}

// -------------------------------------------------------

void CollisionSquare::revertBot() {
    m_bot = !m_bot;
}

// -------------------------------------------------------

void CollisionSquare::revertLeft() {
    m_left = !m_left;
}


// -------------------------------------------------------

CollisionSquare* CollisionSquare::createCopy() {
    CollisionSquare* collision = new CollisionSquare;
    if (m_rect == nullptr)
        collision->m_rect = nullptr;
    else
        collision->m_rect = new QRectF(*m_rect);
    collision->m_top = m_top;
    collision->m_right = m_right;
    collision->m_bot = m_bot;
    collision->m_left = m_left;

    return collision;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void CollisionSquare::read(const QJsonObject &json) {
    if (json.contains(JSON_RECT)) {
        if (!json[JSON_RECT].isNull()) {
            QJsonArray tab = json[JSON_RECT].toArray();
            m_rect = new QRectF(tab.at(0).toDouble(), tab.at(1).toDouble(),
                                tab.at(2).toDouble(), tab.at(3).toDouble());
        }
    }
    else
        setDefaultPraticable();

    if (json.contains(JSON_LEFT))
        m_left = json[JSON_LEFT].toBool();
    else
        m_left = true;
    if (json.contains(JSON_RIGHT))
        m_right = json[JSON_RIGHT].toBool();
    else
        m_right = true;
    if (json.contains(JSON_TOP))
        m_top = json[JSON_TOP].toBool();
    else
        m_top = true;
    if (json.contains(JSON_BOT))
        m_bot = json[JSON_BOT].toBool();
    else
        m_bot = true;
}

// -------------------------------------------------------

void CollisionSquare::write(QJsonObject &json) const {
    if (m_rect != nullptr) {
        if (m_rect->x() != 0 || m_rect->y() != 0 || m_rect->width() != 100 ||
            m_rect->height() != 100)
        {
            QJsonArray tab;
            tab.append(m_rect->x());
            tab.append(m_rect->y());
            tab.append(m_rect->width());
            tab.append(m_rect->height());
            json[JSON_RECT] = tab;
        }
    }
    else
        json[JSON_RECT] = QJsonValue();


    if (!m_left)
        json[JSON_LEFT] = m_left;
    if (!m_right)
        json[JSON_RIGHT] = m_right;
    if (!m_top)
        json[JSON_TOP] = m_top;
    if (!m_bot)
        json[JSON_BOT] = m_bot;
}
