/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMSPRITEWALL_H
#define SYSTEMSPRITEWALL_H

#include <QMetaType>
#include "systemspecialelement.h"

// -------------------------------------------------------
//
//  CLASS SystemSpriteWall
//
//  A particulary sprite wall (special element).
//
// -------------------------------------------------------

class SystemSpriteWall : public SystemSpecialElement
{
public:
    SystemSpriteWall();
    SystemSpriteWall(int i, QString n, int pictureId);
    virtual ~SystemSpriteWall();
    virtual SystemPicture* picture() const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemSpriteWall &super);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemSpriteWall)

#endif // SYSTEMSPRITEWALL_H
