/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
