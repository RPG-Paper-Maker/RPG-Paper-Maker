/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcharacteristic.h"
#include "rpm.h"
#include "common.h"
#include "systemweaponarmorkind.h"
#include "systemcommonskillitem.h"
#include "dialogsystemcharacteristic.h"

const QString SystemCharacteristic::JSON_KIND = "k";
const QString SystemCharacteristic::JSON_IS_INCREASE_DESCREASE = "iid";
const QString SystemCharacteristic::JSON_INCREASE_DESCREASE_KIND = "idk";
const QString SystemCharacteristic::JSON_STAT_VALUE_ID = "svid";
const QString SystemCharacteristic::JSON_ELEMENT_RES_ID = "erid";
const QString SystemCharacteristic::JSON_STATUS_RES_ID = "strid";
const QString SystemCharacteristic::JSON_CURRENCY_GAIN_ID = "cgid";
const QString SystemCharacteristic::JSON_SKILL_COST_ID = "scid";
const QString SystemCharacteristic::JSON_IS_ALL_SKILL_COST = "iasc";
const QString SystemCharacteristic::JSON_VARIABLE_ID = "vid";
const QString SystemCharacteristic::JSON_OPERATION = "o";
const QString SystemCharacteristic::JSON_VALUE = "v";
const QString SystemCharacteristic::JSON_UNIT = "u";
const QString SystemCharacteristic::JSON_SCRIPT = "s";
const QString SystemCharacteristic::JSON_IS_ALLOW_EQUIP = "iae";
const QString SystemCharacteristic::JSON_IS_ALLOW_EQUIP_WEAPON = "iaew";
const QString SystemCharacteristic::JSON_EQUIP_WEAPON_TYPE_ID = "ewtid";
const QString SystemCharacteristic::JSON_EQUIP_ARMOR_TYPE_ID = "eatid";
const QString SystemCharacteristic::JSON_IS_ALLOW_CHANGE_EQUIPMENT= "iace";
const QString SystemCharacteristic::JSON_CHANGE_EQUIPMENT_ID = "ceid";
const QString SystemCharacteristic::JSON_BEGIN_EQUIPMENT_ID = "beid";
const QString SystemCharacteristic::JSON_IS_BEGIN_WEAPON = "ibw";
const QString SystemCharacteristic::JSON_BEGIN_WEAPON_ARMOR_ID = "bwaid";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCharacteristic::SystemCharacteristic() :
    SystemCharacteristic(CharacteristicKind::IncreaseDecrease, true,
        IncreaseDecreaseKind::StatValue, PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), true, 1, true, PrimitiveValue
        ::createDefaultNumberValue(), true, PrimitiveValue
        ::createDefaultMessageValue(), true, true, PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), true, PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), true, PrimitiveValue
        ::createDefaultDataBaseValue())
{

}

