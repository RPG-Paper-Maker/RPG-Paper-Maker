/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    virtual void setCopy(const SystemMountain &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemMountain)

#endif // SYSTEMMOUNTAIN_H
