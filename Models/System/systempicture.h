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

#ifndef SYSTEMPICTURE_H
#define SYSTEMPICTURE_H

#include <QMetaType>
#include "superlistitem.h"
#include "picturekind.h"

// -------------------------------------------------------
//
//  CLASS SystemPicture
//
//  A particulary picture.
//
// -------------------------------------------------------

class SystemPicture : public SuperListItem
{
public:
    SystemPicture();
    SystemPicture(int i, QString n, bool isBR);
    virtual ~SystemPicture();
    static QString pathIconRed;
    static QString pathIconBlue;
    bool isBR() const;
    void setIsBR(bool b);
    static QString getFolder(PictureKind kind, bool isBR);
    static QString getLocalFolder(PictureKind kind);
    static QString getPictureTitle(PictureKind kind);
    QString getPath(PictureKind kind) const;
    QString getLocalPath(PictureKind kind) const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemPicture &super);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isBR;
};

Q_DECLARE_METATYPE(SystemPicture)

#endif // SYSTEMPICTURE_H
