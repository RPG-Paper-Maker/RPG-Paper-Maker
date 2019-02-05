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

#ifndef SYSTEMSONG_H
#define SYSTEMSONG_H

#include <QMetaType>
#include "superlistitem.h"
#include "songkind.h"

// -------------------------------------------------------
//
//  CLASS SystemSong
//
//  A particulary song.
//
// -------------------------------------------------------

class SystemSong : public SuperListItem
{
public:
    SystemSong();
    SystemSong(int i, QString n, bool isBR);
    virtual ~SystemSong();
    bool isBR() const;
    void setIsBR(bool b);
    static QString getFolder(SongKind kind, bool isBR);
    static QString getLocalFolder(SongKind kind);
    static QString getSongTitle(SongKind kind);
    QString getPath(SongKind kind) const;
    QString getLocalPath(SongKind kind) const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemSong &super);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isBR;
};

Q_DECLARE_METATYPE(SystemSong)

#endif // SYSTEMSONG_H
