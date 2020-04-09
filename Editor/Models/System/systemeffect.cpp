/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
const QString SystemEffect::JSON_IS_DAMAGE_MINIMUM = "idmin";
const QString SystemEffect::JSON_DAMAGE_MINIMUM = "dmin";
const QString SystemEffect::JSON_IS_DAMAGE_MAXIMUM = "idmax";
const QString SystemEffect::JSON_DAMAGE_MAXIMUM = "dmax";
const QString SystemEffect::JSON_IS_DAMAGE_ELEMENT = "ide";
const QString SystemEffect::JSON_DAMAGE_ELEMENT_ID = "deid";
const QString SystemEffect::JSON_IS_DAMAGE_VARIANCE = "idv";
const QString SystemEffect::JSON_DAMAGE_VARIANCE_FORMULA= "dvf";
const QString SystemEffect::JSON_IS_DAMAGE_CRITICAL = "idc";
const QString SystemEffect::JSON_DAMAGE_CRITICAL_FORMULA = "dcf";
const QString SystemEffect::JSON_IS_DAMAGE_PRECISION = "idp";
const QString SystemEffect::JSON_DAMAGE_PRECISION_FORMULA = "dpf";
const QString SystemEffect::JSON_IS_DAMAGE_STOCK_VARIABLE = "idsv";
const QString SystemEffect::JSON_DAMAGE_STOCK_VARIABLE = "dsv";
const QString SystemEffect::JSON_IS_ADD_STATUS = "iast";
const QString SystemEffect::JSON_STATUS_ID = "sid";
const QString SystemEffect::JSON_STATUS_PRECISION_FORMULA = "spf";
const QString SystemEffect::JSON_IS_ADD_SKILL= "iask";
const QString SystemEffect::JSON_ADD_SKILL_ID = "asid";
const QString SystemEffect::JSON_PERFORM_SKILL_ID = "psid";
const QString SystemEffect::JSON_COMMON_REACTION = "cr";
const QString SystemEffect::JSON_SPECIAL_ACTION_KIND = "sak";
const QString SystemEffect::JSON_SCRIPT_FORMULA = "sf";
const QString SystemEffect::JSON_IS_TEMPORARILY_CHANGE_TARGET = "itct";
const QString SystemEffect::JSON_TEMPORARILY_CHANGE_TARGET_FORMULA = "tctf";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemEffect::SystemEffect() :
    SystemEffect(EffectKind::Damages, DamagesKind::Stat, PrimitiveValue
        ::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), 1, PrimitiveValue
        ::createDefaultMessageValue(), true, new PrimitiveValue(QString("0")),
        false, new PrimitiveValue(QString("0")), false, PrimitiveValue
        ::createDefaultDataBaseValue(), false, new PrimitiveValue(QString("0")),
        false, new PrimitiveValue(QString("0")), false, new PrimitiveValue(
        QString("100")), false, new SuperListItem(1), true, PrimitiveValue
        ::createDefaultDataBaseValue(), new PrimitiveValue(QString("100")), true
        , PrimitiveValue::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), nullptr, EffectSpecialActionKind
        ::ApplyWeapons, PrimitiveValue::createDefaultMessageValue(), false, new
        PrimitiveValue(QString()))
{

}

