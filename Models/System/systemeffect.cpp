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

#include "dialogsystemeffect.h"
#include "common.h"
#include "rpm.h"

const QString SystemEffect::JSON_KIND = "k";
const QString SystemEffect::JSON_DAMAGES_KIND = "dk";
const QString SystemEffect::JSON_DAMAGES_STATISTIC_ID = "dsid";
const QString SystemEffect::JSON_DAMAGES_CURRENCY_ID = "dcid";
const QString SystemEffect::JSON_DAMAGES_VARIABLE_ID = "dvid";
const QString SystemEffect::JSON_DAMAGES_FORMULA = "df";
const QString SystemEffect::JSON_IS_DAMAGE_ELEMENT = "ide";
const QString SystemEffect::JSON_DAMAGE_ELEMENT_ID = "deid";
const QString SystemEffect::JSON_IS_DAMAGE_VARIANCE = "idv";
const QString SystemEffect::JSON_DAMAGE_VARIANCE_FORMULA= "dvf";
const QString SystemEffect::JSON_IS_DAMAGE_CRITICAL = "idc";
const QString SystemEffect::JSON_DAMAGE_CRITICAL_FORMULA = "dcf";
const QString SystemEffect::JSON_IS_DAMAGE_PRECISION = "idp";
const QString SystemEffect::JSON_DAMAGE_PRECISION_FORMULA = "dpf";
const QString SystemEffect::JSON_IS_ADD_STATUS = "iast";
const QString SystemEffect::JSON_STATUS_ID = "sid";
const QString SystemEffect::JSON_STATUS_PRECISION_FORMULA = "spf";
const QString SystemEffect::JSON_IS_ADD_SKILL= "iask";
const QString SystemEffect::JSON_ADD_SKILL_ID = "asid";
const QString SystemEffect::JSON_PERFORM_SKILL_ID = "psid";
const QString SystemEffect::JSON_COMMON_REACTION_ID = "crid";
const QString SystemEffect::JSON_SPECIAL_ACTION_KIND = "sak";
const QString SystemEffect::JSON_SCRIPT_FORMULA = "sf";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemEffect::SystemEffect() :
    SystemEffect(EffectKind::Damages, DamagesKind::Stat, PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), 1, PrimitiveValue
        ::createDefaultMessageValue(), false, PrimitiveValue
        ::createDefaultDataBaseValue(), false, new PrimitiveValue(QString("0")),
        false, new PrimitiveValue(QString("0")), false, new PrimitiveValue(
        QString("100")), true, PrimitiveValue::createDefaultDataBaseValue(), new
        PrimitiveValue(QString("100")), true, PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), EffectSpecialActionKind::ApplyWeapons,
        PrimitiveValue::createDefaultMessageValue())
{

}

SystemEffect::SystemEffect(EffectKind kind, DamagesKind damageKind,
    PrimitiveValue *damagesStatisticID, PrimitiveValue *damagesCurrencyID, int
    damagesVariableID, PrimitiveValue *damagesFormula, bool isDamageElement,
    PrimitiveValue *damagesElementID, bool isDamageVariance, PrimitiveValue
    *damagesVarianceFormula, bool isDamageCritical, PrimitiveValue
    *damagesCriticalFormula, bool isDamagePrecision, PrimitiveValue
    *damagesPrecisionFormula, bool isAddStatus, PrimitiveValue *statusID,
    PrimitiveValue *statusPrecisionFormula, bool isAddSkill, PrimitiveValue
    *addSkillID, PrimitiveValue *performSkillID, PrimitiveValue
    *commonReactionID, EffectSpecialActionKind specialActionKind, PrimitiveValue
    *scriptFormula) :
    SuperListItem(-1, "", true),
    m_kind(kind),
    m_damagesKind(new SuperListItem(static_cast<int>(damageKind), "")),
    m_damagesStatisticID(damagesStatisticID),
    m_damagesCurrencyID(damagesCurrencyID),
    m_damagesVariableID(new SuperListItem(damagesVariableID, "")),
    m_damagesFormula(damagesFormula),
    m_isDamageElement(isDamageElement),
    m_damagesElementID(damagesElementID),
    m_isDamageVariance(isDamageVariance),
    m_damagesVarianceFormula(damagesVarianceFormula),
    m_isDamageCritical(isDamageCritical),
    m_damagesCriticalFormula(damagesCriticalFormula),
    m_isDamagePrecision(isDamagePrecision),
    m_damagesPrecisionFormula(damagesPrecisionFormula),
    m_isAddStatus(isAddStatus),
    m_statusID(statusID),
    m_statusPrecisionFormula(statusPrecisionFormula),
    m_isAddSkill(isAddSkill),
    m_addSkillID(addSkillID),
    m_performSkillID(performSkillID),
    m_commonReactionID(commonReactionID),
    m_specialActionKind(specialActionKind),
    m_scriptFormula(scriptFormula)
{
    m_damagesStatisticID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonStatistics());
    m_damagesCurrencyID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelCurrencies());
    m_damagesElementID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelElements());
    m_statusID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->statusDatas()->model());
    m_addSkillID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->skillsDatas()->model());
    m_performSkillID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->skillsDatas()->model());
    m_commonReactionID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelCommonReactors());
}

