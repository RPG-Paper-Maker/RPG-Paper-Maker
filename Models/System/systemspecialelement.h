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

#ifndef SYSTEMSPECIALELEMENT_H
#define SYSTEMSPECIALELEMENT_H

#include "superlistitem.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS SystemSpecialElement
//
//  A particulary special element.
//
// -------------------------------------------------------

class SystemSpecialElement : public SuperListItem
{
public:
    SystemSpecialElement();
    SystemSpecialElement(int i, QString n, int pictureId);
    virtual ~SystemSpecialElement();
    virtual SystemPicture* picture() const;
    void setPictureID(int id);

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemSpecialElement &super);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SystemPicture* pictureByKind(PictureKind kind) const;

    int m_pictureID;
};

Q_DECLARE_METATYPE(SystemSpecialElement)

#endif // SYSTEMSPECIALELEMENT_H
