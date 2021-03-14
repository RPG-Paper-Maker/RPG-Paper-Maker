/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCURRENCY_H
#define SYSTEMCURRENCY_H

#include <QMetaType>
#include "systemicon.h"

// -------------------------------------------------------
//
//  CLASS SystemCurrency
//
//  A particulary currency (system).
//
// -------------------------------------------------------

class SystemCurrency : public SystemIcon
{
public:
    SystemCurrency();
    SystemCurrency(int i, QString name, int pictureID);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemCurrency)

#endif // SYSTEMCURRENCY_H
