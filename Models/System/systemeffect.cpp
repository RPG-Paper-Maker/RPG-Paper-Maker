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

#include "systemeffect.h"

const QString SystemEffect::JSON_KIND = "k";
const QString SystemEffect::JSON_DAMAGES_KIND = "dk";
const QString SystemEffect::JSON_DAMAGES_KIND_ID = "dkid";
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
    SystemEffect(1, EffectKind::Damages, DamagesKind::Stat, new PrimitiveValue(
        PrimitiveValueKind::DataBase, 1), new PrimitiveValue(QString()),
        false, new PrimitiveValue(PrimitiveValueKind::DataBase, 1), false, new
        PrimitiveValue(QString("0")), false, new PrimitiveValue(QString("0")),
        false, new PrimitiveValue(QString("100")), true, new PrimitiveValue(
        PrimitiveValueKind::DataBase, 1), new PrimitiveValue(QString("100")),
        true, new PrimitiveValue(PrimitiveValueKind::DataBase, 1), new
        PrimitiveValue(PrimitiveValueKind::DataBase, 1), new PrimitiveValue(
        PrimitiveValueKind::DataBase, 1), EffectSpecialActionKind::ApplyWeapons,
        new PrimitiveValue(QString()))
{

}

SystemEffect::SystemEffect(int id, EffectKind kind, DamagesKind damageKind,
    PrimitiveValue *damagesKindID, PrimitiveValue *damagesFormula, bool
    isDamageElement, PrimitiveValue *damagesElementID, bool isDamageVariance,
    PrimitiveValue *damagesVarianceFormula, bool isDamageCritical,
    PrimitiveValue *damagesCriticalFormula, bool isDamagePrecision,
    PrimitiveValue *damagesPrecisionFormula, bool isAddStatus,
    PrimitiveValue *statusID, PrimitiveValue *statusPrecisionFormula, bool
    isAddSkill, PrimitiveValue *addSkillID, PrimitiveValue *performSkillID,
    PrimitiveValue *commonReactionID, EffectSpecialActionKind specialActionKind,
    PrimitiveValue *scriptFormula) :
    SuperListItem (id, ""),
    m_kind(kind),
    m_damagesKind(damageKind),
    m_damagesKindID(damagesKindID),
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

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemEffect::openDialog() {
    /*
    SystemEffect effect;
    effect.setCopy(*this);
    DialogSystemEffect dialog(effect);
    if (dialog.exec() == QDialog::Accepted) {
        setCopy(effect);
        return true;
    }
    */
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
}

// -------------------------------------------------------

QList<QStandardItem *> SystemEffect::getModelRow() const {
    QList<QStandardItem*> row = QList<QStandardItem* >();
    QStandardItem* itemEffect = new QStandardItem;
    itemEffect->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemEffect->setText(toString());
    row.append(itemEffect);

    return row;
}

// -------------------------------------------------------

void SystemEffect::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_KIND)) {
        m_kind = static_cast<EffectKind>(json[JSON_KIND].toInt());
    }

    switch (m_kind) {
    case EffectKind::Damages:
        if (json.contains(JSON_DAMAGES_KIND)) {
            m_damagesKind = static_cast<DamagesKind>(json[JSON_DAMAGES_KIND]
                .toInt());
        }
        if (json.contains(JSON_DAMAGES_KIND_ID)) {
            m_damagesKindID->read(json[JSON_DAMAGES_KIND_ID].toObject());
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
    SuperListItem::write(json);
    QJsonObject obj;

    if (m_kind != EffectKind::Damages) {
        json[JSON_KIND] = static_cast<int>(m_kind);
    }
    switch (m_kind) {
    case EffectKind::Damages:
        if (m_damagesKind != DamagesKind::Stat) {
            json[JSON_DAMAGES_KIND] = static_cast<int>(m_damagesKind);
        }
        if (m_damagesKindID->kind() != PrimitiveValueKind::DataBase ||
            m_damagesKindID->numberValue() != 1)
        {
            obj = QJsonObject();
            m_damagesKindID->write(obj);
            json[JSON_DAMAGES_KIND_ID] = obj;
        }
        if (m_damagesFormula->kind() != PrimitiveValueKind::Message ||
            !m_damagesKindID->messageValue().isEmpty())
        {
            obj = QJsonObject();
            m_damagesFormula->write(obj);
            json[JSON_DAMAGES_FORMULA] = obj;
        }
        if (m_isDamageElement) {
            json[JSON_IS_DAMAGE_ELEMENT] = m_isDamageElement;
            if (m_damagesElementID->kind() != PrimitiveValueKind::DataBase ||
                m_damagesKindID->numberValue() != 1)
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
