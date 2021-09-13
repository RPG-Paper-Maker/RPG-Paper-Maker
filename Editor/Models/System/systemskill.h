/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static const QString DEFAULT_BATTLE_MESSAGE;

    SystemSkill();
    SystemSkill(int i, QString name, int pictureID, SystemTranslatable *description,
        TargetKind targetKind, PrimitiveValue *targetConditionFormula,
        PrimitiveValue *conditionFormula, AvailableKind availableKind,
        SystemPlaySong *sound, PrimitiveValue *animationUserID, PrimitiveValue
        *animationTargetID, SystemTranslatable *battleMessage, QStandardItemModel *modelCosts, QStandardItemModel
        *modelEffects);
    virtual ~SystemSkill();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemSkill)

#endif // SYSTEMSKILLS_H