SystemCharacteristic::SystemCharacteristic(CharacteristicKind kind, bool
    isIncreaseDecrease, IncreaseDecreaseKind increaseDecreaseKind,
    PrimitiveValue *statValueID, PrimitiveValue *elementResID, PrimitiveValue
    *statusResID, PrimitiveValue *currencyGainID, PrimitiveValue *skillCostID,
    bool isAllSkillCost, int variableID, bool operation, PrimitiveValue *value,
    bool unit, PrimitiveValue *script, bool isAllowEquip, bool
    isAllowEquipWeapon, PrimitiveValue *equipWeaponTypeID, PrimitiveValue
    *equipArmorTypeID, bool isAllowChangeEquipment, PrimitiveValue
    *changeEquipmentID, PrimitiveValue *beginEquipmentID, bool isBeginWeapon,
    PrimitiveValue *beginWeaponArmorID) :
    SuperListItem(-1, "", true),
    m_kind(kind),
    m_isIncreaseDecrease(isIncreaseDecrease),
    m_increaseDecreaseKind(new SuperListItem(static_cast<int>(
        increaseDecreaseKind))),
    m_statValueID(statValueID),
    m_elementResID(elementResID),
    m_statusResID(statusResID),
    m_currencyGainID(currencyGainID),
    m_skillCostID(skillCostID),
    m_isAllSkillCost(isAllSkillCost),
    m_variableID(new SuperListItem(variableID)),
    m_operation(operation),
    m_value(value),
    m_unit(unit),
    m_script(script),
    m_isAllowEquip(isAllowEquip),
    m_isAllowEquipWeapon(isAllowEquipWeapon),
    m_equipWeaponTypeID(equipWeaponTypeID),
    m_equipArmorTypeID(equipArmorTypeID),
    m_isAllowChangeEquipment(isAllowChangeEquipment),
    m_changeEquipmentID(changeEquipmentID),
    m_beginEquipmentID(beginEquipmentID),
    m_isBeginWeapon(isBeginWeapon),
    m_modelBeginWeaponArmor(new QStandardItemModel),
    m_beginWeaponArmorID(beginWeaponArmorID)
{
    m_statValueID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonStatistics());
    m_elementResID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelElements());
    m_statusResID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->statusDatas()->model());
    m_currencyGainID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelCurrencies());
    m_skillCostID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->skillsDatas()->model());
    m_equipWeaponTypeID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelWeaponsKind());
    m_equipArmorTypeID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelArmorsKind());
    m_changeEquipmentID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonEquipment());
    m_beginEquipmentID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonEquipment());
    m_beginWeaponArmorID->setModelDataBase(m_modelBeginWeaponArmor);
}

SystemCharacteristic::~SystemCharacteristic() {
    delete m_increaseDecreaseKind;
    delete m_statValueID;
    delete m_elementResID;
    delete m_statusResID;
    delete m_currencyGainID;
    delete m_skillCostID;
    delete m_variableID;
    delete m_value;
    delete m_script;
    delete m_equipWeaponTypeID;
    delete m_equipArmorTypeID;
    delete m_changeEquipmentID;
    delete m_beginEquipmentID;
    delete m_modelBeginWeaponArmor;
    delete m_beginWeaponArmorID;
}

CharacteristicKind SystemCharacteristic::kind() const {
    return m_kind;
}

void SystemCharacteristic::setKind(CharacteristicKind k) {
    m_kind = k;
}

bool SystemCharacteristic::isIncreaseDecrease() const {
    return m_isIncreaseDecrease;
}

void SystemCharacteristic::setIsIncreaseDecrease(bool b) {
    m_isIncreaseDecrease = b;
}

SuperListItem * SystemCharacteristic::increaseDecreaseKind() const {
    return m_increaseDecreaseKind;
}

PrimitiveValue * SystemCharacteristic::statValueID() const {
    return m_statValueID;
}

PrimitiveValue * SystemCharacteristic::elementResID() const {
    return m_elementResID;
}

PrimitiveValue * SystemCharacteristic::statusResID() const {
    return m_statusResID;
}

PrimitiveValue * SystemCharacteristic::currencyGainID() const {
    return m_currencyGainID;
}

PrimitiveValue * SystemCharacteristic::skillCostID() const {
    return m_skillCostID;
}

bool SystemCharacteristic::isAllSkillCost() const {
    return m_isAllSkillCost;
}

void SystemCharacteristic::setIsAllSkillCost(bool b) {
    m_isAllSkillCost = b;
}

SuperListItem * SystemCharacteristic::variableID() const {
    return m_variableID;
}

bool SystemCharacteristic::operation() const {
    return m_operation;
}

void SystemCharacteristic::setOperation(bool b) {
    m_operation = b;
}

PrimitiveValue * SystemCharacteristic::value() const {
    return m_value;
}

bool SystemCharacteristic::unit() const {
    return m_unit;
}

void SystemCharacteristic::setUnit(bool b) {
    m_unit = b;
}

PrimitiveValue * SystemCharacteristic::script() const {
    return m_script;
}

