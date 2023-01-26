/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMTROOPREACTIONCONDITIONS_H
#define SYSTEMTROOPREACTIONCONDITIONS_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"
#include "conditionheroeskind.h"
#include "operationkind.h"

// -------------------------------------------------------
//
//  CLASS SystemTroopReactionConditions
//
//  A particulary troop reaction conditions (datas).
//
// -------------------------------------------------------

class SystemTroopReactionConditions : public SuperListItem
{
public:
    static const QString JSON_IS_NUMBER_OF_TURN;
    static const QString JSON_NUMBER_OF_TURN_PLUS;
    static const QString JSON_NUMBER_OF_TURN_TIMES;
    static const QString JSON_IS_HEROES_MONSTERS;
    static const QString JSON_IS_HEROES;
    static const QString JSON_CONDITION_HEROES_KIND;
    static const QString JSON_HERO_INSTANCE_ID;
    static const QString JSON_IS_STATUS_ID;
    static const QString JSON_STATUS_ID;
    static const QString JSON_IS_STATISTIC_ID;
    static const QString JSON_STATISTIC_ID;
    static const QString JSON_STATISTIC_OPERATION_KIND;
    static const QString JSON_STATISTIC_COMPARE;
    static const QString JSON_STATISTIC_COMPARE_UNIT;
    static const bool DEFAULT_IS_NUMBER_OF_TURN;
    static const bool DEFAULT_IS_HEROES_MONSTERS;
    static const bool DEFAULT_IS_HEROES;
    static const ConditionHeroesKind DEFAULT_CONDITION_HEROES_KIND;
    static const bool DEFAULT_IS_HERO_INSTANCE_ID;
    static const bool DEFAULT_IS_STATUS_ID;
    static const bool DEFAULT_IS_STATISTIC_ID;
    static const OperationKind DEFAULT_STATISTIC_OPERATION_KIND;
    static const bool DEFAULT_STATISTIC_COMPARE_UNIT;

    SystemTroopReactionConditions();
    SystemTroopReactionConditions(int i, QString n, bool isNumberOfTurn =
        DEFAULT_IS_NUMBER_OF_TURN, PrimitiveValue *numberOfTurnPlus = new
        PrimitiveValue(1), PrimitiveValue *numberOfTurnTimes = new
        PrimitiveValue(1), bool isHeroesMonsters = DEFAULT_IS_HEROES_MONSTERS,
        bool isHeroes = DEFAULT_IS_HEROES, ConditionHeroesKind
        conditionHeroesKind = DEFAULT_CONDITION_HEROES_KIND, PrimitiveValue
        *heroInstanceID = new PrimitiveValue(PrimitiveValueKind::Variable, 1),
        bool isStatusID = DEFAULT_IS_STATUS_ID, PrimitiveValue *statusID =
        PrimitiveValue::createDefaultDataBaseValue(), bool isStatisticID =
        DEFAULT_IS_STATISTIC_ID, PrimitiveValue *statisticID = PrimitiveValue
        ::createDefaultDataBaseValue(), OperationKind statisticOperationKind =
        DEFAULT_STATISTIC_OPERATION_KIND, PrimitiveValue *statisticCompare = new
        PrimitiveValue(0), bool statisticCompareUnit =
        DEFAULT_STATISTIC_COMPARE_UNIT);
    virtual ~SystemTroopReactionConditions();
    bool isNumberOfTurn() const;
    void setIsNumberOfTurn(bool isNumberOfTurn);
    PrimitiveValue * numberOfTurnPlus() const;
    PrimitiveValue * numberOfTurnTimes() const;
    bool isHeroesMonsters() const;
    void setIsHeroesMonsters(bool isHeroesMonsters);
    bool isHeroes() const;
    void setIsHeroes(bool isHeroes);
    ConditionHeroesKind conditionHeroesKind() const;
    void setConditionHeroesKind(ConditionHeroesKind conditionHeroesKind);
    PrimitiveValue * heroInstanceID() const;
    bool isStatusID() const;
    void setIsStatusID(bool isStatusID);
    PrimitiveValue * statusID() const;
    bool isStatisticID() const;
    void setIsStatisticID(bool isStatisticID);
    PrimitiveValue * statisticID() const;
    OperationKind statisticOperationKind() const;
    void setStatisticOperationKind(OperationKind statisticOperationKind);
    PrimitiveValue * statisticCompare() const;
    bool statisticCompareUnit() const;
    void setStatisticCompareUnit(bool statisticCompareUnit);

    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isNumberOfTurn;
    PrimitiveValue *m_numberOfTurnPlus;
    PrimitiveValue *m_numberOfTurnTimes;
    bool m_isHeroesMonsters;
    bool m_isHeroes;
    ConditionHeroesKind m_conditionHeroesKind;
    PrimitiveValue *m_heroInstanceID;
    bool m_isStatusID;
    PrimitiveValue *m_statusID;
    bool m_isStatisticID;
    PrimitiveValue *m_statisticID;
    OperationKind m_statisticOperationKind;
    PrimitiveValue *m_statisticCompare;
    bool m_statisticCompareUnit;
};

Q_DECLARE_METATYPE(SystemTroopReactionConditions)

#endif // SYSTEMTROOPREACTIONCONDITIONS_H
