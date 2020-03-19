/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    SystemMonsterAction();
    SystemMonsterAction(int i, QString name, PrimitiveValue *iid);
    virtual ~SystemMonsterAction();
    MonsterActionKind actionKind() const;
    void setActionKind(MonsterActionKind ak);
    PrimitiveValue * skillID() const;
    PrimitiveValue * itemID() const;
    PrimitiveValue * priority() const;
    MonsterActionTargetKind targetKind() const;
    void setTargetKind(MonsterActionTargetKind tk);
    bool isConditionTurn() const;
    void setIsCOnditionTurn(bool ict);
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

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    MonsterActionKind m_actionKind;
    PrimitiveValue *m_skillID;
    PrimitiveValue *m_itemID;
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
};

#endif // SYSTEMMONSTERACTION_H