SystemEffect::SystemEffect(EffectKind kind, DamagesKind damageKind,
    PrimitiveValue *damagesStatisticID, PrimitiveValue *damagesCurrencyID, int
    damagesVariableID, PrimitiveValue *damagesFormula, bool idmin,
    PrimitiveValue *dmin, bool idmax, PrimitiveValue *dmax, bool isDamageElement
    , PrimitiveValue *damagesElementID, bool isDamageVariance, PrimitiveValue
    *damagesVarianceFormula, bool isDamageCritical, PrimitiveValue
    *damagesCriticalFormula, bool isDamagePrecision, PrimitiveValue
    *damagesPrecisionFormula, bool idsv, SuperListItem *dsv, bool isAddStatus,
    PrimitiveValue *statusID, PrimitiveValue *statusPrecisionFormula, bool
    isAddSkill, PrimitiveValue *addSkillID, PrimitiveValue *performSkillID,
    EventCommand *commonReaction, EffectSpecialActionKind specialActionKind,
    PrimitiveValue *scriptFormula, bool itct, PrimitiveValue *tctf) :
    SuperListItem(-1, "", true),
    m_kind(kind),
    m_damagesKind(new SuperListItem(static_cast<int>(damageKind), "")),
    m_damagesStatisticID(damagesStatisticID),
    m_damagesCurrencyID(damagesCurrencyID),
    m_damagesVariableID(new SuperListItem(damagesVariableID, "")),
    m_damagesFormula(damagesFormula),
    m_isDamagesMinimum(idmin),
    m_damagesMinimum(dmin),
    m_isDamagesMaximum(idmax),
    m_damagesMaximum(dmax),
    m_isDamageElement(isDamageElement),
    m_damagesElementID(damagesElementID),
    m_isDamageVariance(isDamageVariance),
    m_damagesVarianceFormula(damagesVarianceFormula),
    m_isDamageCritical(isDamageCritical),
    m_damagesCriticalFormula(damagesCriticalFormula),
    m_isDamagePrecision(isDamagePrecision),
    m_damagesPrecisionFormula(damagesPrecisionFormula),
    m_isDamageStockVariable(idsv),
    m_damagesStockVariable(dsv),
    m_isAddStatus(isAddStatus),
    m_statusID(statusID),
    m_statusPrecisionFormula(statusPrecisionFormula),
    m_isAddSkill(isAddSkill),
    m_addSkillID(addSkillID),
    m_performSkillID(performSkillID),
    m_commonReaction(commonReaction),
    m_specialActionKind(specialActionKind),
    m_scriptFormula(scriptFormula),
    m_isTemporarilyChangeTarget(itct),
    m_temporarilyChangeTargetFormula(tctf)
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
}

