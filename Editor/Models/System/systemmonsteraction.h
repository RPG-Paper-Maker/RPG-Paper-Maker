/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMMONSTERACTION_H
#define SYSTEMMONSTERACTION_H

#include "superlistitem.h"
#include "primitivevalue.h"
#include "monsteractionkind.h"
#include "monsteractiontargetkind.h"
#include "operationkind.h"
#include "systemmonster.h"

// -------------------------------------------------------
//
//  CLASS SystemMonsterAction
//
//  A particulary monster action (datas).
//
// -------------------------------------------------------

class SystemMonsterAction : public SuperListItem
{
public:
    static const QString JSON_ACTION_KIND;
    static const QString JSON_SKILL_ID;
    static const QString JSON_ITEM_ID;
    static const QString JSON_ITEM_NUMBER_MAX;
    static const QString JSON_PRIORITY;
    static const QString JSON_TARGET_KIND;
    static const QString JSON_IS_CONDITION_TURN;
    static const QString JSON_OPERATION_KIND_TURN;
    static const QString JSON_TURN_VALUE_COMPARE;
    static const QString JSON_IS_CONDITION_STATISTIC;
    static const QString JSON_STATISTIC_ID;
    static const QString JSON_OPERATION_KIND_STATISTIC;
    static const QString JSON_STATISTIC_VALUE_COMPARE;
    static const QString JSON_IS_CONDITION_VARIABLE;
    static const QString JSON_VARIABLE_ID;
    static const QString JSON_OPERATION_KIND_VARIABLE;
    static const QString JSON_VARIABLE_VALUE_COMPARE;
    static const QString JSON_IS_CONDITION_STATUS;
    static const QString JSON_STATUS_ID;
    static const QString JSON_IS_CONDITION_SCRIPT;
    static const QString JSON_SCRIPT;
    static const MonsterActionKind DEFAULT_ACTION_KIND;
    static const int DEFAULT_SKILL_ID;
    static const int DEFAULT_ITEM_ID;
    static const int DEFAULT_ITEM_NUMBER_MAX;
    static const int DEFAULT_PRIORITY;
    static const MonsterActionTargetKind DEFAULT_TARGET_KIND;
    static const bool DEFAULT_IS_CONDITION_TURN;
    static const OperationKind DEFAULT_OPERATION_KIND_TURN;
    static const int DEFAULT_TURN_VALUE_COMPARE;
    static const bool DEFAULT_IS_CONDITION_STATISTIC;
    static const int DEFAULT_STATISTIC_ID;
    static const OperationKind DEFAULT_OPERATION_KIND_STATISTIC;
    static const int DEFAULT_STATISTIC_VALUE_COMPARE;
    static const bool DEFAULT_IS_CONDITION_VARIABLE;
    static const int DEFAULT_VARIABLE_ID;
    static const OperationKind DEFAULT_OPERATION_KIND_VARIABLE;
    static const int DEFAULT_VARIABLE_VALUE_COMPARE;
    static const bool DEFAULT_IS_CONDITION_STATUS;
    static const int DEFAULT_STATUS_ID;
    static const bool DEFAULT_IS_CONDITION_SCRIPT;
    static const QString DEFAULT_SCRIPT;

