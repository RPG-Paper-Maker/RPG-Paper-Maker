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

#ifndef SYSTEMCOMMONOBJECT_H
#define SYSTEMCOMMONOBJECT_H

#include <QStandardItemModel>
#include <QMetaType>
#include "eventcommandkind.h"
#include "superlistitem.h"

class SystemState;

// -------------------------------------------------------
//
//  CLASS SystemCommonObject
//
//  A particulary common object (system).
//
// -------------------------------------------------------

class SystemCommonObject : public SuperListItem
{
public:
    SystemCommonObject();
    SystemCommonObject(int i, QString n, int id, QStandardItemModel *states,
                       QStandardItemModel *events);
    virtual ~SystemCommonObject();
    static QString strInheritance, strStates, strEvents;

    void setDefault();
    void setDefaultFirst();
    void setDefaultHero(QStandardItemModel* modelEventsSystem,
                        QStandardItemModel *);
    void setDefaultHeroKeyPressEvent(int &i, SystemState *state,
                                     QStandardItemModel *modelEventsSystem,
                                     int k, bool r, bool ri,
                                     EventCommandKind kind,
                                     QVector<QString> commandList);
    int inheritanceId() const;
    void setInheritance(int id);
    bool inherit(const SystemCommonObject *object);
    bool canInherit(QStandardItemModel* model,
                    SystemCommonObject* object) const;
    QStandardItemModel* modelStates() const;
    QStandardItemModel* modelEvents() const;
    void updateModelEvents();
    SystemState* getFirstState() const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemCommonObject &item);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_inheritanceId;
    QStandardItemModel* m_states;
    QStandardItemModel* m_events;
};

Q_DECLARE_METATYPE(SystemCommonObject)

#endif // SYSTEMCOMMONOBJECT_H
