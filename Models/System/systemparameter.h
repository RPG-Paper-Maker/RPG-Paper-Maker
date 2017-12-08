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

#ifndef SYSTEMPARAMETER_H
#define SYSTEMPARAMETER_H

#include <QMetaType>
#include "systemcreateparameter.h"

// -------------------------------------------------------
//
//  CLASS SystemParameter
//
//  A particulary parameter (system).
//
// -------------------------------------------------------

class SystemParameter : public SuperListItem
{
public:
    SystemParameter();
    SystemParameter(int i, QString n, SystemCreateParameter* parameter,
                    PrimitiveValue* value);
    virtual ~SystemParameter();
    SystemCreateParameter* parameter() const;
    PrimitiveValue* value() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemParameter &param);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SystemCreateParameter* m_parameter;
    PrimitiveValue* m_value;
};

Q_DECLARE_METATYPE(SystemParameter)

#endif // SYSTEMPARAMETER_H
