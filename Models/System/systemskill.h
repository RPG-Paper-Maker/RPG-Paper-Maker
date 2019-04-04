/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMSKILLS_H
#define SYSTEMSKILLS_H

#include "systemcommonskillitem.h"

// -------------------------------------------------------
//
//  CLASS SystemSkill
//
//  A particulary skill (datas).
//
// -------------------------------------------------------

class SystemSkill : public SystemCommonSkillItem
{
public:
    SystemSkill();
    SystemSkill(int i, LangsTranslation *names, int pictureID, LangsTranslation
        *description, TargetKind targetKind, PrimitiveValue
        *targetConditionFormula, PrimitiveValue *conditionFormula, AvailableKind
        availableKind, SystemPlaySong *sound, PrimitiveValue *animationUserID,
        PrimitiveValue *animationTargetID, QStandardItemModel *modelCosts,
        QStandardItemModel *modelEffects);
    virtual ~SystemSkill();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemSkill)

#endif // SYSTEMSKILLS_H
