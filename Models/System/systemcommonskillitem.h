/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/


#ifndef SYSTEMCOMMONSKILLITEM_H
#define SYSTEMCOMMONSKILLITEM_H

#include <QStandardItemModel>
#include <QMetaType>
#include "systemicon.h"
#include "eventcommand.h"
#include "systemplaysong.h"
#include "targetkind.h"
#include "availablekind.h"

// -------------------------------------------------------
//
//  CLASS SystemCommonSkillItem
//
//  A particulary common for skills, items, weapons, and armors (datas).
//
// -------------------------------------------------------

class SystemCommonSkillItem : public SystemIcon
{
public:
    static const QString JSON_TYPE;
    static const QString JSON_CONSUMABLE;
    static const QString JSON_ONE_HAND;
    static const QString JSON_DESCRIPTION;
    static const QString JSON_TARGET_KIND;
    static const QString JSON_TARGET_CONDITION_FORMULA;
    static const QString JSON_CONDITION_FORMULA;
    static const QString JSON_AVAILABLE_KIND;
    static const QString JSON_SOUND;
    static const QString JSON_ANIMATION_USER_ID;
    static const QString JSON_ANIMATION_TARGET_ID;
    static const QString JSON_PRICE;
    static const QString JSON_COSTS;
    static const QString JSON_EFFECTS;
    static const QString JSON_CARACTERISTICS;

    SystemCommonSkillItem();
    SystemCommonSkillItem(int i, LangsTranslation *names, int pictureID, int
        type, bool consumable, bool oneHand, LangsTranslation *description,
        TargetKind targetKind, PrimitiveValue *targetConditionFormula,
        PrimitiveValue *conditionFormula, AvailableKind availableKind,
        SystemPlaySong *sound, PrimitiveValue *animationUserID, PrimitiveValue
        *animationTargetID, PrimitiveValue *price, QStandardItemModel
        *modelCosts, QStandardItemModel *modelEffects, QStandardItemModel
        *modelCaracteristics);
    virtual ~SystemCommonSkillItem();
    int type() const;
    void setType(int t);
    bool consumable() const;
    void setConsumable(bool b);
    bool oneHand() const;
    void setOneHand(bool b);
    LangsTranslation * description() const;
    TargetKind targetKind() const;
    void setTargetKind(TargetKind k);
    PrimitiveValue * targetConditionFormula() const;
    PrimitiveValue * conditionFormula() const;
    AvailableKind availableKind() const;
    void setAvailableKind(AvailableKind k);
    SystemPlaySong * sound() const;
    PrimitiveValue * animationUserID() const;
    PrimitiveValue * animationTargetID() const;
    PrimitiveValue * price() const;
    QStandardItemModel * modelCosts() const;
    QStandardItemModel * modelEffects() const;
    QStandardItemModel * modelCaracteristics() const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemCommonSkillItem &skillItem);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_type;
    bool m_consumable;
    bool m_oneHand;
    LangsTranslation *m_description;
    TargetKind m_targetKind;
    PrimitiveValue *m_targetConditionFormula;
    PrimitiveValue *m_conditionFormula;
    AvailableKind m_availableKind;
    SystemPlaySong *m_sound;
    PrimitiveValue *m_animationUserID;
    PrimitiveValue *m_animationTargetID;
    PrimitiveValue *m_price;
    QStandardItemModel *m_modelCosts;
    QStandardItemModel *m_modelEffects;
    QStandardItemModel *m_modelCaracteristics;
};

Q_DECLARE_METATYPE(SystemCommonSkillItem)

#endif // SYSTEMCOMMONSKILLITEM_H