SystemEffect::~SystemEffect() {
    delete m_damagesKind;
    delete m_damagesStatisticID;
    delete m_damagesCurrencyID;
    delete m_damagesVariableID;
    delete m_damagesFormula;
    delete m_damagesElementID;
    delete m_damagesVarianceFormula;
    delete m_damagesCriticalFormula;
    delete m_damagesPrecisionFormula;
    delete m_statusID;
    delete m_statusPrecisionFormula;
    delete m_addSkillID;
    delete m_performSkillID;
    delete m_commonReactionID;
    delete m_scriptFormula;
}

EffectKind SystemEffect::kind() const {
    return m_kind;
}

void SystemEffect::setKind(EffectKind k) {
    m_kind = k;
}

SuperListItem * SystemEffect::damagesKind() const {
    return m_damagesKind;
}

PrimitiveValue * SystemEffect::damagesStatisticID() const {
    return m_damagesStatisticID;
}

PrimitiveValue * SystemEffect::damagesCurrencyID() const {
    return m_damagesCurrencyID;
}

SuperListItem * SystemEffect::damagesVariableID() const {
    return m_damagesVariableID;
}

PrimitiveValue * SystemEffect::damagesFormula() const {
    return m_damagesFormula;
}

bool SystemEffect::isDamageElement() const {
    return m_isDamageElement;
}

void SystemEffect::setIsDamageElement(bool b) {
    m_isDamageElement = b;
}

PrimitiveValue * SystemEffect::damagesElementID() const {
    return m_damagesElementID;
}

bool SystemEffect::isDamageVariance() const {
    return m_isDamageVariance;
}

void SystemEffect::setIsDamageVariance(bool b) {
    m_isDamageVariance = b;
}

PrimitiveValue * SystemEffect::damagesVarianceFormula() const {
    return m_damagesVarianceFormula;
}

bool SystemEffect::isDamageCritical() const {
    return m_isDamageCritical;
}

void SystemEffect::setIsDamageCritical(bool b) {
    m_isDamageCritical = b;
}

PrimitiveValue * SystemEffect::damagesCriticalFormula() const {
    return m_damagesCriticalFormula;
}

bool SystemEffect::isDamagePrecision() const {
    return m_isDamagePrecision;
}

void SystemEffect::setIsDamagePrecision(bool b) {
    m_isDamagePrecision = b;
}

PrimitiveValue * SystemEffect::damagesPrecisionFormula() const {
    return m_damagesPrecisionFormula;
}

bool SystemEffect::isAddStatus() const {
    return m_isAddStatus;
}

void SystemEffect::setIsAddStatus(bool b) {
    m_isAddStatus = b;
}

PrimitiveValue * SystemEffect::statusID() const {
    return m_statusID;
}

PrimitiveValue * SystemEffect::statusPrecisionFormula() const {
    return m_statusPrecisionFormula;
}

bool SystemEffect::isAddSkill() const {
    return m_isAddSkill;
}

void SystemEffect::setIsAddSkill(bool b) {
    m_isAddSkill = b;
}

PrimitiveValue * SystemEffect::addSkillID() const {
    return m_addSkillID;
}

PrimitiveValue * SystemEffect::performSkillID() const {
    return m_performSkillID;
}

PrimitiveValue * SystemEffect::commonReactionID() const {
    return m_commonReactionID;
}

EffectSpecialActionKind SystemEffect::specialActionKind() const {
    return m_specialActionKind;
}

void SystemEffect::setSpecialActionKind(EffectSpecialActionKind k) {
    m_specialActionKind = k;
}

