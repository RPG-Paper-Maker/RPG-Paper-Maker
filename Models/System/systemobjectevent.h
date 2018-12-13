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

#ifndef SYSTEMOBJECTEVENT_H
#define SYSTEMOBJECTEVENT_H

#include <QMetaType>
#include "systemparameter.h"
#include "systemreaction.h"

// -------------------------------------------------------
//
//  CLASS SystemObjectEvent
//
//  A particulary object event (system).
//
// -------------------------------------------------------

class SystemObjectEvent : public SuperListItem
{
public:
    SystemObjectEvent();
    SystemObjectEvent(int i, QString n, QStandardItemModel* parameters,
                      bool isSystem);
    virtual ~SystemObjectEvent();
    QStandardItemModel* modelParameters() const;
    SystemReaction* reactionAt(int id) const;
    bool isSystem() const;
    void setIsSystem(bool b);
    static SystemObjectEvent* getCommandEvent(const EventCommand *command,
                                              int& i);
    QString getLabelTab() const;
    virtual void setDefault();
    void setDefaultHero();
    void addReaction(int id, SystemReaction* reaction);
    void addParameter(SystemParameter* parameter);
    void clearReactions();
    void clearParameters();
    void updateReactions(QStandardItemModel *modelStates);
    void updateParameters();
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemObjectEvent &event);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QStandardItemModel* m_modelParameters;
    QHash<int, SystemReaction*> m_reactions;
    bool m_isSystem;
};

Q_DECLARE_METATYPE(SystemObjectEvent)

#endif // SYSTEMOBJECTEVENT_H
