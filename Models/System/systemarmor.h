/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMARMORS_H
#define SYSTEMARMORS_H

#include "systemcommonskillitem.h"

// -------------------------------------------------------
//
//  CLASS SystemArmor
//
//  A particulary armor (datas).
//
// -------------------------------------------------------

class SystemArmor : public SystemCommonSkillItem
{
public:
    SystemArmor();
    SystemArmor(int i, LangsTranslation *names, int pictureID, int type,
        LangsTranslation *description, PrimitiveValue *conditionFormula,
        PrimitiveValue *price, QStandardItemModel *modelCharacteristics);
    virtual ~SystemArmor();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemArmor)

#endif // SYSTEMARMORS_H
