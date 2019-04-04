/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
