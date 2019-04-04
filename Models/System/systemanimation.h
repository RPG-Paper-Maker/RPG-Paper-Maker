/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
