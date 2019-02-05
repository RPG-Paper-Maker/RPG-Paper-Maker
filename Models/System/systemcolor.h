/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef SYSTEMCOLOR_H
#define SYSTEMCOLOR_H

#include <QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemColor
//
//  A particulary color (datas).
//
// -------------------------------------------------------

class SystemColor : public SuperListItem
{
public:
    static const QString JSON_R;
    static const QString JSON_G;
    static const QString JSON_B;
    static const QString JSON_A;

    SystemColor();
    SystemColor(int i, QString n, int r, int g, int b, int a);
    virtual ~SystemColor();

    QColor color() const;
    void setColor(QColor& color);

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SystemColor &color);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QColor m_color;
};

Q_DECLARE_METATYPE(SystemColor)

#endif // SYSTEMCOLOR_H
