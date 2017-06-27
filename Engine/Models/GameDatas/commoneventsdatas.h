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

#ifndef COMMONEVENTSDATAS_H
#define COMMONEVENTSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemcreateparameter.h"

// -------------------------------------------------------
//
//  CLASS CommonEventsDatas
//
//  Contains all the common events. The data file is located in
//  Content/Datas/commonEvents.json.
//
// -------------------------------------------------------

class CommonEventsDatas : public Serializable
{
public:
    CommonEventsDatas();
    virtual ~CommonEventsDatas();
    void read(QString path);
    QStandardItemModel* modelEventsSystem() const;
    QStandardItemModel* modelEventsUser() const;
    QStandardItemModel* modelStates() const;
    QStandardItemModel* modelCommonReactors() const;
    QStandardItemModel* modelCommonObjects() const;
    void setDefault();
    void setDefaultEvent(QStandardItemModel* model, QStringList &namesEvents,
                         QList<QVector<SystemCreateParameter*>> &parameters);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_modelEventsSystem;
    QStandardItemModel* m_modelEventsUser;
    QStandardItemModel* m_modelStates;
    QStandardItemModel* m_modelCommonReactors;
    QStandardItemModel* m_modelCommonObjects;
};

#endif // COMMONEVENTSDATAS_H
