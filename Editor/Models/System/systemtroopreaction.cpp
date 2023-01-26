/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemtroopreaction.h"
#include "dialogsystemname.h"

const QString SystemTroopReaction::JSON_CONDITIONS = "conditions";
const QString SystemTroopReaction::JSON_FREQUENCY = "frequency";
const TroopReactionFrequencyKind SystemTroopReaction::DEFAULT_FREQUENCY =
    TroopReactionFrequencyKind::OneTime;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemTroopReaction::SystemTroopReaction() :
    SystemTroopReaction(1, "")
{

}

SystemTroopReaction::SystemTroopReaction(int i, QString n,
    SystemTroopReactionConditions *conditions, TroopReactionFrequencyKind
    frequency) :
    SystemReaction(i, n),
    m_conditions(conditions),
    m_frequency(frequency)
{

}

SystemTroopReaction::~SystemTroopReaction()
{
    delete m_conditions;
}

SystemTroopReactionConditions * SystemTroopReaction::conditions() const
{
    return m_conditions;
}

TroopReactionFrequencyKind SystemTroopReaction::frequency() const
{
    return m_frequency;
}

void SystemTroopReaction::setFrequency(TroopReactionFrequencyKind frequency)
{
    m_frequency = frequency;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemTroopReaction::openDialog()
{
    SystemTroopReaction reaction;
    reaction.setCopy(*this);
    DialogSystemName dialog(reaction);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(reaction);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemTroopReaction::createCopy() const
{
    SystemTroopReaction *super = new SystemTroopReaction;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemTroopReaction::setCopy(const SuperListItem &super)
{
    const SystemTroopReaction *troopReaction;
    troopReaction = reinterpret_cast<const SystemTroopReaction *>(&super);
    SystemReaction::setCopy(*troopReaction);
    m_conditions->setCopy(*troopReaction->m_conditions);
    m_frequency = troopReaction->m_frequency;
}

// -------------------------------------------------------

void SystemTroopReaction::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    SystemReaction::read(json);
    if (json.contains(JSON_CONDITIONS))
    {
        m_conditions->read(json[JSON_CONDITIONS].toObject());
    }
    if (json.contains(JSON_FREQUENCY))
    {
        m_frequency = static_cast<TroopReactionFrequencyKind>(json[
            JSON_FREQUENCY].toInt());
    }
}

// -------------------------------------------------------

void SystemTroopReaction::write(QJsonObject &json) const {
    SuperListItem::write(json);
    SystemReaction::write(json);
    QJsonObject obj;
    m_conditions->write(obj);
    json[JSON_CONDITIONS] = obj;
    if (m_frequency != DEFAULT_FREQUENCY) {
        json[JSON_FREQUENCY] = static_cast<int>(m_frequency);
    }
}
