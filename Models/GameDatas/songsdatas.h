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

#include <QStandardItemModel>
#include "serializable.h"
#include "systemsong.h"
#include "songkind.h"

#ifndef SONGSDATAS_H
#define SONGSDATAS_H

// -------------------------------------------------------
//
//  CLASS SongsDatas
//
//  Contains all the possible pictures of a game. The data file is located in
//  Content/Datas/pictures.json.
//
// -------------------------------------------------------

class SongsDatas : public Serializable
{
public:
    SongsDatas();
    virtual ~SongsDatas();
    void read(QString path);
    QStandardItemModel* model(SongKind kind) const;
    void setModel(SongKind kind, QStandardItemModel* model);
    void setDefault();
    void fillList(QList<SystemSong*> &songs, QList<QString> &names,
                  QString extension);
    void setDefaultSongs(QList<QString>& names, SongKind kind,
                         QString extension);
    void setDefaultMusics(QList<QString>& names);
    void setDefaultBackgroundSounds(QList<QString>& names);
    void setDefaultSounds(QList<QString>& names);
    void setDefaultMusicEffects(QList<QString>& names);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QHash<SongKind, QStandardItemModel*> m_models;
};

#endif // SONGSDATAS_H
