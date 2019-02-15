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

#ifndef SYSTEMICON_H
#define SYSTEMICON_H

#include <QMetaType>
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS SystemIcon
//
//  A particulary icon (ressources).
//
// -------------------------------------------------------

class SystemIcon : public SystemLang
{
public:
    static const QString JSON_PICTURE_ID;

    SystemIcon();
    SystemIcon(int i, LangsTranslation* names, int pictureID);
    virtual ~SystemIcon();
    int pictureID() const;
    void setPictureID(int id);

    virtual void setCopy(const SystemIcon& icon);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_pictureID;
};

Q_DECLARE_METATYPE(SystemIcon)

#endif // SYSTEMICON_H
