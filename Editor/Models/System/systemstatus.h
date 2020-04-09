/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSTATUS_H
#define SYSTEMSTATUS_H

#include <QMetaType>
#include "systemicon.h"

// -------------------------------------------------------
//
//  CLASS SystemStatus
//
//  A particulary status (datas).
//
// -------------------------------------------------------

class SystemStatus : public SystemIcon
{
public:
    SystemStatus();
    SystemStatus(int i, LangsTranslation *names, int pictureID);
    virtual ~SystemStatus();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemStatus)

#endif // SYSTEMSTATUS_H
