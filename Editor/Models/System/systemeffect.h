/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static const QString JSON_DAMAGES_STATISTIC_ID;
    static const QString JSON_DAMAGES_CURRENCY_ID;
    static const QString JSON_DAMAGES_VARIABLE_ID;
    static const QString JSON_DAMAGES_FORMULA;
    static const QString JSON_IS_DAMAGE_MINIMUM;
    static const QString JSON_DAMAGE_MINIMUM;
    static const QString JSON_IS_DAMAGE_MAXIMUM;
    static const QString JSON_DAMAGE_MAXIMUM;
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
    SystemEffect(EffectKind kind, DamagesKind damageKind, PrimitiveValue
        *damagesStatisticID, PrimitiveValue *damagesCurrencyID, int
        damagesVariableID, PrimitiveValue *damagesFormula, bool idmin,
        PrimitiveValue *dmin, bool idmax, PrimitiveValue *dmax, bool
        isDamageElement, PrimitiveValue *damagesElementID, bool isDamageVariance
        , PrimitiveValue *damagesVarianceFormula, bool isDamageCritical,
        PrimitiveValue *damagesCriticalFormula, bool isDamagePrecision,
        PrimitiveValue *damagesPrecisionFormula, bool isAddStatus,
        PrimitiveValue *statusID, PrimitiveValue *statusPrecisionFormula, bool
        isAddSkill, PrimitiveValue *addSkillID, PrimitiveValue *performSkillID,
        PrimitiveValue *commonReactionID, EffectSpecialActionKind
        specialActionKind, PrimitiveValue *scriptFormula);
    virtual ~SystemEffect();
    EffectKind kind() const;
    void setKind(EffectKind k);
    SuperListItem * damagesKind() const;
    PrimitiveValue * damagesStatisticID() const;
    PrimitiveValue * damagesCurrencyID() const;
    SuperListItem * damagesVariableID() const;
    PrimitiveValue * damagesFormula() const;
    bool isDamagesMinimum() const;
    void setIsDamagesMinimum(bool b);
    PrimitiveValue * damagesMinimum() const;
    bool isDamagesMaximum() const;
    void setIsDamagesMaximum(bool b);
    PrimitiveValue * damagesMaximum() const;
    bool isDamageElement() const;
    void setIsDamageElement(bool b);
    PrimitiveValue * damagesElementID() const;
    bool isDamageVariance() const;
    void setIsDamageVariance(bool b);
    PrimitiveValue * damagesVarianceFormula() const;
    bool isDamageCritical() const;
    void setIsDamageCritical(bool b);
    PrimitiveValue * damagesCriticalFormula() const;
    bool isDamagePrecision() const;
    void setIsDamagePrecision(bool b);
    PrimitiveValue * damagesPrecisionFormula() const;
    bool isAddStatus() const;
    void setIsAddStatus(bool b);
    PrimitiveValue * statusID() const;
    PrimitiveValue * statusPrecisionFormula() const;
    bool isAddSkill() const;
    void setIsAddSkill(bool b);
    PrimitiveValue * addSkillID() const;
    PrimitiveValue * performSkillID() const;
    PrimitiveValue * commonReactionID() const;
    EffectSpecialActionKind specialActionKind() const;
    void setSpecialActionKind(EffectSpecialActionKind k);
    PrimitiveValue * scriptFormula() const;

    static SystemEffect * createSpecialAction(EffectSpecialActionKind action);
    static SystemEffect * createStat(int stat, QString formula, QString min, int element,
        QString variance, QString critical, QString precision);
    static SystemEffect * createDamage(QString formula, QString min = QString(),
        int element = -1, QString variance = QString(), QString critical =
        QString(), QString precision = QString());
    static SystemEffect * createDamageMP(QString formula, int element = -1,
        QString variance = QString(), QString critical = QString(), QString
        precision = QString());

    static SystemEffect * createDamageTP(QString formula, int element = -1,
        QString variance = QString(), QString critical = QString(), QString
        precision = QString());


    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemEffect &effect);
    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    EffectKind m_kind;
    SuperListItem *m_damagesKind;
    PrimitiveValue *m_damagesStatisticID;
    PrimitiveValue *m_damagesCurrencyID;
    SuperListItem *m_damagesVariableID;
    PrimitiveValue *m_damagesFormula;
    bool m_isDamagesMinimum;
    PrimitiveValue *m_damagesMinimum;
    bool m_isDamagesMaximum;
    PrimitiveValue *m_damagesMaximum;
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

Q_DECLARE_METATYPE(SystemEffect)

#endif // SYSTEMEFFECT_H
