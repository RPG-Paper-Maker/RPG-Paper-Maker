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

#ifndef SYSTEMEVENT_H
#define SYSTEMEVENT_H

#include <QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemEvent
//
//  A particulary event (system).
//
// -------------------------------------------------------

class SystemEvent : public SuperListItem
{
public:
    SystemEvent();
    SystemEvent(int i, QString n, QStandardItemModel* parameters);
    virtual ~SystemEvent();
    QStandardItemModel* modelParameters() const;
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemEvent &item);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QStandardItemModel* m_modelParameters;
};


Q_DECLARE_METATYPE(SystemEvent)

#endif // SYSTEMEVENT_H
