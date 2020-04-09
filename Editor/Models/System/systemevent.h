/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

    void initializeHeaders();

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QStandardItemModel* m_modelParameters;
};


Q_DECLARE_METATYPE(SystemEvent)

#endif // SYSTEMEVENT_H
