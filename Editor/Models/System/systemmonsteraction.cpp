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

const QString SystemMonsterAction::JSON_ACTION_KIND = "ak";
const QString SystemMonsterAction::JSON_SKILL_ID = "sid";
const QString SystemMonsterAction::JSON_ITEM_ID = "iid";
const QString SystemMonsterAction::JSON_ITEM_NUMBER_MAX = "inm";
const QString SystemMonsterAction::JSON_PRIORITY = "p";
const QString SystemMonsterAction::JSON_TARGET_KIND = "tk";
const QString SystemMonsterAction::JSON_IS_CONDITION_TURN = "ict";
const QString SystemMonsterAction::JSON_OPERATION_KIND_TURN = "okt";
const QString SystemMonsterAction::JSON_TURN_VALUE_COMPARE = "tvc";
const QString SystemMonsterAction::JSON_IS_CONDITION_STATISTIC = "ics";
const QString SystemMonsterAction::JSON_STATISTIC_ID = "stid";
const QString SystemMonsterAction::JSON_OPERATION_KIND_STATISTIC = "oks";
const QString SystemMonsterAction::JSON_STATISTIC_VALUE_COMPARE = "svc";
const QString SystemMonsterAction::JSON_IS_CONDITION_VARIABLE = "icv";
const QString SystemMonsterAction::JSON_VARIABLE_ID = "vid";
const QString SystemMonsterAction::JSON_OPERATION_KIND_VARIABLE = "okv";
const QString SystemMonsterAction::JSON_VARIABLE_VALUE_COMPARE = "vvc";
const QString SystemMonsterAction::JSON_IS_CONDITION_STATUS = "icst";
const QString SystemMonsterAction::JSON_STATUS_ID = "stsid";
const QString SystemMonsterAction::JSON_IS_CONDITION_SCRIPT = "icsc";
const QString SystemMonsterAction::JSON_SCRIPT = "s";
const MonsterActionKind SystemMonsterAction::DEFAULT_ACTION_KIND =
    MonsterActionKind::UseSkill;
const int SystemMonsterAction::DEFAULT_SKILL_ID = 1;
const int SystemMonsterAction::DEFAULT_ITEM_ID = 1;
const int SystemMonsterAction::DEFAULT_ITEM_NUMBER_MAX = 1;
const int SystemMonsterAction::DEFAULT_PRIORITY = 10;
const MonsterActionTargetKind SystemMonsterAction::DEFAULT_TARGET_KIND =
    MonsterActionTargetKind::Random;
const bool SystemMonsterAction::DEFAULT_IS_CONDITION_TURN = false;
const OperationKind SystemMonsterAction::DEFAULT_OPERATION_KIND_TURN =
    OperationKind::EqualTo;
const int SystemMonsterAction::DEFAULT_TURN_VALUE_COMPARE = 0;
const bool SystemMonsterAction::DEFAULT_IS_CONDITION_STATISTIC = false;
const int SystemMonsterAction::DEFAULT_STATISTIC_ID = 1;
const OperationKind SystemMonsterAction::DEFAULT_OPERATION_KIND_STATISTIC =
    OperationKind::EqualTo;
const int SystemMonsterAction::DEFAULT_STATISTIC_VALUE_COMPARE = 0;
const bool SystemMonsterAction::DEFAULT_IS_CONDITION_VARIABLE = false;
const int SystemMonsterAction::DEFAULT_VARIABLE_ID = 1;
const OperationKind SystemMonsterAction::DEFAULT_OPERATION_KIND_VARIABLE =
    OperationKind::EqualTo;
const int SystemMonsterAction::DEFAULT_VARIABLE_VALUE_COMPARE = 0;
const bool SystemMonsterAction::DEFAULT_IS_CONDITION_STATUS = false;
const int SystemMonsterAction::DEFAULT_STATUS_ID = 1;
const bool SystemMonsterAction::DEFAULT_IS_CONDITION_SCRIPT = false;
const QString SystemMonsterAction::DEFAULT_SCRIPT = "";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMonsterAction::SystemMonsterAction() :
    SystemMonsterAction(-1, "")
{

}

