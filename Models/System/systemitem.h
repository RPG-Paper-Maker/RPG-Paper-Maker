/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMITEM_H
#define SYSTEMITEM_H

#include "systemcommonskillitem.h"

// -------------------------------------------------------
//
//  CLASS SystemItem
//
//  A particulary item (datas).
//
// -------------------------------------------------------

class SystemItem : public SystemCommonSkillItem
{
public:
    SystemItem();
    SystemItem(int i, LangsTranslation *names, int pictureID, int type, bool
        consumable, LangsTranslation *description, TargetKind targetKind,
        PrimitiveValue *conditionFormula, AvailableKind availableKind,
        SystemPlaySong *sound, PrimitiveValue *animationUserID, PrimitiveValue
        *animationTargetID, PrimitiveValue *price, QStandardItemModel
        *modelEffects);
    virtual ~SystemItem();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemItem)

#endif // SYSTEMITEM_H
