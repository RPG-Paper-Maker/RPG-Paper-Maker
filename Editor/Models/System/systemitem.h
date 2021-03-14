/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    SystemItem(int i, QString name, int pictureID, int type, bool consumable,
        SystemLang *description, TargetKind targetKind, PrimitiveValue
        *conditionFormula, AvailableKind availableKind, SystemPlaySong *sound,
        PrimitiveValue *animationUserID, PrimitiveValue *animationTargetID,
        QStandardItemModel *price, QStandardItemModel *modelEffects);
    virtual ~SystemItem();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
};

Q_DECLARE_METATYPE(SystemItem)

#endif // SYSTEMITEM_H
