/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    SystemReaction * removeReaction(int id, bool deleteReaction = true);
    void addParameter(SystemParameter* parameter);
    void clearReactions();
    void clearParameters();
    void updateReactions(QStandardItemModel *modelStates);
    void updateParameters();
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
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
