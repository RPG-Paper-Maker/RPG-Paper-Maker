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

#include <QStandardItemModel>
#include "serializable.h"
#include "systempicture.h"
#include "picturekind.h"

// -------------------------------------------------------
//
//  CLASS PicturesDatas
//
//  Contains all the possible pictures of a game. The data file is located in
//  Content/Datas/pictures.json.
//
// -------------------------------------------------------

#ifndef PICTURESDATAS_H
#define PICTURESDATAS_H


class PicturesDatas : public Serializable
{
public:
    PicturesDatas();
    virtual ~PicturesDatas();
    void read(QString path);
    QStandardItemModel* model(PictureKind kind) const;
    void setModel(PictureKind kind, QStandardItemModel* model);
    void setDefault();
    void fillList(QList<SystemPicture*> &pictures, QList<QString> &names);
    void setDefaultPictures(QList<QString>& names, PictureKind kind);
    void setDefaultBars(QList<QString>& names);
    void setDefaultFacesets(QList<QString>& names);
    void setDefaultIcons(QList<QString>& names);
    void setDefaultWindowSkins(QList<QString>& names);
    void setDefaultAutotiles(QList<QString>& names);
    void setDefaultBattlers(QList<QString>& names);
    void setDefaultCharacters(QList<QString>& names);
    void setDefaultReliefs(QList<QString>& names);
    void setDefaultTilesets(QList<QString>& names);
    void setDefaultWalls(QList<QString>& names);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QHash<PictureKind, QStandardItemModel*> m_models;
};

#endif // PICTURESDATAS_H