SystemMonsterAction::SystemMonsterAction(int i, QString name, MonsterActionKind
    ak, PrimitiveValue *sid, PrimitiveValue *iid, PrimitiveValue *inm,
    PrimitiveValue *p, MonsterActionTargetKind tk, bool ict, OperationKind okt,
    PrimitiveValue *tvc, bool ics, PrimitiveValue *stid, OperationKind oks,
    PrimitiveValue *svc, bool icv, SuperListItem *vid, OperationKind okv,
    PrimitiveValue *vvc, bool icst, PrimitiveValue *stsid, bool icsc,
    PrimitiveValue *s) :
    SuperListItem(i, name),
    m_actionKind(ak),
    m_skillID(sid),
    m_itemID(iid),
    m_itemNumberMax(inm),
    m_priority(p),
    m_targetKind(tk),
    m_isConditionTurn(ict),
    m_operationKindTurn(okt),
    m_turnValueCompare(tvc),
    m_isConditionStatistic(ics),
    m_statisticID(stid),
    m_operationKindStatistic(oks),
    m_statisticValueCompare(svc),
    m_isConditionVariable(icv),
    m_variableID(vid),
    m_operationKindVariable(okv),
    m_variableValueCompare(vvc),
    m_isConditionStatus(icst),
    m_statusID(stsid),
    m_isConditionScript(icsc),
    m_script(s),
    m_monster(nullptr),
    m_editing(false)
{
    m_skillID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->skillsDatas()->model());
    m_itemID->setModelDataBase(RPM::get()->project()->gameDatas()->itemsDatas()
        ->model());
    m_statisticID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonStatistics());
    m_statusID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->statusDatas()->model());
    this->setMonster(reinterpret_cast<SystemMonster *>(RPM::get()
        ->selectedMonster()));
}

