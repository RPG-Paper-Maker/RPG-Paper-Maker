/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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
    static const QString JSON_INHERITANCE_ID;
    static const QString JSON_STATES;
    static const QString JSON_PROPERTIES;
    static const QString JSON_EVENTS;

    SystemCommonObject();
    SystemCommonObject(int i, QString n, bool onlyOneEventPerFrame, int id,
        QStandardItemModel *states, QStandardItemModel *properties,
        QStandardItemModel *events);
    virtual ~SystemCommonObject();

    bool onlyOneEventPerFrame() const;
    void setOnlyOneEventPerFrame(bool b);
    virtual void setDefault();
    void setDefaultFirst();
    void setDefaultHero(QStandardItemModel* modelEventsSystem,
                        QStandardItemModel *);
    void setDefaultHeroKeyPressEvent(QStandardItemModel *modelEventsSystem,
                                     int k, bool r, bool ri,
                                     EventCommandKind kind,
                                     QVector<QString> commandList);
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
    int m_inheritanceId;
    QStandardItemModel* m_states;
    QStandardItemModel* m_properties;
    QStandardItemModel* m_events;
};

Q_DECLARE_METATYPE(SystemCommonObject)

#endif // SYSTEMCOMMONOBJECT_H
