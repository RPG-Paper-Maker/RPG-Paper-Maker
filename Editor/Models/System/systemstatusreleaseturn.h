/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSTATUSRELEASETURN_H
#define SYSTEMSTATUSRELEASETURN_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemStatusReleaseTurn
//
//  A particulary status release turn.
//
// -------------------------------------------------------

class SystemStatusReleaseTurn : public SuperListItem
{
public:
    SystemStatusReleaseTurn();
    SystemStatusReleaseTurn(int i, QString name);
    virtual ~SystemStatusReleaseTurn();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemStatusReleaseTurn)

#endif // SYSTEMSTATUSRELEASETURN_H
