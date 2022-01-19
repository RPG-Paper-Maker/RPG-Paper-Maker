/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcost.h"
#include "rpm.h"
#include "common.h"
#include "dialogsystemcost.h"

const QString SystemCost::JSON_KIND = "k";
const QString SystemCost::JSON_STATISTIC_ID = "sid";
const QString SystemCost::JSON_CURRENCY_ID = "cid";
const QString SystemCost::JSON_VARIABLE_ID = "vid";
const QString SystemCost::JSON_VALUE_FORMULA = "vf";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCost::SystemCost(DamagesKind kind, PrimitiveValue *statisticID,
    PrimitiveValue *currencyID, int variableID, PrimitiveValue *valueFormula) :
    SuperListItem(-1, "", true),
    m_kind(new SuperListItem(static_cast<int>(kind))),
    m_statisticID(statisticID),
    m_currencyID(currencyID),
    m_variableID(new SuperListItem(variableID)),
    m_valueFormula(valueFormula)
{
    m_statisticID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonStatistics());
    m_currencyID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelCurrencies());
}

SystemCost::~SystemCost() {
    delete m_kind;
    delete m_statisticID;
    delete m_currencyID;
    delete m_variableID;
    delete m_valueFormula;
}

SuperListItem * SystemCost::kind() const {
    return m_kind;
}

PrimitiveValue * SystemCost::statisticID() const {
    return m_statisticID;
}

PrimitiveValue * SystemCost::currencyID() const {
    return m_currencyID;
}

SuperListItem * SystemCost::variableID() const {
    return m_variableID;
}

PrimitiveValue * SystemCost::valueFormula() const {
    return  m_valueFormula;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemCost::toStringPrice(QStandardItemModel *model)
{
    QStringList list;
    SystemCost *cost;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        cost = reinterpret_cast<SystemCost *>(SuperListItem::getItemModelAt(model, i));
        if (cost != nullptr)
        {
            list << cost->toString();
        }
    }
    return list.join(" + ");
}

// -------------------------------------------------------

SystemCost * SystemCost::createStat(int stat, int nb) {
    return new SystemCost(DamagesKind::Stat, new PrimitiveValue(
        PrimitiveValueKind::DataBase, stat), PrimitiveValue
        ::createDefaultDataBaseValue(), 1, new PrimitiveValue(QString::number(
        nb)));
}

// -------------------------------------------------------

SystemCost * SystemCost::createMP(int nb) {
    return SystemCost::createStat(4, nb);
}

// -------------------------------------------------------

SystemCost * SystemCost::createTP(int nb) {
    return SystemCost::createStat(5, nb);
}

// -------------------------------------------------------

void SystemCost::initialize(const EventCommand *command, int &i)
{
    m_kind->setId(command->valueCommandAt(i++).toInt());
    switch (m_kind->id()) {
    case 0:
        m_statisticID->initializeCommandParameter(command, i);
        break;
    case 1:
        m_currencyID->initializeCommandParameter(command, i);
        break;
    case 2:
        m_variableID->setId(command->valueCommandAt(i++).toInt());
        break;
    }
    m_valueFormula->initializeCommandParameter(command, i);
}

// -------------------------------------------------------

void SystemCost::getCommand(QVector<QString> &command)
{
    int index = m_kind->id();
    command.append(QString::number(index));
    switch (index) {
    case 0:
        m_statisticID->getCommandParameter(command);
        break;
    case 1:
        m_currencyID->getCommandParameter(command);
        break;
    case 2:
        command.append(QString::number(m_variableID->id()));
        break;
    }
    m_valueFormula->getCommandParameter(command);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemCost::openDialog() {
    SystemCost cost;
    cost.setCopy(*this);
    DialogSystemCost dialog(cost);
    if (dialog.exec() == QDialog::Accepted) {
        setCopy(cost);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem* SystemCost::createCopy() const {
    SystemCost* super = new SystemCost;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCost::setCopy(const SuperListItem &super) {
    const SystemCost *cost;

    SuperListItem::setCopy(super);

    cost = reinterpret_cast<const SystemCost *>(&super);
    m_kind->setId(cost->m_kind->id());
    m_statisticID->setCopy(*cost->m_statisticID);
    m_currencyID->setCopy(*cost->m_currencyID);
    m_variableID->setId(cost->m_variableID->id());
    m_valueFormula->setCopy(*cost->m_valueFormula);
}

// -------------------------------------------------------

QString SystemCost::toString() const {
    QString text;
    switch (static_cast<DamagesKind>(m_kind->id())) {
    case DamagesKind::Stat:
        text += m_statisticID->toString();
        break;
    case DamagesKind::Currency:
        text += m_currencyID->toString();
        break;
    case DamagesKind::Variable:
        text += SuperListItem::beginningText + QString::number(m_variableID->id());
        break;
    }
    return text + ": " + m_valueFormula->toString();
}

// -------------------------------------------------------

void SystemCost::read(const QJsonObject &json) {
    if (json.contains(JSON_KIND)) {
        m_kind->setId(json[JSON_KIND].toInt());
    }
    switch (static_cast<DamagesKind>(m_kind->id())) {
    case DamagesKind::Stat:
        if (json.contains(JSON_STATISTIC_ID)) {
            m_statisticID->read(json[JSON_STATISTIC_ID].toObject());
        }
        break;
    case DamagesKind::Currency:
        if (json.contains(JSON_CURRENCY_ID)) {
            m_currencyID->read(json[JSON_CURRENCY_ID].toObject());
        }
        break;
    case DamagesKind::Variable:
        if (json.contains(JSON_VARIABLE_ID)) {
            m_variableID->setId(json[JSON_VARIABLE_ID].toInt());
        }
        break;
    }
    if (json.contains(JSON_VALUE_FORMULA)) {
        m_valueFormula->read(json[JSON_VALUE_FORMULA].toObject());
    }
}

// -------------------------------------------------------

void SystemCost::write(QJsonObject &json) const {
    QJsonObject obj;

    if (m_kind->id() != 0) {
        json[JSON_KIND] = m_kind->id();
    }
    switch (static_cast<DamagesKind>(m_kind->id())) {
    case DamagesKind::Stat:
        if (m_statisticID->kind() != PrimitiveValueKind::DataBase ||
            m_statisticID->numberValue() != 1)
        {
            obj = QJsonObject();
            m_statisticID->write(obj);
            json[JSON_STATISTIC_ID] = obj;
        }
        break;
    case DamagesKind::Currency:
        if (m_currencyID->kind() != PrimitiveValueKind::DataBase ||
            m_currencyID->numberValue() != 1)
        {
            obj = QJsonObject();
            m_currencyID->write(obj);
            json[JSON_CURRENCY_ID] = obj;
        }
        break;
    case DamagesKind::Variable:
        if (m_variableID->id() != 1) {
            json[JSON_VARIABLE_ID] = m_variableID->id();
        }
        break;
    }
    if (m_valueFormula->kind() != PrimitiveValueKind::Message ||
        !m_valueFormula->messageValue().isEmpty())
    {
        obj = QJsonObject();
        m_valueFormula->write(obj);
        json[JSON_VALUE_FORMULA] = obj;
    }
}
