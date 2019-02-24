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

#ifndef SYSTEMEFFECT_H
#define SYSTEMEFFECT_H

#include <QMetaType>
#include "superlistitem.h"
#include "effectkind.h"
#include "damageskind.h"
#include "primitivevalue.h"
#include "effectspecialacionkind.h"

// -------------------------------------------------------
//
//  CLASS SystemEffect
//
//  A particulary effect (datas).
//
// -------------------------------------------------------

class SystemEffect : public SuperListItem
{
public:
    static const QString JSON_KIND;
    static const QString JSON_DAMAGES_KIND;
    static const QString JSON_DAMAGES_KIND_ID;
    static const QString JSON_DAMAGES_FORMULA;
    static const QString JSON_IS_DAMAGE_ELEMENT;
    static const QString JSON_DAMAGE_ELEMENT_ID;
    static const QString JSON_IS_DAMAGE_VARIANCE;
    static const QString JSON_DAMAGE_VARIANCE_FORMULA;
    static const QString JSON_IS_DAMAGE_CRITICAL;
    static const QString JSON_DAMAGE_CRITICAL_FORMULA;
    static const QString JSON_IS_DAMAGE_PRECISION;
    static const QString JSON_DAMAGE_PRECISION_FORMULA;
    static const QString JSON_IS_ADD_STATUS;
    static const QString JSON_STATUS_ID;
    static const QString JSON_STATUS_PRECISION_FORMULA;
    static const QString JSON_IS_ADD_SKILL;
    static const QString JSON_ADD_SKILL_ID;
    static const QString JSON_PERFORM_SKILL_ID;
    static const QString JSON_COMMON_REACTION_ID;
    static const QString JSON_SPECIAL_ACTION_KIND;
    static const QString JSON_SCRIPT_FORMULA;

    SystemEffect();
    SystemEffect(int id, EffectKind kind, DamagesKind damageKind, PrimitiveValue
        *damagesKindID, PrimitiveValue *damagesFormula, bool isDamageElement,
        PrimitiveValue *damagesElementID, bool isDamageVariance,
        PrimitiveValue *damagesVarianceFormula, bool isDamageCritical,
        PrimitiveValue *damagesCriticalFormula, bool isDamagePrecision,
        PrimitiveValue *damagesPrecisionFormula, bool isAddStatus,
        PrimitiveValue *statusID, PrimitiveValue *statusPrecisionFormula, bool
        isAddSkill, PrimitiveValue *addSkillID, PrimitiveValue *performSkillID,
        PrimitiveValue *commonReactionID, EffectSpecialActionKind
        specialActionKind, PrimitiveValue *scriptFormula);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemEffect &effect);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    EffectKind m_kind;
    DamagesKind m_damagesKind;
    PrimitiveValue *m_damagesKindID;
    PrimitiveValue *m_damagesFormula;
    bool m_isDamageElement;
    PrimitiveValue *m_damagesElementID;
    bool m_isDamageVariance;
    PrimitiveValue *m_damagesVarianceFormula;
    bool m_isDamageCritical;
    PrimitiveValue *m_damagesCriticalFormula;
    bool m_isDamagePrecision;
    PrimitiveValue *m_damagesPrecisionFormula;
    bool m_isAddStatus;
    PrimitiveValue *m_statusID;
    PrimitiveValue *m_statusPrecisionFormula;
    bool m_isAddSkill;
    PrimitiveValue *m_addSkillID;
    PrimitiveValue *m_performSkillID;
    PrimitiveValue *m_commonReactionID;
    EffectSpecialActionKind m_specialActionKind;
    PrimitiveValue *m_scriptFormula;
};

#endif // SYSTEMEFFECT_H
