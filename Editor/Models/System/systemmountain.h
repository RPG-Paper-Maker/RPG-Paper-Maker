/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMMOUNTAIN_H
#define SYSTEMMOUNTAIN_H

#include <QMetaType>
#include "systemspecialelement.h"

// -------------------------------------------------------
//
//  CLASS SystemMountain
//
//  A particulary mountain (special element).
//
// -------------------------------------------------------

class SystemMountain : public SystemSpecialElement
{
public:
    SystemMountain();
    SystemMountain(int i, QString n, int pictureId);
    virtual ~SystemMountain();

    virtual SystemPicture* picture() const;
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemMountain)

#endif // SYSTEMMOUNTAIN_H
