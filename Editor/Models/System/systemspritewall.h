/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    virtual void setCopy(const SuperListItem &super);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemSpriteWall)

#endif // SYSTEMSPRITEWALL_H
