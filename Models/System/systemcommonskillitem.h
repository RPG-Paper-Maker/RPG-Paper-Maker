/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    static const QString JSON_CHARACTERISTICS;

    SystemCommonSkillItem();
    SystemCommonSkillItem(int i, LangsTranslation *names, int pictureID, int
        type, bool consumable, bool oneHand, LangsTranslation *description,
        TargetKind targetKind, PrimitiveValue *targetConditionFormula,
        PrimitiveValue *conditionFormula, AvailableKind availableKind,
        SystemPlaySong *sound, PrimitiveValue *animationUserID, PrimitiveValue
        *animationTargetID, PrimitiveValue *price, QStandardItemModel
        *modelCosts, QStandardItemModel *modelEffects, QStandardItemModel
        *modelCharacteristics);
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
    QStandardItemModel * modelCharacteristics() const;

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
    QStandardItemModel *m_modelCharacteristics;
};

Q_DECLARE_METATYPE(SystemCommonSkillItem)

#endif // SYSTEMCOMMONSKILLITEM_H
