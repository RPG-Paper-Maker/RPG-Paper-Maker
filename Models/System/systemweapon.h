/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMWEAPONS_H
#define SYSTEMWEAPONS_H

#include "systemcommonskillitem.h"

// -------------------------------------------------------
//
//  CLASS SystemWeapon
//
//  A particulary weapon (datas).
//
// -------------------------------------------------------

class SystemWeapon : public SystemCommonSkillItem
{
public:
    SystemWeapon();
    SystemWeapon(int i, LangsTranslation* names, int pictureID, int type, bool
        oneHand, LangsTranslation *description, TargetKind targetKind,
        PrimitiveValue *targetConditionFormula, PrimitiveValue
        *conditionFormula, PrimitiveValue *animationUserID, PrimitiveValue
        *animationTargetID, PrimitiveValue *price, QStandardItemModel
        *modelCosts, QStandardItemModel *modelEffects, QStandardItemModel
        *modelCaracteristics);
    virtual ~SystemWeapon();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemWeapon)

#endif // SYSTEMWEAPONS_H
