/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemstatusreleaseturn.h"
#include "dialogsystemstatusreleaseturn.h"
#include "rpm.h"

const QString SystemStatusReleaseTurn::JSON_OPERATION_TURN_KIND = "operationTurnKind";
const QString SystemStatusReleaseTurn::JSON_TURN = "turn";
const QString SystemStatusReleaseTurn::JSON_CHANCE = "chance";
const OperationKind SystemStatusReleaseTurn::DEFAULT_OPERATION_TURN_KIND = OperationKind::GreaterThanOrEqualTo;
const int SystemStatusReleaseTurn::DEFAULT_TURN = 1;
const double SystemStatusReleaseTurn::DEFAULT_CHANCE = 0.0;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemStatusReleaseTurn::SystemStatusReleaseTurn() :
    SystemStatusReleaseTurn(-1, "")
{

}

SystemStatusReleaseTurn::SystemStatusReleaseTurn(int i, QString name,
    OperationKind operationTurnKind, PrimitiveValue *turn, PrimitiveValue *chance) :
    SuperListItem(i, name),
    m_operationTurnKind(operationTurnKind),
    m_turn(turn),
    m_chance(chance)
{

}

SystemStatusReleaseTurn::~SystemStatusReleaseTurn()
{
    delete m_turn;
    delete m_chance;
}

OperationKind SystemStatusReleaseTurn::operationTurnKind() const
{
    return m_operationTurnKind;
}

void SystemStatusReleaseTurn::setOperationTurnKind(OperationKind operationTurnKind)
{
    m_operationTurnKind = operationTurnKind;
}

PrimitiveValue * SystemStatusReleaseTurn::turn() const
{
    return m_turn;
}

PrimitiveValue * SystemStatusReleaseTurn::chance() const
{
    return m_chance;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemStatusReleaseTurn::setDefault()
{

}

// -------------------------------------------------------

bool SystemStatusReleaseTurn::openDialog()
{
    SystemStatusReleaseTurn statusReleaseTurn;
    statusReleaseTurn.setCopy(*this);
    DialogSystemStatusReleaseTurn dialog(statusReleaseTurn);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(statusReleaseTurn);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemStatusReleaseTurn::createCopy() const
{
    SystemStatusReleaseTurn *super = new SystemStatusReleaseTurn;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemStatusReleaseTurn::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);

    const SystemStatusReleaseTurn *statusReleaseTurn = reinterpret_cast<const
        SystemStatusReleaseTurn *>(&super);
    m_operationTurnKind = statusReleaseTurn->m_operationTurnKind;
    m_turn->setCopy(*statusReleaseTurn->m_turn);
    m_chance->setCopy(*statusReleaseTurn->m_chance);
}

// -------------------------------------------------------

QList<QStandardItem*> SystemStatusReleaseTurn::getModelRow() const
{
    QList<QStandardItem *> row = QList<QStandardItem*>();
    QStandardItem *itemTurn = new QStandardItem;
    itemTurn->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemTurn->setFlags(itemTurn->flags() ^ (Qt::ItemIsDropEnabled));
    itemTurn->setText(SuperListItem::beginningText + RPM
        ::ENUM_TO_STRING_OPERATION_SIMPLE.at(static_cast<int>(m_operationTurnKind))
        + RPM:: SPACE + m_turn->toString());
    row.append(itemTurn);
    QStandardItem *itemChance = new QStandardItem;
    itemChance->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemChance->setFlags(itemChance->flags() ^ (Qt::ItemIsDropEnabled));
    itemChance->setText(m_chance->toString());
    row.append(itemChance);
    return row;
}

// -------------------------------------------------------

void SystemStatusReleaseTurn::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_OPERATION_TURN_KIND))
    {
        m_operationTurnKind = static_cast<OperationKind>(json[
            JSON_OPERATION_TURN_KIND].toInt());
    }
    if (json.contains(JSON_TURN))
    {
        m_turn->read(json[JSON_TURN].toObject());
    }
    if (json.contains(JSON_CHANCE))
    {
        m_chance->read(json[JSON_CHANCE].toObject());
    }
}

// -------------------------------------------------------

void SystemStatusReleaseTurn::write(QJsonObject &json) const {
    SuperListItem::write(json);

    QJsonObject obj;
    if (m_operationTurnKind != DEFAULT_OPERATION_TURN_KIND)
    {
        json[JSON_OPERATION_TURN_KIND] = static_cast<int>(m_operationTurnKind);
    }
    if (m_turn->kind() != PrimitiveValueKind::Number || m_turn->numberValue() !=
        DEFAULT_TURN)
    {
        obj = QJsonObject();
        m_turn->write(obj);
        json[JSON_TURN] = obj;
    }
    if (!m_chance->isDefaultNumberDoubleValue())
    {
        obj = QJsonObject();
        m_chance->write(obj);
        json[JSON_CHANCE] = obj;
    }
}
