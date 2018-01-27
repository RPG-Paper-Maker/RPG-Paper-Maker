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

#include "textureautotile.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

TextureAutotile::TextureAutotile()
{

}

TextureAutotile::~TextureAutotile()
{
    delete m_texture;
}

QOpenGLTexture* TextureAutotile::texture() {
    return m_texture;
}

void TextureAutotile::setTexture(QOpenGLTexture* texture) {
    m_texture = texture;
}

void TextureAutotile::setBegin(int id, int offset) {
    m_beginID = id;
    m_beginOffset = offset;
}

void TextureAutotile::setEnd(int id, int offset) {
    m_endID = id;
    m_endOffset = offset;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int TextureAutotile::isInTexture(int id, int offset) {
    if (id >= m_beginID && id <= m_endID) {
        if (id == m_beginID) {
            if (id == m_endID)
                return offset >= m_beginOffset && offset <= m_endOffset;
            else
                return offset >= m_beginOffset;
        }
        else if (id < m_endID)
            return true;
        else
            return offset <= m_endOffset;
    }
    return false;
}
