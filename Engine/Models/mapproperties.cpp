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

#include "mapproperties.h"
#include "widgettreelocalmaps.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MapProperties::MapProperties() :
    MapProperties(1,
                  new LangsTranslation(WidgetTreeLocalMaps::generateMapName(1)),
                  16, 16, 16, 0, 1)
{

}

MapProperties::MapProperties(QString path)
{
    Wanok::readJSON(Wanok::pathCombine(path, Wanok::fileMapInfos), *this);
}

MapProperties::MapProperties(int i, LangsTranslation* names, int l, int w,
                             int h, int d, int idTileset) :
    MapProperties(i, names, l, w, h, d,
                  (SystemTileset*) SuperListItem::getById(
                      Wanok::get()->project()->gameDatas()->tilesetsDatas()
                      ->model()->invisibleRootItem(), idTileset))
{

}

MapProperties::MapProperties(int i, LangsTranslation* names, int l, int w,
                             int h, int d, SystemTileset* tileset) :
    SystemLang(i, names),
    m_length(l),
    m_width(w),
    m_height(h),
    m_depth(d),
    m_tileset(tileset)
{

}

MapProperties::~MapProperties()
{

}

QString MapProperties::realName() const {
    return WidgetTreeLocalMaps::generateMapName(id());
}

int MapProperties::length() const { return m_length; }

int MapProperties::width() const { return m_width; }

int MapProperties::height() const { return m_height; }

int MapProperties::depth() const { return m_depth; }

SystemTileset* MapProperties::tileset() const { return m_tileset; }

void MapProperties::setLength(int l) { m_length = l; }

void MapProperties::setWidth(int w) { m_width = w; }

void MapProperties::setHeight(int h) { m_height = h; }

void MapProperties::setDepth(int d) { m_depth = d; }

void MapProperties::setTileset(SystemTileset* tileset) { m_tileset = tileset; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void MapProperties::getPortionsNumber(int& lx, int& ly, int& lz) {
    lx = (length() - 1) / Wanok::portionSize;
    ly = (depth() + height() - 1) / Wanok::portionSize;;
    lz = (width() - 1) / Wanok::portionSize;
}

// -------------------------------------------------------

void MapProperties::setCopy(const MapProperties& super){
    SystemLang::setCopy(super);

    m_length = super.m_length;
    m_width = super.m_width;
    m_height = super.m_height;
    m_depth = super.m_depth;
}

// -------------------------------------------------------

void MapProperties::save(QString path){
    Wanok::writeJSON(Wanok::pathCombine(path, Wanok::fileMapInfos), *this);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void MapProperties::read(const QJsonObject &json){
    SystemLang::read(json);

    m_length = json["l"].toInt();
    m_width = json["w"].toInt();
    m_height = json["h"].toInt();
    m_depth = json["d"].toInt();
    m_tileset = (SystemTileset*) SuperListItem::getById(
                Wanok::get()->project()->gameDatas()->tilesetsDatas()
                ->model()->invisibleRootItem(), json["tileset"].toInt());
}

// -------------------------------------------------------

void MapProperties::write(QJsonObject &json) const{
    SystemLang::write(json);

    json["l"] = m_length;
    json["w"] = m_width;
    json["h"] = m_height;
    json["d"] = m_depth;
    json["tileset"] = m_tileset->id();
}
