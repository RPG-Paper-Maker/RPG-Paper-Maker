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

#ifndef SYSTEMCREATEPARAMETER_H
#define SYSTEMCREATEPARAMETER_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemCreateParameter
//
//  A particulary create parameter (system).
//
// -------------------------------------------------------

class SystemCreateParameter : public SuperListItem
{
public:
    SystemCreateParameter();
    SystemCreateParameter(int i, QString n, PrimitiveValue* defaultValue);
    virtual ~SystemCreateParameter();
    PrimitiveValue* defaultValue() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemCreateParameter &param);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue* m_defaultValue;
};

Q_DECLARE_METATYPE(SystemCreateParameter)

#endif // SYSTEMCREATEPARAMETER_H