    SystemMonsterAction();
    SystemMonsterAction(int i, QString name, MonsterActionKind ak =
        DEFAULT_ACTION_KIND, PrimitiveValue *sid = new PrimitiveValue(
        PrimitiveValueKind::DataBase, DEFAULT_SKILL_ID), PrimitiveValue *iid =
        new PrimitiveValue(PrimitiveValueKind::DataBase, DEFAULT_ITEM_ID),
        PrimitiveValue *inm = new PrimitiveValue(DEFAULT_ITEM_NUMBER_MAX),
        PrimitiveValue *p = new PrimitiveValue(DEFAULT_PRIORITY),
        MonsterActionTargetKind tk = DEFAULT_TARGET_KIND, bool ict =
        DEFAULT_IS_CONDITION_TURN, OperationKind okt =
        DEFAULT_OPERATION_KIND_TURN, PrimitiveValue *tvc = new PrimitiveValue(
        DEFAULT_TURN_VALUE_COMPARE), bool ics = DEFAULT_IS_CONDITION_STATISTIC,
        PrimitiveValue *stid = new PrimitiveValue(PrimitiveValueKind::DataBase,
        DEFAULT_STATISTIC_ID), OperationKind oks =
        DEFAULT_OPERATION_KIND_STATISTIC, PrimitiveValue *svc = new
        PrimitiveValue(DEFAULT_STATISTIC_VALUE_COMPARE), bool icv =
        DEFAULT_IS_CONDITION_VARIABLE, SuperListItem *vid = new SuperListItem(
        DEFAULT_VARIABLE_ID), OperationKind okv =
        DEFAULT_OPERATION_KIND_VARIABLE, PrimitiveValue *vvc = new
        PrimitiveValue(DEFAULT_VARIABLE_VALUE_COMPARE), bool icst =
        DEFAULT_IS_CONDITION_STATUS, PrimitiveValue *stsid = new PrimitiveValue(
        PrimitiveValueKind::DataBase, DEFAULT_STATUS_ID), bool icsc =
        DEFAULT_IS_CONDITION_SCRIPT, PrimitiveValue *s = new PrimitiveValue(
        DEFAULT_SCRIPT));
    virtual ~SystemMonsterAction();
    MonsterActionKind actionKind() const;
    void setActionKind(MonsterActionKind ak);
    PrimitiveValue * skillID() const;
    PrimitiveValue * itemID() const;
    PrimitiveValue * itemNumberMax() const;
    PrimitiveValue * priority() const;
    MonsterActionTargetKind targetKind() const;
    void setTargetKind(MonsterActionTargetKind tk);
    bool isConditionTurn() const;
    void setIsConditionTurn(bool ict);
    OperationKind operationKindTurn() const;
    void setOperationKindTurn(OperationKind okt);
    PrimitiveValue * turnValueCompare() const;
    bool isConditionStatistic() const;
    void setIsConditionStatistic(bool ics);
    PrimitiveValue * statisticID() const;
    OperationKind operationKindStatistic() const;
    void setOperationKindStatistic(OperationKind oks);
    PrimitiveValue * statisticValueCompare() const;
    bool isConditionVariable() const;
    void setIsConditionVariable(bool icv);
    SuperListItem * variableID() const;
    OperationKind operationKindVariable() const;
    void setOperationKindVariable(OperationKind okv);
    PrimitiveValue * variableValueCompare() const;
    bool isConditionStatus() const;
    void setIsConditionStatus(bool ics);
    PrimitiveValue * statusID() const;
    bool isConditionScript() const;
    void setIsConditionScript(bool icsc);
    PrimitiveValue * script() const;
    SystemMonster * monster() const;
    void setMonster(SystemMonster *monster);
    bool editing() const;

    QString conditionsToString() const;
    double calculateProbability(int p = -1) const;
    QString probabilityToString(int p = -1) const;

    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    MonsterActionKind m_actionKind;
    PrimitiveValue *m_skillID;
    PrimitiveValue *m_itemID;
    PrimitiveValue *m_itemNumberMax;
    PrimitiveValue *m_priority;
    MonsterActionTargetKind m_targetKind;
    bool m_isConditionTurn;
    OperationKind m_operationKindTurn;
    PrimitiveValue *m_turnValueCompare;
    bool m_isConditionStatistic;
    PrimitiveValue *m_statisticID;
    OperationKind m_operationKindStatistic;
    PrimitiveValue *m_statisticValueCompare;
    bool m_isConditionVariable;
    SuperListItem *m_variableID;
    OperationKind m_operationKindVariable;
    PrimitiveValue *m_variableValueCompare;
    bool m_isConditionStatus;
    PrimitiveValue *m_statusID;
    bool m_isConditionScript;
    PrimitiveValue *m_script;
    SystemMonster *m_monster;
    bool m_editing;
};

#endif // SYSTEMMONSTERACTION_H
