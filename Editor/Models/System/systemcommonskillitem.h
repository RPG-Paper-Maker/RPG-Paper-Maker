/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static const QString JSON_CAN_BE_SOLD;
    static const QString JSON_BATTLE_MESSAGE;
    static const QString JSON_PRICE;
    static const QString JSON_COSTS;
    static const QString JSON_EFFECTS;
    static const QString JSON_CHARACTERISTICS;
    static const int DEFAULT_ID;
    static const QString DEFAULT_NAME;
    static const int DEFAULT_PICTURE_ID;
    static const int DEFAULT_TYPE;
    static const bool DEFAULT_CONSUMABLE;
    static const bool DEFAULT_ONE_HAND;
    static const TargetKind DEFAULT_TARGET_KIND;
    static const AvailableKind DEFAULT_AVAILABLE_KIND;

    SystemCommonSkillItem(int i = DEFAULT_ID, QString name = DEFAULT_NAME, int
        pictureID = DEFAULT_PICTURE_ID, int type = DEFAULT_TYPE, bool consumable
        = DEFAULT_CONSUMABLE, bool oneHand = DEFAULT_ONE_HAND, SystemTranslatable
        *description = new SystemTranslatable, TargetKind targetKind =
        DEFAULT_TARGET_KIND, PrimitiveValue *targetConditionFormula = new
        PrimitiveValue(PrimitiveValueKind::None), PrimitiveValue
        *conditionFormula = new PrimitiveValue(PrimitiveValueKind::None),
        AvailableKind availableKind = DEFAULT_AVAILABLE_KIND, SystemPlaySong
        *sound = new SystemPlaySong(-1, SongKind::Sound), PrimitiveValue
        *animationUserID = new PrimitiveValue(PrimitiveValueKind::None),
        PrimitiveValue *animationTargetID = new PrimitiveValue(PrimitiveValueKind
        ::None), PrimitiveValue *canBeSold = PrimitiveValue::createDefaultSwitchValue(),
        SystemTranslatable *battleMessage = new SystemTranslatable,
        QStandardItemModel *modelPrice = new QStandardItemModel, QStandardItemModel
        *modelCosts = new QStandardItemModel, QStandardItemModel *modelEffects =
        new QStandardItemModel, QStandardItemModel *modelCharacteristics = new
        QStandardItemModel);
    virtual ~SystemCommonSkillItem();
    int type() const;
    void setType(int t);
    bool consumable() const;
    void setConsumable(bool b);
    bool oneHand() const;
    void setOneHand(bool b);
    SystemTranslatable * description() const;
    TargetKind targetKind() const;
    void setTargetKind(TargetKind k);
    PrimitiveValue * targetConditionFormula() const;
    PrimitiveValue * conditionFormula() const;
    AvailableKind availableKind() const;
    void setAvailableKind(AvailableKind k);
    SystemPlaySong * sound() const;
    PrimitiveValue * animationUserID() const;
    PrimitiveValue * animationTargetID() const;
    PrimitiveValue * canBeSold() const;
    SystemTranslatable * battleMessage() const;
    QStandardItemModel * modelPrice() const;
    QStandardItemModel * modelCosts() const;
    QStandardItemModel * modelEffects() const;
    QStandardItemModel * modelCharacteristics() const;

    void initializeHeaders();

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_type;
    bool m_consumable;
    bool m_oneHand;
    SystemTranslatable *m_description;
    TargetKind m_targetKind;
    PrimitiveValue *m_targetConditionFormula;
    PrimitiveValue *m_conditionFormula;
    AvailableKind m_availableKind;
    SystemPlaySong *m_sound;
    PrimitiveValue *m_animationUserID;
    PrimitiveValue *m_animationTargetID;
    PrimitiveValue *m_canBeSold;
    SystemTranslatable *m_battleMessage;
    QStandardItemModel *m_modelPrice;
    QStandardItemModel *m_modelCosts;
    QStandardItemModel *m_modelEffects;
    QStandardItemModel *m_modelCharacteristics;
};

Q_DECLARE_METATYPE(SystemCommonSkillItem)

#endif // SYSTEMCOMMONSKILLITEM_H
