/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemtroopreactionconditions.h"
#include "rpm.h"
#include "dialogsystemtroopreactionconditions.h"

const QString SystemTroopReactionConditions::JSON_IS_NUMBER_OF_TURN = "isNumberOfTurn";
const QString SystemTroopReactionConditions::JSON_NUMBER_OF_TURN_PLUS = "numberOfTurnPlus";
const QString SystemTroopReactionConditions::JSON_NUMBER_OF_TURN_TIMES = "numberOfTurnTimes";
const QString SystemTroopReactionConditions::JSON_IS_HEROES_MONSTERS = "isHeroesMonsters";
const QString SystemTroopReactionConditions::JSON_IS_HEROES = "isHeroes";
const QString SystemTroopReactionConditions::JSON_CONDITION_HEROES_KIND = "conditionHeroesKind";
const QString SystemTroopReactionConditions::JSON_HERO_INSTANCE_ID = "heroInstanceID";
const QString SystemTroopReactionConditions::JSON_IS_STATUS_ID = "isStatusID";
const QString SystemTroopReactionConditions::JSON_STATUS_ID = "statusID";
const QString SystemTroopReactionConditions::JSON_IS_STATISTIC_ID = "isStatisticID";
const QString SystemTroopReactionConditions::JSON_STATISTIC_ID = "statisticID";
const QString SystemTroopReactionConditions::JSON_STATISTIC_OPERATION_KIND = "statisticOperationKind";
const QString SystemTroopReactionConditions::JSON_STATISTIC_COMPARE = "statisticCompare";
const QString SystemTroopReactionConditions::JSON_STATISTIC_COMPARE_UNIT = "statisticCompareUnit";
const bool SystemTroopReactionConditions::DEFAULT_IS_NUMBER_OF_TURN = false;
const bool SystemTroopReactionConditions::DEFAULT_IS_HEROES_MONSTERS = false;
const bool SystemTroopReactionConditions::DEFAULT_IS_HEROES = false;
const ConditionHeroesKind SystemTroopReactionConditions::DEFAULT_CONDITION_HEROES_KIND = ConditionHeroesKind::AllTheHeroes;
const bool SystemTroopReactionConditions::DEFAULT_IS_HERO_INSTANCE_ID = false;
const bool SystemTroopReactionConditions::DEFAULT_IS_STATUS_ID = false;
const bool SystemTroopReactionConditions::DEFAULT_IS_STATISTIC_ID = false;
const OperationKind SystemTroopReactionConditions::DEFAULT_STATISTIC_OPERATION_KIND = OperationKind::EqualTo;
const bool SystemTroopReactionConditions::DEFAULT_STATISTIC_COMPARE_UNIT = true;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemTroopReactionConditions::SystemTroopReactionConditions() :
    SystemTroopReactionConditions(1, "")
{

}

SystemTroopReactionConditions::SystemTroopReactionConditions(int i, QString n,
    bool isNumberOfTurn, PrimitiveValue *numberOfTurnPlus, PrimitiveValue
    *numberOfTurnTimes, bool isHeroesMonsters, bool isHeroes,
    ConditionHeroesKind conditionHeroesKind, PrimitiveValue *heroInstanceID,
    bool isStatusID, PrimitiveValue *statusID, bool isStatisticID,
    PrimitiveValue *statisticID, OperationKind statisticOperationKind,
    PrimitiveValue *statisticCompare, bool statisticCompareUnit) :
    SuperListItem(i, n),
    m_isNumberOfTurn(isNumberOfTurn),
    m_numberOfTurnPlus(numberOfTurnPlus),
    m_numberOfTurnTimes(numberOfTurnTimes),
    m_isHeroesMonsters(isHeroesMonsters),
    m_isHeroes(isHeroes),
    m_conditionHeroesKind(conditionHeroesKind),
    m_heroInstanceID(heroInstanceID),
    m_isStatusID(isStatusID),
    m_statusID(statusID),
    m_isStatisticID(isStatisticID),
    m_statisticID(statisticID),
    m_statisticOperationKind(statisticOperationKind),
    m_statisticCompare(statisticCompare),
    m_statisticCompareUnit(statisticCompareUnit)
{
    m_statusID->setModelDataBase(RPM::get()->project()->gameDatas()->statusDatas()
        ->model());
    m_statisticID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonStatistics());
}

SystemTroopReactionConditions::~SystemTroopReactionConditions()
{
    delete m_numberOfTurnPlus;
    delete m_numberOfTurnTimes;
    delete m_heroInstanceID;
    delete m_statusID;
    delete m_statisticID;
    delete m_statisticCompare;
}

bool SystemTroopReactionConditions::isNumberOfTurn() const
{
    return m_isNumberOfTurn;
}

void SystemTroopReactionConditions::setIsNumberOfTurn(bool isNumberOfTurn)
{
    m_isNumberOfTurn = isNumberOfTurn;
}

