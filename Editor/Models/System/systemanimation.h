/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMANIMATION_H
#define SYSTEMANIMATION_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemAnimation
//
//  A particulary animation (datas).
//
// -------------------------------------------------------

class SystemAnimation : public SuperListItem
{
public:
    SystemAnimation();
    SystemAnimation(int i, QString n);
    virtual ~SystemAnimation();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemAnimation)

#endif // SYSTEMANIMATION_H
