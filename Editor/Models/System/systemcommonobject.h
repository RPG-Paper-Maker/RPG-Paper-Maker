/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static const QString JSON_ONLY_ONE_EVENT_PER_FRAME;
    static const QString JSON_CAN_BE_TRIGGERED_ANOTHER_OBJECT;
    static const QString JSON_INHERITANCE_ID;
    static const QString JSON_STATES;
    static const QString JSON_PROPERTIES;
    static const QString JSON_EVENTS;
    static const bool DEFAULT_CAN_BE_TRIGGERED_ANOTHER_OBJECT;

    SystemCommonObject();
    SystemCommonObject(int i, QString n, bool onlyOneEventPerFrame, bool
        canBeTriggeredAnotherObject, int id, QStandardItemModel *states,
        QStandardItemModel *properties, QStandardItemModel *events);
    virtual ~SystemCommonObject();

    bool onlyOneEventPerFrame() const;
    void setOnlyOneEventPerFrame(bool b);
    bool canBeTriggeredAnotherObject() const;
    void setCanBeTriggeredAnotherObject(bool canBeTriggeredAnotherObject);
    virtual void setDefault();
    void setDefaultStartupObject();
    int inheritanceId() const;
    void setInheritance(int id);
    bool inherit(const SystemCommonObject *object);
    bool canInherit(QStandardItemModel* model,
                    SystemCommonObject* object) const;
    QStandardItemModel* modelStates() const;
    QStandardItemModel* modelProperties() const;
    QStandardItemModel* modelEvents() const;
    void updateModelEvents();
    SystemState* getFirstState() const;
    QList<QStandardItem *> getAllCommandsList() const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_onlyOneEventPerFrame;
    bool m_canBeTriggeredAnotherObject;
    int m_inheritanceId;
    QStandardItemModel* m_states;
    QStandardItemModel* m_properties;
    QStandardItemModel* m_events;
};

Q_DECLARE_METATYPE(SystemCommonObject)

#endif // SYSTEMCOMMONOBJECT_H
