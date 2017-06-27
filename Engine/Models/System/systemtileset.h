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

#ifndef SYSTEMTILESET_H
#define SYSTEMTILESET_H

#include <QMetaType>
#include "superlistitem.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS SystemTileset
//
//  A particulary tileset (datas).
//
// -------------------------------------------------------


class SystemTileset : public SuperListItem
{
public:
    SystemTileset();
    SystemTileset(int i, QString n, int pictureId);
    SystemTileset(int i, QString n, SystemPicture* picture);
    virtual ~SystemTileset();
    SystemPicture* picture() const;
    void setPicture(SystemPicture* picture);
    void setPictureFromId(int id);
    void updatePicture();

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemTileset &super);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SystemPicture* m_picture;
    int m_pictureID;
};

Q_DECLARE_METATYPE(SystemTileset)

#endif // SYSTEMTILESET_H
