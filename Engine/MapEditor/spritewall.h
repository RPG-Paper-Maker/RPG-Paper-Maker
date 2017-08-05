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

#ifndef SPRITEWALL_H
#define SPRITEWALL_H

#include "sprites.h"

class SpriteWallDatas : SpriteDatas
{
public:
    SpriteWallDatas();
    SpriteWallDatas(MapEditorSubSelectionKind kind, int layer,
                    int widthPosition, int angle, QRect* textureRect,
                    bool l, bool r, bool t, bool b);
    bool left() const;
    bool right() const;
    bool top() const;
    bool bot() const;
    void setLeft(bool b);
    void setRight(bool b);
    void setTop(bool b);
    void setBot(bool b);
    bool isPipe() const;

protected:
    bool m_left;
    bool m_right;
    bool m_top;
    bool m_bot;
};

#endif // SPRITEWALL_H