SystemMonsterAction::~SystemMonsterAction()
{
    delete m_skillID;
    delete m_itemID;
    delete m_itemNumberMax;
    delete m_priority;
    delete m_turnValueCompare;
    delete m_statisticID;
    delete m_statisticValueCompare;
    delete m_variableID;
    delete m_variableValueCompare;
    delete m_statusID;
    delete m_script;
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

PrimitiveValue * SystemMonsterAction::itemNumberMax() const
{
    return m_itemNumberMax;
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

void SystemMonsterAction::setIsConditionTurn(bool ict)
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
    return m_variableValueCompare;
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

SystemMonster * SystemMonsterAction::monster() const
{
    return m_monster;
}

void SystemMonsterAction::setMonster(SystemMonster *monster)
{
    m_monster = monster;
}

bool SystemMonsterAction::editing() const
{
    return m_editing;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemMonsterAction::conditionsToString() const
{
    QStringList conditions;

    if (m_isConditionTurn) {
        conditions << RPM::translate(Translations::TURN_VALUE_IS);
    }
    if (m_isConditionStatistic) {
        conditions << RPM::translate(Translations::STATISTIC_ID);
    }
    if (m_isConditionVariable) {
        conditions << RPM::translate(Translations::VARIABLE);
    }
    if (m_isConditionStatus) {
        conditions << RPM::translate(Translations::IS_UNDER_EFFECT_OF_STATUS_ID);
    }
    if (m_isConditionScript) {
        conditions << RPM::translate(Translations::SCRIPT);
    }

    return conditions.join(" | ");
}

// -------------------------------------------------------

double SystemMonsterAction::calculateProbability(int p) const
{
    if (m_monster == nullptr) {
        return -1;
    }

    SystemMonsterAction *action;
    double sum;
    int i, l;

    sum = 0;
    for (i = 0, l = m_monster->modelActions()->invisibleRootItem()->rowCount();
         i < l; i++)
    {
        action = reinterpret_cast<SystemMonsterAction *>(m_monster
            ->modelActions()->item(i)->data().value<quintptr>());
        if (action != nullptr)
        {
            if (action->priority()->kind() == PrimitiveValueKind::Number)
            {
                if (!action->editing())
                {
                    sum += action->priority()->numberValue();
                }
            } else
            {
                return -1;
            }
        }
    }
    sum += (p < 0 ? 0 : p);

    return sum == 0.0 ? 0 : (m_priority->numberValue() / sum) * 100.0;
}

// -------------------------------------------------------

QString SystemMonsterAction::probabilityToString(int p) const
{
    double proba = this->calculateProbability(p);

    return proba < 0 ? "?" : QString::number(proba);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemMonsterAction::toString() const {
    QString txt;

    txt = SuperListItem::beginningText;
    switch (m_actionKind)
    {
    case MonsterActionKind::UseSkill:
        txt += RPM::translate(Translations::USE_SKILL_ID) + RPM::SPACE +
            m_skillID->toString();
        break;
    case MonsterActionKind::UseItem:
        txt += RPM::translate(Translations::USE_ITEM_ID) + RPM::SPACE + m_itemID
            ->toString() + RPM::SPACE + RPM::translate(Translations::NUMBER_MAX)
            + RPM::SPACE + m_itemNumberMax->toString();
        break;
    case MonsterActionKind::DoNothing:
        txt += RPM::translate(Translations::DO_NOTHING);
        break;
    }
    return txt;
}

// -------------------------------------------------------

bool SystemMonsterAction::openDialog()
{
    SystemMonsterAction action;
    SystemMonster *monster;

    monster = action.monster();
    action.setCopy(*this);
    action.setMonster(monster);
    m_editing = true;
    DialogSystemMonsterAction dialog(action);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(action);
        m_editing = false;

        return true;
    }
    m_editing = false;

    return false;
}

// -------------------------------------------------------

SuperListItem * SystemMonsterAction::createCopy() const
{
    SystemMonsterAction* super = new SystemMonsterAction;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemMonsterAction::setCopy(const SuperListItem &super)
{
    const SystemMonsterAction *monster;

    SuperListItem::setCopy(super);
    monster = reinterpret_cast<const SystemMonsterAction *>(&super);
    m_actionKind = monster->m_actionKind;
    m_skillID->setCopy(*monster->m_skillID);
    m_itemID->setCopy(*monster->m_itemID);
    m_itemNumberMax->setCopy(*monster->m_itemNumberMax);
    m_priority->setCopy(*monster->m_priority);
    m_targetKind = monster->m_targetKind;
    m_isConditionTurn = monster->m_isConditionTurn;
    m_operationKindTurn = monster->m_operationKindTurn;
    m_turnValueCompare->setCopy(*monster->m_turnValueCompare);
    m_isConditionStatistic = monster->m_isConditionStatistic;
    m_statisticID->setCopy(*monster->m_statisticID);
    m_operationKindStatistic = monster->m_operationKindStatistic;
    m_statisticValueCompare->setCopy(*monster->m_statisticValueCompare);
    m_isConditionVariable = monster->m_isConditionVariable;
    m_variableID->setCopy(*monster->m_variableID);
    m_operationKindVariable = monster->m_operationKindVariable;
    m_variableValueCompare->setCopy(*monster->m_variableValueCompare);
    m_isConditionStatus = monster->m_isConditionStatus;
    m_statusID->setCopy(*monster->m_statusID);
    m_isConditionScript = monster->m_isConditionScript;
    m_script->setCopy(*monster->script());
    m_monster = monster->m_monster;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemMonsterAction::getModelRow() const
{
    QList<QStandardItem *> row;
    QStandardItem *itemAction;
    QStandardItem *itemConditions;
    QStandardItem *itemPriority;
    QStandardItem *itemProbability;

    row = QList<QStandardItem *>();
    itemAction = new QStandardItem;
    itemConditions = new QStandardItem;
    itemPriority = new QStandardItem;
    itemProbability = new QStandardItem;
    itemAction->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemAction->setText(this->toString());
    itemAction->setFlags(itemAction->flags() ^ (Qt::ItemIsDropEnabled));
    itemConditions->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemConditions->setText(this->conditionsToString());
    itemConditions->setFlags(itemConditions->flags() ^ (Qt::ItemIsDropEnabled));
    itemPriority->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemPriority->setText(m_priority->toString());
    itemPriority->setFlags(itemPriority->flags() ^ (Qt::ItemIsDropEnabled));
    itemProbability->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemProbability->setText(this->probabilityToString());
    itemProbability->setFlags(itemProbability->flags() ^ (Qt::ItemIsDropEnabled));
    row.append(itemAction);
    row.append(itemConditions);
    row.append(itemPriority);
    row.append(itemProbability);

    return row;
}

// -------------------------------------------------------

void SystemMonsterAction::read(const QJsonObject &json)
{
    SuperListItem::read(json);

    if (json.contains(JSON_ACTION_KIND))
    {
        m_actionKind = static_cast<MonsterActionKind>(json[JSON_ACTION_KIND]
            .toInt());
    }
    if (json.contains(JSON_SKILL_ID))
    {
        m_skillID->read(json[JSON_SKILL_ID].toObject());
    }
    if (json.contains(JSON_ITEM_ID))
    {
        m_itemID->read(json[JSON_ITEM_ID].toObject());
    }
    if (json.contains(JSON_ITEM_NUMBER_MAX))
    {
        m_itemNumberMax->read(json[JSON_ITEM_NUMBER_MAX].toObject());
    }
    if (json.contains(JSON_PRIORITY))
    {
        m_priority->read(json[JSON_PRIORITY].toObject());
    }
    if (json.contains(JSON_TARGET_KIND))
    {
        m_targetKind = static_cast<MonsterActionTargetKind>(json[
            JSON_TARGET_KIND].toInt());
    }
    if (json.contains(JSON_IS_CONDITION_TURN))
    {
        m_isConditionTurn = json[JSON_IS_CONDITION_TURN].toBool();
    }
    if (json.contains(JSON_OPERATION_KIND_TURN))
    {
        m_operationKindTurn = static_cast<OperationKind>(json[
            JSON_OPERATION_KIND_TURN].toInt());
    }
    if (json.contains(JSON_TURN_VALUE_COMPARE))
    {
        m_turnValueCompare->read(json[JSON_TURN_VALUE_COMPARE].toObject());
    }
    if (json.contains(JSON_IS_CONDITION_STATISTIC))
    {
        m_isConditionStatistic = json[JSON_IS_CONDITION_STATISTIC].toBool();
    }
    if (json.contains(JSON_STATISTIC_ID))
    {
        m_statisticID->read(json[JSON_STATISTIC_ID].toObject());
    }
    if (json.contains(JSON_OPERATION_KIND_STATISTIC))
    {
        m_operationKindStatistic = static_cast<OperationKind>(json[
            JSON_OPERATION_KIND_STATISTIC].toInt());
    }
    if (json.contains(JSON_STATISTIC_VALUE_COMPARE))
    {
        m_statisticValueCompare->read(json[JSON_STATISTIC_VALUE_COMPARE]
            .toObject());
    }
    if (json.contains(JSON_IS_CONDITION_VARIABLE))
    {
        m_isConditionVariable = json[JSON_IS_CONDITION_VARIABLE].toBool();
    }
    if (json.contains(JSON_VARIABLE_ID))
    {
        m_variableID->setId(json[JSON_VARIABLE_ID].toInt());
    }
    if (json.contains(JSON_OPERATION_KIND_VARIABLE))
    {
        m_operationKindVariable = static_cast<OperationKind>(json[
            JSON_OPERATION_KIND_VARIABLE].toInt());
    }
    if (json.contains(JSON_VARIABLE_VALUE_COMPARE))
    {
        m_variableValueCompare->read(json[JSON_VARIABLE_VALUE_COMPARE].toObject());
    }
    if (json.contains(JSON_IS_CONDITION_STATUS))
    {
        m_isConditionStatus = json[JSON_IS_CONDITION_STATUS].toBool();
    }
    if (json.contains(JSON_STATUS_ID))
    {
        m_statusID->read(json[JSON_STATUS_ID].toObject());
    }
    if (json.contains(JSON_IS_CONDITION_SCRIPT))
    {
        m_isConditionScript = json[JSON_IS_CONDITION_SCRIPT].toBool();
    }
    if (json.contains(JSON_SCRIPT))
    {
        m_script->read(json[JSON_SCRIPT].toObject());
    }
    m_monster = reinterpret_cast<SystemMonster *>(RPM::get()->selectedMonster());
}

// -------------------------------------------------------

void SystemMonsterAction::write(QJsonObject &json) const
{
    QJsonObject obj;

    SuperListItem::write(json);

    if (m_actionKind != DEFAULT_ACTION_KIND)
    {
        json[JSON_ACTION_KIND] = static_cast<int>(m_actionKind);
    }
    if (m_actionKind == MonsterActionKind::UseSkill && (m_skillID->kind() !=
        PrimitiveValueKind::DataBase || m_skillID->numberValue() !=
        DEFAULT_SKILL_ID))
    {
        obj = QJsonObject();
        m_skillID->write(obj);
        json[JSON_SKILL_ID] = obj;
    }
    if (m_actionKind == MonsterActionKind::UseItem && (m_itemID->kind() !=
        PrimitiveValueKind::DataBase || m_itemID->numberValue() !=
        DEFAULT_ITEM_ID))
    {
        obj = QJsonObject();
        m_itemID->write(obj);
        json[JSON_ITEM_ID] = obj;
    }
    if (m_actionKind == MonsterActionKind::UseItem && (m_itemNumberMax->kind()
        != PrimitiveValueKind::Number || m_itemNumberMax->numberValue() !=
        DEFAULT_ITEM_NUMBER_MAX))
    {
        obj = QJsonObject();
        m_itemNumberMax->write(obj);
        json[JSON_ITEM_NUMBER_MAX] = obj;
    }
    if (m_priority->kind() != PrimitiveValueKind::Number || m_priority
        ->numberValue() != DEFAULT_PRIORITY)
    {
        obj = QJsonObject();
        m_priority->write(obj);
        json[JSON_PRIORITY] = obj;
    }
    if (m_targetKind != DEFAULT_TARGET_KIND)
    {
        json[JSON_TARGET_KIND] = static_cast<int>(m_actionKind);
    }
    if (m_isConditionTurn != DEFAULT_IS_CONDITION_TURN)
    {
        json[JSON_IS_CONDITION_TURN] = m_isConditionTurn;
    }
    if (m_isConditionTurn)
    {
        if (m_operationKindTurn != DEFAULT_OPERATION_KIND_TURN)
        {
            json[JSON_OPERATION_KIND_TURN] = static_cast<int>(m_operationKindTurn);
        }
        if (m_turnValueCompare->kind() != PrimitiveValueKind::Number ||
            m_turnValueCompare->numberValue() != DEFAULT_TURN_VALUE_COMPARE)
        {
            obj = QJsonObject();
            m_turnValueCompare->write(obj);
            json[JSON_TURN_VALUE_COMPARE] = obj;
        }
    }
    if (m_isConditionStatistic != DEFAULT_IS_CONDITION_STATISTIC)
    {
        json[JSON_IS_CONDITION_STATISTIC] = m_isConditionStatistic;
    }
    if (m_isConditionStatistic)
    {
        if (m_statisticID->kind() != PrimitiveValueKind::DataBase || m_statisticID
            ->numberValue() != DEFAULT_STATISTIC_ID)
        {
            obj = QJsonObject();
            m_statisticID->write(obj);
            json[JSON_STATISTIC_ID] = obj;
        }
        if (m_operationKindStatistic != DEFAULT_OPERATION_KIND_STATISTIC)
        {
            json[JSON_OPERATION_KIND_STATISTIC] = static_cast<int>(
                m_operationKindStatistic);
        }
        if (m_statisticValueCompare->kind() != PrimitiveValueKind::Number ||
            m_statisticValueCompare->numberValue() !=
            DEFAULT_STATISTIC_VALUE_COMPARE)
        {
            obj = QJsonObject();
            m_statisticValueCompare->write(obj);
            json[JSON_STATISTIC_VALUE_COMPARE] = obj;
        }
    }
    if (m_isConditionVariable != DEFAULT_IS_CONDITION_VARIABLE)
    {
        json[JSON_IS_CONDITION_VARIABLE] = m_isConditionVariable;
    }
    if (m_isConditionVariable)
    {
        if (m_variableID->id() != DEFAULT_VARIABLE_ID)
        {
            json[JSON_IS_CONDITION_VARIABLE] = m_variableID->id();
        }
        if (m_operationKindVariable != DEFAULT_OPERATION_KIND_VARIABLE)
        {
            json[JSON_OPERATION_KIND_VARIABLE] = static_cast<int>(
                m_operationKindVariable);
        }
        if (m_variableValueCompare->kind() != PrimitiveValueKind::Number ||
            m_variableValueCompare->numberValue() != DEFAULT_VARIABLE_VALUE_COMPARE)
        {
            obj = QJsonObject();
            m_variableValueCompare->write(obj);
            json[JSON_VARIABLE_VALUE_COMPARE] = obj;
        }
    }
    if (m_isConditionStatus != DEFAULT_IS_CONDITION_STATUS)
    {
        json[JSON_IS_CONDITION_STATUS] = m_isConditionStatus;
    }
    if (m_isConditionStatus)
    {
        if (m_statusID->kind() != PrimitiveValueKind::DataBase || m_statusID
            ->numberValue() != DEFAULT_STATUS_ID)
        {
            obj = QJsonObject();
            m_statusID->write(obj);
            json[JSON_STATUS_ID] = obj;
        }
    }
    if (m_isConditionScript != DEFAULT_IS_CONDITION_SCRIPT)
    {
        json[JSON_IS_CONDITION_SCRIPT] = m_isConditionScript;
    }
    if (m_isConditionScript)
    {
        if (m_script->kind() != PrimitiveValueKind::Message || m_script
            ->messageValue() != DEFAULT_SCRIPT)
        {
            obj = QJsonObject();
            m_script->write(obj);
            json[JSON_SCRIPT] = obj;
        }
    }
}
