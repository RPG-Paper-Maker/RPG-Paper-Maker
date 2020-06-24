/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCHARACTERISTIC_H
#define SYSTEMCHARACTERISTIC_H

#include "superlistitem.h"
#include "characteristickind.h"
#include "primitivevalue.h"
#include "increasedecreasekind.h"

// -------------------------------------------------------
//
//  CLASS SystemCharacteristic
//
//  A particulary characteristic (datas).
//
// -------------------------------------------------------

class SystemCharacteristic : public SuperListItem
{
public:
    static const QString JSON_KIND;
    static const QString JSON_IS_INCREASE_DESCREASE;
    static const QString JSON_INCREASE_DESCREASE_KIND;
    static const QString JSON_STAT_VALUE_ID;
    static const QString JSON_ELEMENT_RES_ID;
    static const QString JSON_STATUS_RES_ID;
    static const QString JSON_CURRENCY_GAIN_ID;
    static const QString JSON_SKILL_COST_ID;
    static const QString JSON_IS_ALL_SKILL_COST;
    static const QString JSON_VARIABLE_ID;
    static const QString JSON_OPERATION;
    static const QString JSON_VALUE;
    static const QString JSON_UNIT;
    static const QString JSON_SCRIPT;
    static const QString JSON_IS_ALLOW_EQUIP;
    static const QString JSON_IS_ALLOW_EQUIP_WEAPON;
    static const QString JSON_EQUIP_WEAPON_TYPE_ID;
    static const QString JSON_EQUIP_ARMOR_TYPE_ID;
    static const QString JSON_IS_ALLOW_CHANGE_EQUIPMENT;
    static const QString JSON_CHANGE_EQUIPMENT_ID;
    static const QString JSON_BEGIN_EQUIPMENT_ID;
    static const QString JSON_IS_BEGIN_WEAPON;
    static const QString JSON_BEGIN_WEAPON_ARMOR_ID;

    SystemCharacteristic();
    SystemCharacteristic(CharacteristicKind kind, bool isIncreaseDecrease,
        IncreaseDecreaseKind increaseDecreaseKind, PrimitiveValue
        *statValueID, PrimitiveValue *elementResID, PrimitiveValue *statusResID,
        PrimitiveValue *currencyGainID, PrimitiveValue *skillCostID, bool
        m_isAllSkillCost, int variableID, bool operation, PrimitiveValue *value,
        bool unit, PrimitiveValue *script, bool isAllowEquip, bool
        isAllowEquipWeapon, PrimitiveValue *equipWeaponTypeID, PrimitiveValue
        *equipArmorTypeID, bool isAllowChangeEquipment, PrimitiveValue
        *changeEquipmentID, PrimitiveValue *beginEquipmentID, bool isBeginWeapon
        , PrimitiveValue *beginWeaponArmorID);
    virtual ~SystemCharacteristic();
    CharacteristicKind kind() const;
    void setKind(CharacteristicKind k);
    bool isIncreaseDecrease() const;
    void setIsIncreaseDecrease(bool b);
    SuperListItem * increaseDecreaseKind() const;
    PrimitiveValue * statValueID() const;
    PrimitiveValue * elementResID() const;
    PrimitiveValue * statusResID() const;
    PrimitiveValue * currencyGainID() const;
    PrimitiveValue * skillCostID() const;
    bool isAllSkillCost() const;
    void setIsAllSkillCost(bool b);
    SuperListItem * variableID() const;
    bool operation() const;
    void setOperation(bool b);
    PrimitiveValue * value() const;
    bool unit() const;
    void setUnit(bool b);
    PrimitiveValue * script() const;
    bool isAllowEquip() const;
    void setIsAllowEquip(bool b);
    bool isAllowEquipWeapon() const;
    void setIsAllowEquipWeapon(bool b);
    PrimitiveValue * equipWeaponTypeID() const;
    PrimitiveValue * equipArmorTypeID() const;
    bool isAllowChangeEquipment() const;
    void setIsAllowChangeEquipment(bool b);
    PrimitiveValue * changeEquipmentID() const;
    PrimitiveValue * beginEquipmentID() const;
    bool isBeginWeapon() const;
    void setIsBeginWeapon(bool b);
    QStandardItemModel * modelBeginWeaponArmor() const;
    PrimitiveValue * beginWeaponArmorID() const;

    static SystemCharacteristic * createBuff(int stat, int value, bool operation,
        bool unit);
    void updateModelBeginWeaponArmor();

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    CharacteristicKind m_kind;
    bool m_isIncreaseDecrease;
    SuperListItem *m_increaseDecreaseKind;
    PrimitiveValue *m_statValueID;
    PrimitiveValue *m_elementResID;
    PrimitiveValue *m_statusResID;
    PrimitiveValue *m_currencyGainID;
    PrimitiveValue *m_skillCostID;
    bool m_isAllSkillCost;
    SuperListItem *m_variableID;
    bool m_operation;
    PrimitiveValue *m_value;
    bool m_unit;
    PrimitiveValue *m_script;
    bool m_isAllowEquip;
    bool m_isAllowEquipWeapon;
    PrimitiveValue *m_equipWeaponTypeID;
    PrimitiveValue *m_equipArmorTypeID;
    bool m_isAllowChangeEquipment;
    PrimitiveValue *m_changeEquipmentID;
    PrimitiveValue *m_beginEquipmentID;
    bool m_isBeginWeapon;
    QStandardItemModel *m_modelBeginWeaponArmor;
    PrimitiveValue *m_beginWeaponArmorID;

    void updateModelBeginSpecific(QStandardItemModel *modelKind,
        QStandardItemModel *model);
};

Q_DECLARE_METATYPE(SystemCharacteristic)

#endif // SYSTEMCHARACTERISTIC_H
