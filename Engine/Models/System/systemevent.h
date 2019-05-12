/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
