/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    SystemCurrency(int i, LangsTranslation *names, int pictureID);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemCurrency& super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemCurrency)

#endif // SYSTEMCURRENCY_H
