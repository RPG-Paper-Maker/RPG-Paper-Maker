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

#include "spritewall.h"

SpriteWallDatas::SpriteWallDatas() :
    SpriteDatas()
{

}

SpriteWallDatas::SpriteWallDatas(MapEditorSubSelectionKind kind,
                                 int widthPosition, int angle,
                                 QRect* textureRect) :
    SpriteDatas(kind, widthPosition, angle, textureRect),
    m_left(false),
    m_right(false),
    m_top(false),
    m_bot(false)
{

}

bool SpriteWallDatas::left() const { return m_left; }

bool SpriteWallDatas::right() const { return m_right; }

bool SpriteWallDatas::top() const { return m_top; }

bool SpriteWallDatas::bot() const { return m_bot; }

void SpriteWallDatas::setLeft(bool b) { m_left = b; }

void SpriteWallDatas::setRight(bool b) { m_right = b; }

void SpriteWallDatas::setTop(bool b) { m_top = b; }

void SpriteWallDatas::setBot(bool b) { m_bot = b; }

bool SpriteWallDatas::isPipe() const {
    return ((m_left && m_right && !m_top && !m_bot) ||
            (!m_left && !m_right && m_top && m_bot));
}
