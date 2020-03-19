/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemmonsteraction.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMonsterAction::SystemMonsterAction() :
    SystemMonsterAction(-1, "", new PrimitiveValue(PrimitiveValueKind::DataBase,
        1))
{

}

SystemMonsterAction::SystemMonsterAction(int i, QString name, PrimitiveValue
    *iid) :
    SuperListItem(i, name),
    m_itemID(iid)
{
    m_itemID->setModelDataBase(RPM::get()->project()->gameDatas()->itemsDatas()
        ->model());
}

SystemMonsterAction::~SystemMonsterAction()
{
    delete m_itemID;
}

MonsterActionKind SystemMonsterAction::actionKind() const
{
    return m_actionKind;
}

void SystemMonsterAction::setActionKind(MonsterActionKind ak)
{
    m_actionKind = ak;
}

PrimitiveValue * SystemMonsterAction::skillID() const
{
    return m_skillID;
}

PrimitiveValue * SystemMonsterAction::itemID() const
{
    return m_itemID;
}

PrimitiveValue * SystemMonsterAction::priority() const
{
    return m_priority;
}

MonsterActionTargetKind SystemMonsterAction::targetKind() const
{
    return m_targetKind;
}

void SystemMonsterAction::setTargetKind(MonsterActionTargetKind tk)
{
    m_targetKind = tk;
}

bool SystemMonsterAction::isConditionTurn() const
{
    return m_isConditionTurn;
}

void SystemMonsterAction::setIsCOnditionTurn(bool ict)
{
    m_isConditionTurn = ict;
}

OperationKind SystemMonsterAction::operationKindTurn() const
{
    return m_operationKindTurn;
}

void SystemMonsterAction::setOperationKindTurn(OperationKind okt)
{
    m_operationKindTurn = okt;
}

PrimitiveValue * SystemMonsterAction::turnValueCompare() const
{
    return m_turnValueCompare;
}

bool SystemMonsterAction::isConditionStatistic() const
{
    return m_isConditionStatistic;
}

void SystemMonsterAction::setIsConditionStatistic(bool ics)
{
    m_isConditionStatistic = ics;
}

PrimitiveValue * SystemMonsterAction::statisticID() const
{
    return m_statisticID;
}

OperationKind SystemMonsterAction::operationKindStatistic() const
{
    return m_operationKindStatistic;
}

void SystemMonsterAction::setOperationKindStatistic(OperationKind oks)
{
    m_operationKindStatistic = oks;
}

PrimitiveValue * SystemMonsterAction::statisticValueCompare() const
{
    return m_statisticValueCompare;
}

bool SystemMonsterAction::isConditionVariable() const
{
    return m_isConditionVariable;
}

void SystemMonsterAction::setIsConditionVariable(bool icv)
{
    m_isConditionVariable = icv;
}

SuperListItem * SystemMonsterAction::variableID() const
{
    return m_variableID;
}

OperationKind SystemMonsterAction::operationKindVariable() const
{
    return m_operationKindVariable;
}

void SystemMonsterAction::setOperationKindVariable(OperationKind okv)
{
    m_operationKindVariable = okv;
}

PrimitiveValue * SystemMonsterAction::variableValueCompare() const
{
    return m_variableValueCompare:
}

bool SystemMonsterAction::isConditionStatus() const
{
    return m_isConditionStatus;
}

void SystemMonsterAction::setIsConditionStatus(bool ics)
{
    m_isConditionStatus = ics;
}

PrimitiveValue * SystemMonsterAction::statusID() const
{
    return m_statusID;
}

bool SystemMonsterAction::isConditionScript() const
{
    return m_isConditionScript;
}

void SystemMonsterAction::setIsConditionScript(bool icsc)
{
    m_isConditionScript = icsc;
}

PrimitiveValue * SystemMonsterAction::script() const
{
    return m_script;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------
// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemMonsterAction::openDialog()
{
    SystemMonsterAction action;
    action.setCopy(*this);
    DialogSystemMonsterAction dialog(action);
    if (dialog.exec() == QDialog::Accepted)
    {
        setCopy(action);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem * SystemMonsterAction::createCopy() const {
    SystemMonsterAction* super = new SystemMonsterAction;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemMonsterAction::setCopy(const SuperListItem &super) {
    const SystemMonsterAction *monster;

    SuperListItem::setCopy(super);
    monster = reinterpret_cast<const SystemMonsterAction *>(&super);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemMonsterAction::read(const QJsonObject &json){
    SuperListItem::read(json);
    QJsonArray tab;
}

// -------------------------------------------------------

void SystemMonsterAction::write(QJsonObject &json) const{
    SuperListItem::write(json);
}