bool SystemCharacteristic::isAllowEquip() const {
    return m_isAllowEquip;
}

void SystemCharacteristic::setIsAllowEquip(bool b) {
    m_isAllowEquip = b;
}

bool SystemCharacteristic::isAllowEquipWeapon() const {
    return m_isAllowEquipWeapon;
}

void SystemCharacteristic::setIsAllowEquipWeapon(bool b) {
    m_isAllowEquipWeapon = b;
}

PrimitiveValue * SystemCharacteristic::equipWeaponTypeID() const {
    return m_equipWeaponTypeID;
}

PrimitiveValue * SystemCharacteristic::equipArmorTypeID() const {
    return m_equipArmorTypeID;
}

bool SystemCharacteristic::isAllowChangeEquipment() const {
    return m_isAllowChangeEquipment;
}

void SystemCharacteristic::setIsAllowChangeEquipment(bool b) {
    m_isAllowChangeEquipment = b;
}

PrimitiveValue * SystemCharacteristic::changeEquipmentID() const {
    return m_changeEquipmentID;
}

PrimitiveValue * SystemCharacteristic::beginEquipmentID() const {
    return m_beginEquipmentID;
}

bool SystemCharacteristic::isBeginWeapon() const {
    return  m_isBeginWeapon;
}

void SystemCharacteristic::setIsBeginWeapon(bool b) {
    m_isBeginWeapon = b;
}

QStandardItemModel * SystemCharacteristic::modelBeginWeaponArmor() const {
    return m_modelBeginWeaponArmor;
}

