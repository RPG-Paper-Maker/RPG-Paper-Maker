/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
        *animationTargetID, QStandardItemModel *price, QStandardItemModel
        *modelCosts, QStandardItemModel *modelEffects, QStandardItemModel
        *modelCharacteristics);
    virtual ~SystemWeapon();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemWeapon)

#endif // SYSTEMWEAPONS_H