PrimitiveValue * SystemTroopReactionConditions::numberOfTurnPlus() const
{
    return m_numberOfTurnPlus;
}

PrimitiveValue * SystemTroopReactionConditions::numberOfTurnTimes() const
{
    return m_numberOfTurnTimes;
}

bool SystemTroopReactionConditions::isHeroesMonsters() const
{
    return m_isHeroesMonsters;
}

void SystemTroopReactionConditions::setIsHeroesMonsters(bool isHeroesMonsters)
{
    m_isHeroesMonsters = isHeroesMonsters;
}

bool SystemTroopReactionConditions::isHeroes() const
{
    return m_isHeroes;
}

void SystemTroopReactionConditions::setIsHeroes(bool isHeroes)
{
    m_isHeroes = isHeroes;
}

ConditionHeroesKind SystemTroopReactionConditions::conditionHeroesKind() const
{
    return m_conditionHeroesKind;
}

void SystemTroopReactionConditions::setConditionHeroesKind(ConditionHeroesKind conditionHeroesKind)
{
    m_conditionHeroesKind = conditionHeroesKind;
}

PrimitiveValue * SystemTroopReactionConditions::heroInstanceID() const
{
    return m_heroInstanceID;
}

bool SystemTroopReactionConditions::isStatusID() const
{
    return m_isStatusID;
}

void SystemTroopReactionConditions::setIsStatusID(bool isStatusID)
{
    m_isStatusID = isStatusID;
}

PrimitiveValue * SystemTroopReactionConditions::statusID() const
{
    return m_statusID;
}

bool SystemTroopReactionConditions::isStatisticID() const
{
    return m_isStatisticID;
}

void SystemTroopReactionConditions::setIsStatisticID(bool isStatisticID)
{
    m_isStatisticID = isStatisticID;
}

PrimitiveValue * SystemTroopReactionConditions::statisticID() const
{
    return m_statisticID;
}

OperationKind SystemTroopReactionConditions::statisticOperationKind() const
{
    return m_statisticOperationKind;
}

void SystemTroopReactionConditions::setStatisticOperationKind(OperationKind statisticOperationKind)
{
    m_statisticOperationKind = statisticOperationKind;
}

PrimitiveValue * SystemTroopReactionConditions::statisticCompare() const
{
    return m_statisticCompare;
}

bool SystemTroopReactionConditions::statisticCompareUnit() const
{
    return m_statisticCompareUnit;
}