PrimitiveValue * SystemEffect::scriptFormula() const {
    return m_scriptFormula;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemEffect * SystemEffect::createSpecialAction(EffectSpecialActionKind action)
{
    return new SystemEffect(EffectKind::SpecialActions, DamagesKind::Stat,
        PrimitiveValue::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), 1, PrimitiveValue
        ::createDefaultMessageValue(), false, PrimitiveValue
        ::createDefaultDataBaseValue(), false, new PrimitiveValue(QString("0")),
        false, new PrimitiveValue(QString("0")), false, new PrimitiveValue(
        QString("100")), true, PrimitiveValue::createDefaultDataBaseValue(), new
        PrimitiveValue(QString("100")), true, PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), action, PrimitiveValue
        ::createDefaultMessageValue());
}

// -------------------------------------------------------

SystemEffect * SystemEffect::createStat(int stat, QString formula, int element,
    QString variance, QString critical, QString precision)
{
    return new SystemEffect(EffectKind::Damages, DamagesKind::Stat, new
        PrimitiveValue(PrimitiveValueKind::DataBase, stat), PrimitiveValue
        ::createDefaultDataBaseValue(), 1, new PrimitiveValue(formula), element
        != -1, element == -1 ? PrimitiveValue::createDefaultDataBaseValue() :
        new PrimitiveValue(PrimitiveValueKind::DataBase, element), !variance
        .isEmpty(), new PrimitiveValue(variance.isEmpty() ? QString("0") :
        variance), !critical.isEmpty(), new PrimitiveValue(critical.isEmpty() ?
        QString("0") : critical), !precision.isEmpty(), new PrimitiveValue(
        precision.isEmpty() ? QString("100") : precision), true, PrimitiveValue
        ::createDefaultDataBaseValue(), new PrimitiveValue(QString("100")), true
        , PrimitiveValue::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), EffectSpecialActionKind::ApplyWeapons,
        PrimitiveValue::createDefaultMessageValue());
}

// -------------------------------------------------------

SystemEffect * SystemEffect::createDamage(QString formula, int element, QString
    variance, QString critical, QString precision)
{
    return createStat(3, formula, element, variance, critical, precision);
}

// -------------------------------------------------------

SystemEffect * SystemEffect::createDamageMP(QString formula, int element, QString
    variance, QString critical, QString precision)
{
    return createStat(4, formula, element, variance, critical, precision);
}

// -------------------------------------------------------

