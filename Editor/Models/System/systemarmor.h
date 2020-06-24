/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