void SystemTroopReactionConditions::setStatisticCompareUnit(bool statisticCompareUnit)
{
    m_statisticCompareUnit = statisticCompareUnit;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemTroopReactionConditions::openDialog()
{
    SystemTroopReactionConditions conditions;
    conditions.setCopy(*this);
    DialogSystemTroopReactionConditions dialog(conditions);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(conditions);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemTroopReactionConditions::createCopy() const
{
    SystemTroopReactionConditions *super = new SystemTroopReactionConditions;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemTroopReactionConditions::setCopy(const SuperListItem &super)
{
    const SystemTroopReactionConditions *conditions;
    SuperListItem::setCopy(super);
    conditions = reinterpret_cast<const SystemTroopReactionConditions *>(&super);
    m_isNumberOfTurn = conditions->m_isNumberOfTurn;
    m_numberOfTurnPlus->setCopy(*conditions->m_numberOfTurnPlus);
    m_numberOfTurnTimes->setCopy(*conditions->m_numberOfTurnTimes);
    m_isHeroesMonsters = conditions->m_isHeroesMonsters;
    m_isHeroes = conditions->m_isHeroes;
    m_conditionHeroesKind = conditions->m_conditionHeroesKind;
    m_heroInstanceID->setCopy(*conditions->m_heroInstanceID);
    m_isStatusID = conditions->m_isStatusID;
    m_statusID->setCopy(*conditions->m_statusID);
    m_isStatisticID = conditions->m_isStatisticID;
    m_statisticID->setCopy(*conditions->m_statisticID);
    m_statisticOperationKind = conditions->m_statisticOperationKind;
    m_statisticCompare->setCopy(*conditions->m_statisticCompare);
    m_statisticCompareUnit = conditions->m_statisticCompareUnit;
}

// -------------------------------------------------------

void SystemTroopReactionConditions::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    if (json.contains(JSON_IS_NUMBER_OF_TURN))
    {
        m_isNumberOfTurn = json[JSON_IS_NUMBER_OF_TURN].toBool();
    }
    if (json.contains(JSON_NUMBER_OF_TURN_PLUS))
    {
        m_numberOfTurnPlus->read(json[JSON_NUMBER_OF_TURN_PLUS].toObject());
    }
    if (json.contains(JSON_NUMBER_OF_TURN_TIMES))
    {
        m_numberOfTurnTimes->read(json[JSON_NUMBER_OF_TURN_TIMES].toObject());
    }
    if (json.contains(JSON_IS_HEROES_MONSTERS))
    {
        m_isHeroesMonsters = json[JSON_IS_HEROES_MONSTERS].toBool();
    }
    if (json.contains(JSON_IS_HEROES))
    {
        m_isHeroes = json[JSON_IS_HEROES].toBool();
    }
    if (json.contains(JSON_CONDITION_HEROES_KIND))
    {
        m_conditionHeroesKind = static_cast<ConditionHeroesKind>(json[
            JSON_CONDITION_HEROES_KIND].toInt());
    }
    if (json.contains(JSON_HERO_INSTANCE_ID))
    {
        m_heroInstanceID->read(json[JSON_HERO_INSTANCE_ID].toObject());
    }
    if (json.contains(JSON_IS_STATUS_ID))
    {
        m_isStatusID = json[JSON_IS_STATUS_ID].toBool();
    }
    if (json.contains(JSON_STATUS_ID))
    {
        m_statusID->read(json[JSON_STATUS_ID].toObject());
    }
    if (json.contains(JSON_IS_STATISTIC_ID))
    {
        m_isStatisticID = json[JSON_IS_STATISTIC_ID].toBool();
    }
    if (json.contains(JSON_STATISTIC_ID))
    {
        m_statisticID->read(json[JSON_STATISTIC_ID].toObject());
    }
    if (json.contains(JSON_STATISTIC_OPERATION_KIND))
    {
        m_statisticOperationKind = static_cast<OperationKind>(json[
            JSON_STATISTIC_OPERATION_KIND].toInt());
    }
    if (json.contains(JSON_STATISTIC_COMPARE))
    {
        m_statisticCompare->read(json[JSON_STATISTIC_COMPARE].toObject());
    }
    if (json.contains(JSON_STATISTIC_COMPARE_UNIT))
    {
        m_statisticCompareUnit = json[JSON_STATISTIC_COMPARE_UNIT].toBool();
    }
}

// -------------------------------------------------------

void SystemTroopReactionConditions::write(QJsonObject &json) const {
    SuperListItem::write(json);
    QJsonObject obj;
    if (m_isNumberOfTurn != DEFAULT_IS_NUMBER_OF_TURN)
    {
        json[JSON_IS_NUMBER_OF_TURN] = m_isNumberOfTurn;
    }
    if (!m_numberOfTurnPlus->isDefaultNumberValue())
    {
        obj = QJsonObject();
        m_numberOfTurnPlus->write(obj);
        json[JSON_NUMBER_OF_TURN_PLUS] = obj;
    }
    if (!m_numberOfTurnTimes->isDefaultNumberValue())
    {
        obj = QJsonObject();
        m_numberOfTurnTimes->write(obj);
        json[JSON_NUMBER_OF_TURN_TIMES] = obj;
    }
    if (m_isHeroesMonsters != DEFAULT_IS_HEROES_MONSTERS)
    {
        json[JSON_IS_HEROES_MONSTERS] = m_isHeroesMonsters;
    }
    if (m_isHeroes != DEFAULT_IS_HEROES)
    {
        json[JSON_IS_HEROES] = m_isHeroes;
    }
    if (m_conditionHeroesKind != DEFAULT_CONDITION_HEROES_KIND)
    {
        json[JSON_CONDITION_HEROES_KIND] = static_cast<int>(m_conditionHeroesKind);
    }
    if (m_heroInstanceID->kind() != PrimitiveValueKind::Variable ||
        m_heroInstanceID->numberValue() != 1)
    {
        obj = QJsonObject();
        m_heroInstanceID->write(obj);
        json[JSON_HERO_INSTANCE_ID] = obj;
    }
    if (m_isStatusID != DEFAULT_IS_STATUS_ID)
    {
        json[JSON_IS_STATUS_ID] = m_isStatusID;
    }
    if (!m_statusID->isDefaultDataBaseValue())
    {
        obj = QJsonObject();
        m_statusID->write(obj);
        json[JSON_STATUS_ID] = obj;
    }
    if (m_isStatisticID != DEFAULT_IS_STATISTIC_ID)
    {
        json[JSON_IS_STATISTIC_ID] = m_isStatisticID;
    }
    if (!m_statisticID->isDefaultDataBaseValue())
    {
        obj = QJsonObject();
        m_statisticID->write(obj);
        json[JSON_STATISTIC_ID] = obj;
    }
    if (m_statisticOperationKind != DEFAULT_STATISTIC_OPERATION_KIND)
    {
        json[JSON_STATISTIC_OPERATION_KIND] = static_cast<int>(m_statisticOperationKind);
    }
    if (!m_statisticCompare->isDefaultNumberValue())
    {
        obj = QJsonObject();
        m_statisticCompare->write(obj);
        json[JSON_STATISTIC_COMPARE] = obj;
    }
    if (m_statisticCompareUnit != DEFAULT_STATISTIC_COMPARE_UNIT)
    {
        json[JSON_STATISTIC_COMPARE_UNIT] = m_statisticCompareUnit;
    }
}