SystemEffect::~SystemEffect() {
    delete m_damagesKind;
    delete m_damagesStatisticID;
    delete m_damagesCurrencyID;
    delete m_damagesVariableID;
    delete m_damagesFormula;
    delete m_damagesMinimum;
    delete m_damagesMaximum;
    delete m_damagesElementID;
    delete m_damagesVarianceFormula;
    delete m_damagesCriticalFormula;
    delete m_damagesPrecisionFormula;
    delete m_damagesStockVariable;
    delete m_statusID;
    delete m_statusPrecisionFormula;
    delete m_addSkillID;
    delete m_performSkillID;
    if (m_commonReaction != nullptr)
    {
        delete m_commonReaction;
    }
    delete m_scriptFormula;
    delete m_temporarilyChangeTargetFormula;
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

bool SystemEffect::isDamagesMinimum() const {
    return m_isDamagesMinimum;
}

void SystemEffect::setIsDamagesMinimum(bool b) {
    m_isDamagesMinimum = b;
}

PrimitiveValue * SystemEffect::damagesMinimum() const {
    return m_damagesMinimum;
}

bool SystemEffect::isDamagesMaximum() const {
    return m_isDamagesMaximum;
}

void SystemEffect::setIsDamagesMaximum(bool b) {
    m_isDamagesMaximum = b;
}

PrimitiveValue * SystemEffect::damagesMaximum() const {
    return m_damagesMaximum;
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

bool SystemEffect::isDamageStockVariable() const
{
    return m_isDamageStockVariable;
}

void SystemEffect::setIsDamageStockVariable(bool idsv)
{
    m_isDamageStockVariable = idsv;
}

SuperListItem * SystemEffect::damagesStockVariable() const
{
    return m_damagesStockVariable;
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

EventCommand * SystemEffect::commonReaction() const {
    return m_commonReaction;
}

void SystemEffect::setCommonReaction(EventCommand *cr)
{
    m_commonReaction = cr;
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

bool SystemEffect::isTemporarilyChangeTarget() const
{
    return m_isTemporarilyChangeTarget;
}

void SystemEffect::setIsTemporarilyChangeTarget(bool itct)
{
    m_isTemporarilyChangeTarget = itct;
}

PrimitiveValue * SystemEffect::temporarilyChangeTargetFormula() const
{
    return m_temporarilyChangeTargetFormula;
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
        ::createDefaultMessageValue(), true, new PrimitiveValue(0), false, new
        PrimitiveValue(0),  false, PrimitiveValue
        ::createDefaultDataBaseValue(), false, new PrimitiveValue(QString("0")),
        false, new PrimitiveValue(QString("0")), false, new PrimitiveValue(
        QString("100")), false, new SuperListItem(1), true, PrimitiveValue
        ::createDefaultDataBaseValue(), new PrimitiveValue(QString("100")), true
        , PrimitiveValue::createDefaultDataBaseValue(), PrimitiveValue
        ::createDefaultDataBaseValue(), nullptr, action, PrimitiveValue
        ::createDefaultMessageValue(), false, new PrimitiveValue(QString()));
}

// -------------------------------------------------------

SystemEffect * SystemEffect::createStat(int stat, QString formula, QString min,
    int element, QString variance, QString critical, QString precision)
{
    return new SystemEffect(EffectKind::Damages, DamagesKind::Stat, new
        PrimitiveValue(PrimitiveValueKind::DataBase, stat), PrimitiveValue
        ::createDefaultDataBaseValue(), 1, new PrimitiveValue(formula), !min
        .isEmpty(), new PrimitiveValue(min.isEmpty() ? QString("0") : min),
        false, new PrimitiveValue(QString("0")), element != -1, element == -1 ?
        PrimitiveValue::createDefaultDataBaseValue() : new PrimitiveValue(
        PrimitiveValueKind::DataBase, element), !variance.isEmpty(), new
        PrimitiveValue(variance.isEmpty() ? QString("0") : variance), !critical
        .isEmpty(), new PrimitiveValue(critical.isEmpty() ? QString("0") :
        critical), !precision.isEmpty(), new PrimitiveValue(precision.isEmpty()
        ? QString("100") : precision), false, new SuperListItem(1), true,
        PrimitiveValue::createDefaultDataBaseValue(), new PrimitiveValue(QString
        ("100")), true, PrimitiveValue::createDefaultDataBaseValue(),
        PrimitiveValue::createDefaultDataBaseValue(), nullptr,
        EffectSpecialActionKind::ApplyWeapons, PrimitiveValue
        ::createDefaultMessageValue(), false, new PrimitiveValue(QString()));
}

// -------------------------------------------------------

SystemEffect * SystemEffect::createDamage(QString formula, QString min, int
    element, QString variance, QString critical, QString precision)
{
    return createStat(3, formula, min, element, variance, critical, precision);
}

// -------------------------------------------------------

SystemEffect * SystemEffect::createDamageMP(QString formula, int element, QString
    variance, QString critical, QString precision)
{
    return createStat(4, formula, QString(), element, variance, critical,
        precision);
}

// -------------------------------------------------------

SystemEffect * SystemEffect::createDamageTP(QString formula, int element, QString
    variance, QString critical, QString precision)
{
    return createStat(5, formula, QString(), element, variance, critical,
        precision);
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

void SystemEffect::setCopy(const SuperListItem &super) {
    const SystemEffect *effect;

    SuperListItem::setCopy(super);

    effect = reinterpret_cast<const SystemEffect *>(&super);
    m_kind = effect->m_kind;
    m_damagesKind->setId(effect->m_damagesKind->id());
    m_damagesStatisticID->setCopy(*effect->m_damagesStatisticID);
    m_damagesCurrencyID->setCopy(*effect->m_damagesCurrencyID);
    m_damagesVariableID->setId(effect->m_damagesVariableID->id());
    m_damagesFormula->setCopy(*effect->m_damagesFormula);
    m_isDamagesMinimum = effect->m_isDamagesMinimum;
    m_damagesMinimum->setCopy(*effect->m_damagesMinimum);
    m_isDamagesMaximum = effect->m_isDamagesMaximum;
    m_damagesMaximum->setCopy(*effect->m_damagesMaximum);
    m_isDamageElement = effect->m_isDamageElement;
    m_damagesElementID->setCopy(*effect->m_damagesElementID);
    m_isDamageVariance = effect->m_isDamageVariance;
    m_damagesVarianceFormula->setCopy(*effect->m_damagesVarianceFormula);
    m_isDamageCritical = effect->m_isDamageCritical;
    m_damagesCriticalFormula->setCopy(*effect->m_damagesCriticalFormula);
    m_isDamagePrecision = effect->m_isDamagePrecision;
    m_damagesPrecisionFormula->setCopy(*effect->m_damagesPrecisionFormula);
    m_isDamageStockVariable = effect->m_isDamageStockVariable;
    m_damagesStockVariable->setId(effect->m_damagesStockVariable->id());
    m_isAddStatus = effect->m_isAddStatus;
    m_statusID->setCopy(*effect->m_statusID);
    m_statusPrecisionFormula->setCopy(*effect->m_statusPrecisionFormula);
    m_isAddSkill = effect->m_isAddSkill;
    m_addSkillID->setCopy(*effect->m_addSkillID);
    m_performSkillID->setCopy(*effect->m_performSkillID);
    if (effect->m_commonReaction == nullptr)
    {
        if (m_commonReaction != nullptr)
        {
            delete m_commonReaction;
        }
        m_commonReaction = nullptr;
    } else
    {
        if (m_commonReaction == nullptr)
        {
            m_commonReaction = new EventCommand;
        }
        m_commonReaction->setCopy(*effect->m_commonReaction);
    }
    m_specialActionKind = effect->m_specialActionKind;
    m_scriptFormula->setCopy(*effect->m_scriptFormula);
    m_isTemporarilyChangeTarget = effect->m_isTemporarilyChangeTarget;
    m_temporarilyChangeTargetFormula->setCopy(*effect
        ->m_temporarilyChangeTargetFormula);
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
        text += RPM::translate(Translations::DAMAGES_ON) + RPM::SPACE + RPM
            ::ENUM_TO_STRING_DAMAGES_KIND.at(m_damagesKind->id()) + RPM::SPACE +
            textDamages + RPM::SPACE + RPM::translate(Translations::WITH)
            .toLower() + RPM::SPACE + m_damagesFormula->toString() + RPM::SPACE
            + (m_isDamagesMinimum ? RPM::BRACKET_LEFT + RPM::translate(
            Translations::MINIMUM) + RPM::COLON + RPM::SPACE + m_damagesMinimum
            ->toString() + RPM::BRACKET_RIGHT : "") + (m_isDamagesMaximum ? RPM
            ::BRACKET_RIGHT + RPM::translate(Translations::MAXIMUM) + RPM::COLON
            + RPM::SPACE + m_damagesMaximum->toString() + RPM::BRACKET_RIGHT :
            "") + (m_isDamageElement ? RPM::BRACKET_LEFT + RPM::translate(
            Translations::ELEMENT_ID) + RPM::COLON + RPM::SPACE +
            m_damagesElementID->toString() + RPM::BRACKET_RIGHT : "") + (
            m_isDamageVariance ? RPM::BRACKET_LEFT + RPM::translate(Translations
            ::VARIANCE) + RPM::COLON + RPM::SPACE + m_damagesVarianceFormula
            ->toString() + "%" + RPM::BRACKET_RIGHT : "") + (m_isDamageCritical
            ? RPM::BRACKET_LEFT + RPM::translate(Translations::CRITICAL) + RPM
            ::COLON + RPM::SPACE + m_damagesCriticalFormula->toString() + "%" +
            RPM::BRACKET_RIGHT : "") + (m_isDamagePrecision ? RPM::BRACKET_LEFT
            + RPM::translate(Translations::PRECISION) + RPM::COLON + RPM::SPACE
            + m_damagesPrecisionFormula->toString() + "%" + RPM::BRACKET_RIGHT :
            "") + (m_isDamageStockVariable ? RPM::BRACKET_LEFT + RPM::translate(
            Translations::STOCK_VALUE_IN) + RPM::COLON + RPM::SPACE +
            m_damagesStockVariable->toString() + "%" + RPM::BRACKET_RIGHT : "");
        break;
    }
    case EffectKind::Status:
        text += QString(m_isAddStatus ? RPM::translate(Translations::ADD) : RPM
            ::translate(Translations::REMOVE)) + RPM::SPACE + RPM::translate(
            Translations::STATUS) + RPM::SPACE + m_statusID->toString() + RPM
            ::SPACE + "with precision " +
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
        text += m_commonReaction == nullptr ? RPM::translate(Translations
            ::CALL_A_COMMON_REACTION) : m_commonReaction->toString();
        break;
    case EffectKind::SpecialActions:
        text += RPM::translate(Translations::SPECIAL_ACTION) + RPM::COLON + RPM
            ::SPACE + RPM::ENUM_TO_STRING_EFFECT_SPECIAL_ACTION_KIND.at(
            static_cast<int>(m_specialActionKind));
        break;
    case EffectKind::Script:
        text += RPM::translate(Translations::SCRIPT) + RPM::COLON + RPM::SPACE +
            m_scriptFormula->toString();
        break;
    }
    if (m_isTemporarilyChangeTarget)
    {
        text += RPM::BRACKET_LEFT + RPM::translate(Translations
            ::TEMPORARILY_CHANGE_TARGET) + RPM::COLON + RPM::SPACE +
            m_temporarilyChangeTargetFormula->toString() + RPM::BRACKET_RIGHT;
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
        if (json.contains(JSON_IS_DAMAGE_MINIMUM)) {
            m_isDamagesMinimum = json[JSON_IS_DAMAGE_MINIMUM].toBool();
        } else {
            if (json.contains(JSON_DAMAGE_MINIMUM)) {
                m_damagesMinimum->read(json[JSON_DAMAGE_MINIMUM].toObject());
            }
        }
        if (json.contains(JSON_IS_DAMAGE_MAXIMUM)) {
            m_isDamagesMaximum = json[JSON_IS_DAMAGE_MAXIMUM].toBool();
            if (json.contains(JSON_DAMAGE_MAXIMUM)) {
                m_damagesMaximum->read(json[JSON_DAMAGE_MAXIMUM].toObject());
            }
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
        if (json.contains(JSON_IS_DAMAGE_STOCK_VARIABLE)) {
            m_isDamageStockVariable = json[JSON_IS_DAMAGE_STOCK_VARIABLE].toBool();
            if (json.contains(JSON_DAMAGE_STOCK_VARIABLE)) {
                m_damagesStockVariable->setId(json[JSON_DAMAGE_STOCK_VARIABLE]
                    .toInt());
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
        if (json.contains(JSON_COMMON_REACTION)) {
            if (m_commonReaction == nullptr)
            {
                m_commonReaction = new EventCommand;
            }
            m_commonReaction->read(json[JSON_COMMON_REACTION].toObject());
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
    if (json.contains(JSON_IS_TEMPORARILY_CHANGE_TARGET))
    {
        m_isTemporarilyChangeTarget = json[JSON_IS_TEMPORARILY_CHANGE_TARGET]
            .toBool();
        if (json.contains(JSON_TEMPORARILY_CHANGE_TARGET_FORMULA))
        {
            m_temporarilyChangeTargetFormula->read(json[
                JSON_TEMPORARILY_CHANGE_TARGET_FORMULA].toObject());
        }
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
        if (m_isDamagesMinimum) {
            if (!m_damagesMinimum->isDefaultNumberValue()) {
                obj = QJsonObject();
                m_damagesMinimum->write(obj);
                json[JSON_DAMAGE_MINIMUM] = obj;
            }
        } else {
            json[JSON_IS_DAMAGE_MINIMUM] = m_isDamagesMinimum;
        }
        if (m_isDamagesMaximum) {
            json[JSON_IS_DAMAGE_MAXIMUM] = m_isDamagesMaximum;
            if (!m_damagesMaximum->isDefaultNumberValue()) {
                obj = QJsonObject();
                m_damagesMaximum->write(obj);
                json[JSON_DAMAGE_MAXIMUM] = obj;
            }
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
        if (m_isDamageStockVariable)
        {
            json[JSON_IS_DAMAGE_STOCK_VARIABLE] = m_isDamageStockVariable;
            if (m_damagesStockVariable->id() != 1)
            {
                json[JSON_DAMAGE_STOCK_VARIABLE] = m_damagesStockVariable->id();
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
        if (m_commonReaction != nullptr)
        {
            json[JSON_COMMON_REACTION] = m_commonReaction->getJSON();
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
    if (m_isTemporarilyChangeTarget)
    {
        json[JSON_IS_TEMPORARILY_CHANGE_TARGET] = m_isTemporarilyChangeTarget;
        if (m_temporarilyChangeTargetFormula->kind() != PrimitiveValueKind
            ::Message || !m_temporarilyChangeTargetFormula->messageValue()
            .isEmpty())
        {
            obj = QJsonObject();
            m_temporarilyChangeTargetFormula->write(obj);
            json[JSON_TEMPORARILY_CHANGE_TARGET_FORMULA] = obj;
        }
    }
}