SystemEffect * SystemEffect::createDamageTP(QString formula, int element, QString
    variance, QString critical, QString precision)
{
    return createStat(5, formula, element, variance, critical, precision);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemEffect::openDialog() {
    SystemEffect effect;
    effect.setCopy(*this);
    DialogSystemEffect dialog(effect);
    if (dialog.exec() == QDialog::Accepted) {
        setCopy(effect);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem* SystemEffect::createCopy() const {
    SystemEffect* super = new SystemEffect;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemEffect::setCopy(const SystemEffect& effect) {
    SuperListItem::setCopy(effect);

    m_kind = effect.m_kind;
    m_damagesKind->setId(effect.m_damagesKind->id());
    m_damagesStatisticID->setCopy(*effect.m_damagesStatisticID);
    m_damagesCurrencyID->setCopy(*effect.m_damagesCurrencyID);
    m_damagesVariableID->setId(effect.m_damagesVariableID->id());
    m_damagesFormula->setCopy(*effect.m_damagesFormula);
    m_isDamageElement = effect.m_isDamageElement;
    m_damagesElementID->setCopy(*effect.m_damagesElementID);
    m_isDamageVariance = effect.m_isDamageVariance;
    m_damagesVarianceFormula->setCopy(*effect.m_damagesVarianceFormula);
    m_isDamageCritical = effect.m_isDamageCritical;
    m_damagesCriticalFormula->setCopy(*effect.m_damagesCriticalFormula);
    m_isDamagePrecision = effect.m_isDamagePrecision;
    m_damagesPrecisionFormula->setCopy(*effect.m_damagesPrecisionFormula);
    m_isAddStatus = effect.m_isAddStatus;
    m_statusID->setCopy(*effect.m_statusID);
    m_statusPrecisionFormula->setCopy(*effect.m_statusPrecisionFormula);
    m_isAddSkill = effect.m_isAddSkill;
    m_addSkillID->setCopy(*effect.m_addSkillID);
    m_performSkillID->setCopy(*effect.m_performSkillID);
    m_commonReactionID->setCopy(*effect.m_commonReactionID);
    m_specialActionKind = effect.m_specialActionKind;
    m_scriptFormula->setCopy(*effect.m_scriptFormula);
}

// -------------------------------------------------------

QString SystemEffect::toString() const {
    QString text = SuperListItem::beginningText;
    switch (m_kind) {
    case EffectKind::Damages:
    {
        QString textDamages;
        switch (static_cast<DamagesKind>(m_damagesKind->id())) {
        case DamagesKind::Stat:
            textDamages = m_damagesStatisticID->toString();
            break;
        case DamagesKind::Currency:
            textDamages = m_damagesCurrencyID->toString();
            break;
        case DamagesKind::Variable:
            textDamages = QString::number(m_damagesVariableID->id());
            break;
        }
        text += "Damages on " + Common::enumToStringDamagesKind.at(m_damagesKind
            ->id()) + " " + textDamages + " with " + m_damagesFormula->toString()
            + " " + (m_isDamageElement ? "[Element: " + m_damagesElementID
            ->toString() + "]" : "") + (m_isDamageVariance ? "[Variance: " +
            m_damagesVarianceFormula->toString() + "%]" : "") + (
            m_isDamageCritical ? "[Critical : " + m_damagesCriticalFormula
            ->toString() + "%]" : "") + (m_isDamagePrecision ? "[Precision: " +
            m_damagesPrecisionFormula->toString() + "%]" : "");
        break;
    }
    case EffectKind::Status:
        text += QString(m_isAddStatus ? "Add" : "Remove") + " status " +
            m_statusID->toString() + " with precision " +
            m_statusPrecisionFormula->toString() + "%";
        break;
    case EffectKind::AddRemoveSkill:
        text += QString(m_isAddSkill ? "Add" : "Remove") + " skill " +
            m_addSkillID->toString();
        break;
    case EffectKind::PerformSkill:
        text += "Perform skill " + m_performSkillID->toString();
        break;
    case EffectKind::CommonReaction:
        text += "Call common reaction " + m_commonReactionID->toString();
        break;
    case EffectKind::SpecialActions:
        text += "Special action: " + Common::enumToStringEffectSpecialActionKind
            .at(static_cast<int>(m_specialActionKind));
        break;
    case EffectKind::Script:
        text += "Script: " + m_scriptFormula->toString();
        break;
    }

    return text;
}

// -------------------------------------------------------

void SystemEffect::read(const QJsonObject &json) {
    if (json.contains(JSON_KIND)) {
        m_kind = static_cast<EffectKind>(json[JSON_KIND].toInt());
    }

    switch (m_kind) {
    case EffectKind::Damages:
        if (json.contains(JSON_DAMAGES_KIND)) {
            m_damagesKind->setId(json[JSON_DAMAGES_KIND].toInt());
        }
        switch (static_cast<DamagesKind>(m_damagesKind->id())) {
        case DamagesKind::Stat:
            if (json.contains(JSON_DAMAGES_STATISTIC_ID)) {
                m_damagesStatisticID->read(json[JSON_DAMAGES_STATISTIC_ID]
                    .toObject());
            }
            break;
        case DamagesKind::Currency:
            if (json.contains(JSON_DAMAGES_CURRENCY_ID)) {
                m_damagesCurrencyID->read(json[JSON_DAMAGES_CURRENCY_ID]
                    .toObject());
            }
            break;
        case DamagesKind::Variable:
            if (json.contains(JSON_DAMAGES_VARIABLE_ID)) {
                m_damagesVariableID->setId(json[JSON_DAMAGES_VARIABLE_ID]
                    .toInt());
            }
            break;
        }
        if (json.contains(JSON_DAMAGES_FORMULA)) {
            m_damagesFormula->read(json[JSON_DAMAGES_FORMULA].toObject());
        }
        if (json.contains(JSON_IS_DAMAGE_ELEMENT)) {
            m_isDamageElement = json[JSON_IS_DAMAGE_ELEMENT].toBool();
            if (json.contains(JSON_DAMAGE_ELEMENT_ID)) {
                m_damagesElementID->read(json[JSON_DAMAGE_ELEMENT_ID].toObject());
            }
        }
        if (json.contains(JSON_IS_DAMAGE_VARIANCE)) {
            m_isDamageVariance = json[JSON_IS_DAMAGE_VARIANCE].toBool();
            if (json.contains(JSON_DAMAGE_VARIANCE_FORMULA)) {
                m_damagesVarianceFormula->read(json[JSON_DAMAGE_VARIANCE_FORMULA]
                    .toObject());
            }
        }
        if (json.contains(JSON_IS_DAMAGE_CRITICAL)) {
            m_isDamageCritical = json[JSON_IS_DAMAGE_CRITICAL].toBool();
            if (json.contains(JSON_DAMAGE_CRITICAL_FORMULA)) {
                m_damagesCriticalFormula->read(json[JSON_DAMAGE_CRITICAL_FORMULA]
                    .toObject());
            }
        }
        if (json.contains(JSON_IS_DAMAGE_PRECISION)) {
            m_isDamagePrecision = json[JSON_IS_DAMAGE_PRECISION].toBool();
            if (json.contains(JSON_DAMAGE_PRECISION_FORMULA)) {
                m_damagesPrecisionFormula->read(json[JSON_DAMAGE_PRECISION_FORMULA]
                    .toObject());
            }
        }
        break;
    case EffectKind::Status:
        if (json.contains(JSON_IS_ADD_STATUS)) {
            m_isAddStatus = json[JSON_IS_ADD_STATUS].toBool();
        }
        if (json.contains(JSON_STATUS_ID)) {
            m_statusID->read(json[JSON_STATUS_ID].toObject());
        }
        if (json.contains(JSON_STATUS_PRECISION_FORMULA)) {
            m_statusPrecisionFormula->read(json[JSON_STATUS_PRECISION_FORMULA]
                .toObject());
        }
        break;
    case EffectKind::AddRemoveSkill:
        if (json.contains(JSON_IS_ADD_SKILL)) {
            m_isAddSkill = json[JSON_IS_ADD_SKILL].toBool();
        }
        if (json.contains(JSON_ADD_SKILL_ID)) {
            m_addSkillID->read(json[JSON_ADD_SKILL_ID].toObject());
        }
        break;
    case EffectKind::PerformSkill:
        if (json.contains(JSON_PERFORM_SKILL_ID)) {
            m_performSkillID->read(json[JSON_PERFORM_SKILL_ID].toObject());
        }
        break;
    case EffectKind::CommonReaction:
        if (json.contains(JSON_COMMON_REACTION_ID)) {
            m_commonReactionID->read(json[JSON_COMMON_REACTION_ID].toObject());
        }
        break;
    case EffectKind::SpecialActions:
        if (json.contains(JSON_SPECIAL_ACTION_KIND)) {
            m_specialActionKind = static_cast<EffectSpecialActionKind>(json[
                JSON_SPECIAL_ACTION_KIND].toInt());
        }
        break;
    case EffectKind::Script:
        if (json.contains(JSON_SCRIPT_FORMULA)) {
            m_scriptFormula->read(json[JSON_SCRIPT_FORMULA].toObject());
        }
        break;
    }
}

// -------------------------------------------------------

void SystemEffect::write(QJsonObject &json) const {
    QJsonObject obj;

    if (m_kind != EffectKind::Damages) {
        json[JSON_KIND] = static_cast<int>(m_kind);
    }
    switch (m_kind) {
    case EffectKind::Damages:
    {
        if (m_damagesKind->id() != 0) {
            json[JSON_DAMAGES_KIND] = m_damagesKind->id();
        }
        switch (static_cast<DamagesKind>(m_damagesKind->id())) {
        case DamagesKind::Stat:
            if (m_damagesStatisticID->kind() != PrimitiveValueKind::DataBase ||
                m_damagesStatisticID->numberValue() != 1)
            {
                obj = QJsonObject();
                m_damagesStatisticID->write(obj);
                json[JSON_DAMAGES_STATISTIC_ID] = obj;
            }
            break;
        case DamagesKind::Currency:
            if (m_damagesCurrencyID->kind() != PrimitiveValueKind::DataBase ||
                m_damagesCurrencyID->numberValue() != 1)
            {
                obj = QJsonObject();
                m_damagesCurrencyID->write(obj);
                json[JSON_DAMAGES_CURRENCY_ID] = obj;
            }
            break;
        case DamagesKind::Variable:
            if (m_damagesVariableID->id() != 1) {
                json[JSON_DAMAGES_VARIABLE_ID] = m_damagesVariableID->id();
            }
            break;
        }
        if (m_damagesFormula->kind() != PrimitiveValueKind::Message ||
            !m_damagesFormula->messageValue().isEmpty())
        {
            obj = QJsonObject();
            m_damagesFormula->write(obj);
            json[JSON_DAMAGES_FORMULA] = obj;
        }
        if (m_isDamageElement) {
            json[JSON_IS_DAMAGE_ELEMENT] = m_isDamageElement;
            if (m_damagesElementID->kind() != PrimitiveValueKind::DataBase ||
                m_damagesElementID->numberValue() != 1)
            {
                obj = QJsonObject();
                m_damagesElementID->write(obj);
                json[JSON_DAMAGE_ELEMENT_ID] = obj;
            }
        }
        if (m_isDamageVariance) {
            json[JSON_IS_DAMAGE_VARIANCE] = m_isDamageVariance;
            if (m_damagesVarianceFormula->kind() != PrimitiveValueKind::Message
                || m_damagesVarianceFormula->messageValue() != "0")
            {
                obj = QJsonObject();
                m_damagesVarianceFormula->write(obj);
                json[JSON_DAMAGE_VARIANCE_FORMULA] = obj;
            }
        }
        if (m_isDamageCritical) {
            json[JSON_IS_DAMAGE_CRITICAL] = m_isDamageCritical;
            if (m_damagesCriticalFormula->kind() != PrimitiveValueKind::Message
                || m_damagesCriticalFormula->messageValue() != "0")
            {
                obj = QJsonObject();
                m_damagesCriticalFormula->write(obj);
                json[JSON_DAMAGE_CRITICAL_FORMULA] = obj;
            }
        }
        if (m_isDamagePrecision) {
            json[JSON_IS_DAMAGE_PRECISION] = m_isDamagePrecision;
            if (m_damagesPrecisionFormula->kind() != PrimitiveValueKind::Message
                || m_damagesPrecisionFormula->messageValue() != "100")
            {
                obj = QJsonObject();
                m_damagesPrecisionFormula->write(obj);
                json[JSON_DAMAGE_PRECISION_FORMULA] = obj;
            }
        }
        break;
    }
    case EffectKind::Status:
        if (!m_isAddStatus) {
            json[JSON_IS_ADD_STATUS] = m_isAddStatus;
        }
        if (m_statusID->kind() != PrimitiveValueKind::DataBase || m_statusID
            ->numberValue() != 1)
        {
            obj = QJsonObject();
            m_statusID->write(obj);
            json[JSON_STATUS_ID] = obj;
        }
        if (m_statusPrecisionFormula->kind() != PrimitiveValueKind::Message ||
            m_statusPrecisionFormula->messageValue() != "100")
        {
            obj = QJsonObject();
            m_statusPrecisionFormula->write(obj);
            json[JSON_STATUS_PRECISION_FORMULA] = obj;
        }
        break;
    case EffectKind::AddRemoveSkill:
        if (!m_isAddSkill) {
            json[JSON_IS_ADD_SKILL] = m_isAddSkill;
        }
        if (m_addSkillID->kind() != PrimitiveValueKind::DataBase || m_addSkillID
            ->numberValue() != 1)
        {
            obj = QJsonObject();
            m_addSkillID->write(obj);
            json[JSON_ADD_SKILL_ID] = obj;
        }
        break;
    case EffectKind::PerformSkill:
        if (m_performSkillID->kind() != PrimitiveValueKind::DataBase ||
            m_performSkillID->numberValue() != 1)
        {
            obj = QJsonObject();
            m_performSkillID->write(obj);
            json[JSON_PERFORM_SKILL_ID] = obj;
        }
        break;
    case EffectKind::CommonReaction:
        if (m_commonReactionID->kind() != PrimitiveValueKind::DataBase ||
            m_commonReactionID->numberValue() != 1)
        {
            obj = QJsonObject();
            m_commonReactionID->write(obj);
            json[JSON_COMMON_REACTION_ID] = obj;
        }
        break;
    case EffectKind::SpecialActions:
        if (m_specialActionKind != EffectSpecialActionKind::ApplyWeapons) {
            json[JSON_SPECIAL_ACTION_KIND] = static_cast<int>(m_specialActionKind);
        }
        break;
    case EffectKind::Script:
        if (m_scriptFormula->kind() != PrimitiveValueKind::Message ||
            !m_scriptFormula->messageValue().isEmpty())
        {
            obj = QJsonObject();
            m_scriptFormula->write(obj);
            json[JSON_SCRIPT_FORMULA] = obj;
        }
        break;
    }
}
