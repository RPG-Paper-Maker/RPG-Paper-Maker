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

#ifndef MAPPROPERTIES_H
#define MAPPROPERTIES_H

#include <QHash>
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS MapProperties
//
//  All the properties of the map.
//
// -------------------------------------------------------

class MapProperties : public SystemLang
{
public:
    MapProperties();
    MapProperties(QString path);
    MapProperties(int i, LangsTranslation *names, int l, int w, int h, int d);
    virtual ~MapProperties();
    QString realName() const;
    int length() const;
    int width() const;
    int height() const;
    int depth() const;
    void setLength(int l);
    void setWidth(int w);
    void setHeight(int h);
    void setDepth(int d);
    virtual void setCopy(const MapProperties& super);
    void save(QString path);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_length;
    int m_width;
    int m_height;
    int m_depth;
};

#endif // MAPPROPERTIES_H