PrimitiveValue * SystemCharacteristic::beginWeaponArmorID() const {
    return m_beginWeaponArmorID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemCharacteristic * SystemCharacteristic::createBuff(int stat, int value, bool
    operation, bool unit)
{
    return new SystemCharacteristic(CharacteristicKind::IncreaseDecrease, true,
       IncreaseDecreaseKind::StatValue, new PrimitiveValue(PrimitiveValueKind
       ::DataBase, stat), PrimitiveValue::createDefaultDataBaseValue(),
       PrimitiveValue::createDefaultDataBaseValue(), PrimitiveValue
       ::createDefaultDataBaseValue(), PrimitiveValue
       ::createDefaultDataBaseValue(), true, 1, operation, new PrimitiveValue(
       value), unit, PrimitiveValue::createDefaultMessageValue(), true, true,
       PrimitiveValue::createDefaultDataBaseValue(), PrimitiveValue
       ::createDefaultDataBaseValue(), true, PrimitiveValue
       ::createDefaultDataBaseValue(), PrimitiveValue
       ::createDefaultDataBaseValue(), true, PrimitiveValue
       ::createDefaultDataBaseValue());
}

// -------------------------------------------------------

void SystemCharacteristic::updateModelBeginWeaponArmor() {
    if (m_isBeginWeapon) {
        updateModelBeginSpecific(RPM::get()->project()->gameDatas()
            ->battleSystemDatas()->modelWeaponsKind(), RPM::get()->project()
            ->gameDatas()->weaponsDatas()->model());
    } else {
        updateModelBeginSpecific(RPM::get()->project()->gameDatas()
            ->battleSystemDatas()->modelArmorsKind(), RPM::get()->project()
            ->gameDatas()->armorsDatas()->model());
    }
}

// -------------------------------------------------------

void SystemCharacteristic::updateModelBeginSpecific(QStandardItemModel *modelKind
    , QStandardItemModel *model)
{
    QVector<int> possibleKind;
    SystemWeaponArmorKind *kind;
    SystemCommonSkillItem *sys;
    QStandardItem *item;
    int i, l, id;

    id = m_beginEquipmentID->kind() == PrimitiveValueKind::Variable ? -1 :
        m_beginEquipmentID->numberValue();
    m_modelBeginWeaponArmor->clear();
    if (id != -1) {
        for (i = 0, l = modelKind->invisibleRootItem()->rowCount(); i < l; i++) {
            kind = reinterpret_cast<SystemWeaponArmorKind *>(modelKind->item(i)
                 ->data().value<quintptr>());
            if (kind->getEquipmenAt(id)) {
                possibleKind.append(kind->id());
            }
        }
    }
    for (i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        item = model->item(i);
        sys = reinterpret_cast<SystemCommonSkillItem *>(item->data().value<
            quintptr>());
        if (id == -1 || possibleKind.contains(sys->type())) {
            m_modelBeginWeaponArmor->appendRow(sys->getModelRow());
        }
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemCharacteristic::openDialog() {
    SystemCharacteristic characteristic;
    characteristic.setCopy(*this);
    DialogSystemCharacteristic dialog(characteristic);
    if (dialog.exec() == QDialog::Accepted) {
        setCopy(characteristic);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem* SystemCharacteristic::createCopy() const {
    SystemCharacteristic* super = new SystemCharacteristic;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCharacteristic::setCopy(const SystemCharacteristic& characteristic) {
    SuperListItem::setCopy(characteristic);
    int i, l;

    m_kind = characteristic.m_kind;
    m_isIncreaseDecrease = characteristic.m_isIncreaseDecrease;
    m_increaseDecreaseKind->setId(characteristic.m_increaseDecreaseKind->id());
    m_statValueID->setCopy(*characteristic.m_statValueID);
    m_elementResID->setCopy(*characteristic.m_elementResID);
    m_statusResID->setCopy(*characteristic.m_statusResID);
    m_currencyGainID->setCopy(*characteristic.m_currencyGainID);
    m_skillCostID->setCopy(*characteristic.m_skillCostID);
    m_isAllSkillCost = characteristic.m_isAllSkillCost;
    m_variableID->setId(characteristic.m_variableID->id());
    m_operation = characteristic.m_operation;
    m_value->setCopy(*characteristic.m_value);
    m_unit = characteristic.m_unit;
    m_script->setCopy(*characteristic.m_script);
    m_isAllowEquip = characteristic.m_isAllowEquip;
    m_isAllowEquipWeapon = characteristic.m_isAllowEquipWeapon;
    m_equipWeaponTypeID->setCopy(*characteristic.m_equipWeaponTypeID);
    m_equipArmorTypeID->setCopy(*characteristic.m_equipArmorTypeID);
    m_isAllowChangeEquipment = characteristic.m_isAllowChangeEquipment;
    m_changeEquipmentID->setCopy(*characteristic.m_changeEquipmentID);
    m_beginEquipmentID->setCopy(*characteristic.m_beginEquipmentID);
    m_isBeginWeapon = characteristic.m_isBeginWeapon;
    m_beginWeaponArmorID->setCopy(*characteristic.m_beginWeaponArmorID);
    m_beginWeaponArmorID->setModelDataBase(m_modelBeginWeaponArmor);

    // Model weapon armor (begin)
    m_modelBeginWeaponArmor->clear();
    for (i = 0, l = characteristic.m_modelBeginWeaponArmor->invisibleRootItem()
        ->rowCount(); i < l; i++)
    {
        m_modelBeginWeaponArmor->insertRow(i, reinterpret_cast<
            SystemCommonSkillItem *>(characteristic.m_modelBeginWeaponArmor->item
            (i)->data().value<quintptr>())->getModelRow());
    }
}

// -------------------------------------------------------

QString SystemCharacteristic::toString() const {
    QString text = SuperListItem::beginningText;
    switch (m_kind) {
    case CharacteristicKind::IncreaseDecrease:
    {
        text += QString(m_isIncreaseDecrease ? "Increase" : "Decrease") + " " +
            Common::enumToStringIncreaseDecreaseKind.at(m_increaseDecreaseKind
            ->id()) + " ";
        switch (static_cast<IncreaseDecreaseKind>(m_increaseDecreaseKind->id()))
        {
        case IncreaseDecreaseKind::StatValue:
            text += m_statValueID->toString();
            break;
        case IncreaseDecreaseKind::ElementRes:
            text += m_elementResID->toString();
            break;
        case IncreaseDecreaseKind::StatusRes:
            text += m_statusResID->toString();
            break;
        case IncreaseDecreaseKind::CurrencyGain:
            text += m_currencyGainID->toString();
            break;
        case IncreaseDecreaseKind::SkillCost:
            text += m_isAllSkillCost ? "(all)" : m_skillCostID->toString();
            break;
        case IncreaseDecreaseKind::Variable:
            text += QString::number(m_variableID->id());
            break;
        default:
            break;
        }
        text += QString(" ") + (m_operation ? "*" : "+") + " " + m_value
            ->toString() + " " + (m_unit ? "%" : "");
        break;
    }
    case CharacteristicKind::AllowForbidEquip:
        text += (m_isAllowEquip ? "Allow" : "Forbid") + QString(" equip ") + (
            m_isAllowEquipWeapon ? "weapon " + m_equipWeaponTypeID->toString() :
            "armor " + m_equipArmorTypeID->toString());
        break;
    case CharacteristicKind::AllowForbidChange:
        text += (m_isAllowChangeEquipment ? "Allow" : "Forbid") + QString(
            " change equipment ") + m_changeEquipmentID->toString();
        break;
    case CharacteristicKind::BeginEquipment:
        text += "Begin equiment " + m_beginEquipmentID->toString() + " with " +
            (m_isBeginWeapon ? "weapon" : "armor") + " " + m_beginWeaponArmorID
            ->toString();
        break;
    case CharacteristicKind::Script:
        text += "Script: " + m_script->toString();
        break;
    }

    return text;
}

// -------------------------------------------------------

void SystemCharacteristic::read(const QJsonObject &json) {
    if (json.contains(JSON_KIND)) {
        m_kind = static_cast<CharacteristicKind>(json[JSON_KIND].toInt());
    }

    switch (m_kind) {
    case CharacteristicKind::IncreaseDecrease:
    {
        if (json.contains(JSON_IS_INCREASE_DESCREASE)) {
            m_isIncreaseDecrease = json[JSON_IS_INCREASE_DESCREASE].toBool();
        }
        if (json.contains(JSON_INCREASE_DESCREASE_KIND)) {
            m_increaseDecreaseKind->setId(json[JSON_INCREASE_DESCREASE_KIND]
                .toInt());
        }
        switch (static_cast<IncreaseDecreaseKind>(m_increaseDecreaseKind->id()))
        {
        case IncreaseDecreaseKind::StatValue:
            if (json.contains(JSON_STAT_VALUE_ID)) {
                m_statValueID->read(json[JSON_STAT_VALUE_ID].toObject());
            }
            break;
        case IncreaseDecreaseKind::ElementRes:
            if (json.contains(JSON_ELEMENT_RES_ID)) {
                m_elementResID->read(json[JSON_ELEMENT_RES_ID].toObject());
            }
            break;
        case IncreaseDecreaseKind::StatusRes:
            if (json.contains(JSON_STATUS_RES_ID)) {
                m_statusResID->read(json[JSON_STATUS_RES_ID].toObject());
            }
            break;
        case IncreaseDecreaseKind::CurrencyGain:
            if (json.contains(JSON_CURRENCY_GAIN_ID)) {
                m_currencyGainID->read(json[JSON_CURRENCY_GAIN_ID].toObject());
            }
            break;
        case IncreaseDecreaseKind::SkillCost:
            if (json.contains(JSON_SKILL_COST_ID)) {
                m_skillCostID->read(json[JSON_SKILL_COST_ID].toObject());
            }
            break;
        case IncreaseDecreaseKind::Variable:
            if (json.contains(JSON_VARIABLE_ID)) {
                m_variableID->setId(json[JSON_VARIABLE_ID].toInt());
            }
            break;
        default:
            break;
        }
        if (json.contains(JSON_OPERATION)) {
            m_operation = json[JSON_OPERATION].toBool();
        }
        if (json.contains(JSON_VALUE)) {
            m_value->read(json[JSON_VALUE].toObject());
        }
        if (json.contains(JSON_UNIT)) {
            m_unit = json[JSON_UNIT].toBool();
        }
        break;
    }
    case CharacteristicKind::Script:
        if (json.contains(JSON_SCRIPT)) {
            m_script->read(json[JSON_SCRIPT].toObject());
        }
        break;
    case CharacteristicKind::AllowForbidEquip:
        if (json.contains(JSON_IS_ALLOW_EQUIP)) {
            m_isAllowEquip = json[JSON_IS_ALLOW_EQUIP].toBool();
        }
        if (json.contains(JSON_IS_ALLOW_EQUIP_WEAPON)) {
            m_isAllowEquipWeapon = json[JSON_IS_ALLOW_EQUIP_WEAPON].toBool();
        }
        if (m_isAllowEquipWeapon) {
            if (json.contains(JSON_EQUIP_WEAPON_TYPE_ID)) {
                m_equipWeaponTypeID->read(json[JSON_EQUIP_WEAPON_TYPE_ID]
                    .toObject());
            }
        } else {
            if (json.contains(JSON_EQUIP_ARMOR_TYPE_ID)) {
                m_equipArmorTypeID->read(json[JSON_EQUIP_ARMOR_TYPE_ID]
                    .toObject());
            }
        }
        break;
    case CharacteristicKind::AllowForbidChange:
        if (json.contains(JSON_IS_ALLOW_CHANGE_EQUIPMENT)) {
            m_isAllowChangeEquipment = json[JSON_IS_ALLOW_CHANGE_EQUIPMENT]
                .toBool();
        }
        if (json.contains(JSON_CHANGE_EQUIPMENT_ID)) {
            m_changeEquipmentID->read(json[JSON_CHANGE_EQUIPMENT_ID].toObject());
        }
        break;
    case CharacteristicKind::BeginEquipment:
        if (json.contains(JSON_BEGIN_EQUIPMENT_ID)) {
            m_beginEquipmentID->read(json[JSON_BEGIN_EQUIPMENT_ID].toObject());
        }
        if (json.contains(JSON_IS_BEGIN_WEAPON)) {
            m_isBeginWeapon = json[JSON_IS_BEGIN_WEAPON].toBool();
        }
        if (json.contains(JSON_BEGIN_WEAPON_ARMOR_ID)) {
            m_beginWeaponArmorID->read(json[JSON_BEGIN_WEAPON_ARMOR_ID]
                .toObject());
        }
        break;
    }
}

// -------------------------------------------------------

void SystemCharacteristic::write(QJsonObject &json) const {
    QJsonObject obj;

    if (m_kind != CharacteristicKind::IncreaseDecrease) {
        json[JSON_KIND] = static_cast<int>(m_kind);
    }
    switch (m_kind) {
    case CharacteristicKind::IncreaseDecrease:
    {
        if (!m_isIncreaseDecrease) {
            json[JSON_IS_INCREASE_DESCREASE] = m_isIncreaseDecrease;
        }
        if (m_increaseDecreaseKind->id() != 0) {
            json[JSON_INCREASE_DESCREASE_KIND] = m_increaseDecreaseKind->id();
        }
        switch (static_cast<IncreaseDecreaseKind>(m_increaseDecreaseKind->id()))
        {
        case IncreaseDecreaseKind::StatValue:
            if (!m_statValueID->isDefaultDataBaseValue()) {
                obj = QJsonObject();
                m_statValueID->write(obj);
                json[JSON_STAT_VALUE_ID] = obj;
            }
            break;
        case IncreaseDecreaseKind::ElementRes:
            if (!m_elementResID->isDefaultDataBaseValue()) {
                obj = QJsonObject();
                m_elementResID->write(obj);
                json[JSON_ELEMENT_RES_ID] = obj;
            }
            break;
        case IncreaseDecreaseKind::StatusRes:
            if (!m_statusResID->isDefaultDataBaseValue()) {
                obj = QJsonObject();
                m_statusResID->write(obj);
                json[JSON_STATUS_RES_ID] = obj;
            }
            break;
        case IncreaseDecreaseKind::CurrencyGain:
            if (!m_currencyGainID->isDefaultDataBaseValue()) {
                obj = QJsonObject();
                m_currencyGainID->write(obj);
                json[JSON_CURRENCY_GAIN_ID] = obj;
            }
            break;
        case IncreaseDecreaseKind::SkillCost:
            if (!m_isAllSkillCost) {
                json[JSON_IS_ALL_SKILL_COST] = m_isAllSkillCost;
                if (!m_skillCostID->isDefaultDataBaseValue()) {
                    obj = QJsonObject();
                    m_skillCostID->write(obj);
                    json[JSON_STAT_VALUE_ID] = obj;
                }
            }
            break;
        case IncreaseDecreaseKind::Variable:
            if (m_variableID->id() != 1) {
                json[JSON_VARIABLE_ID] = m_variableID->id();
            }
            break;
        default:
            break;
        }
        if (!m_operation) {
            json[JSON_OPERATION] = m_operation;
        }
        if (!m_value->isDefaultNumberValue()) {
            obj = QJsonObject();
            m_value->write(obj);
            json[JSON_VALUE] = obj;
        }
        if (!m_unit) {
            json[JSON_UNIT] = m_unit;
        }
        break;
    }
    case CharacteristicKind::Script:
        if (!m_script->isDefaultMessageValue()) {
            obj = QJsonObject();
            m_script->write(obj);
            json[JSON_SCRIPT] = obj;
        }
        break;
    case CharacteristicKind::AllowForbidEquip:
        if (!m_isAllowEquip) {
            json[JSON_IS_ALLOW_EQUIP] = m_isAllowEquip;
        }
        if (!m_isAllowEquipWeapon) {
            json[JSON_IS_ALLOW_EQUIP_WEAPON] = m_isAllowEquip;
            if (!m_equipArmorTypeID->isDefaultDataBaseValue()) {
                obj = QJsonObject();
                m_equipArmorTypeID->write(obj);
                json[JSON_EQUIP_ARMOR_TYPE_ID] = obj;
            }
        } else {
            if (!m_equipWeaponTypeID->isDefaultDataBaseValue()) {
                obj = QJsonObject();
                m_equipWeaponTypeID->write(obj);
                json[JSON_EQUIP_WEAPON_TYPE_ID] = obj;
            }
        }
        break;
    case CharacteristicKind::AllowForbidChange:
        if (!m_isAllowChangeEquipment) {
            json[JSON_IS_ALLOW_CHANGE_EQUIPMENT] = m_isAllowChangeEquipment;
        }
        if (!m_changeEquipmentID->isDefaultDataBaseValue()) {
            obj = QJsonObject();
            m_changeEquipmentID->write(obj);
            json[JSON_CHANGE_EQUIPMENT_ID] = obj;
        }
        break;
    case CharacteristicKind::BeginEquipment:
        if (!m_beginEquipmentID->isDefaultDataBaseValue()) {
            obj = QJsonObject();
            m_beginEquipmentID->write(obj);
            json[JSON_BEGIN_EQUIPMENT_ID] = obj;
        }
        if (!m_isBeginWeapon) {
            json[JSON_IS_BEGIN_WEAPON] = m_isBeginWeapon;
        }
        if (!m_beginWeaponArmorID->isDefaultDataBaseValue()) {
            obj = QJsonObject();
            m_beginWeaponArmorID->write(obj);
            json[JSON_BEGIN_WEAPON_ARMOR_ID] = obj;
        }
        break;
    }
}

