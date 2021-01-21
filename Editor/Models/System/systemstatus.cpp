/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemstatus.h"
#include "systemstatusreleaseturn.h"
#include "systemeffect.h"
#include "systemcharacteristic.h"
#include "rpm.h"

const QString SystemStatus::JSON_ANIMATION_ID = "animationID";
const QString SystemStatus::JSON_RESTRICTION_KIND = "restrictionKind";
const QString SystemStatus::JSON_PRIORITY = "priority";
const QString SystemStatus::JSON_BATTLER_POSITION = "battlerPosition";
const QString SystemStatus::JSON_IS_RELEASE_AT_END_BATTLE = "isReleaseAtEndBattle";
const QString SystemStatus::JSON_IS_RELEASE_AFTER_ATTACKED = "isReleaseAfterAttacked";
const QString SystemStatus::JSON_CHANCE_RELEASE_AFTER_ATTACKED = "chanceReleaseAfterAttacked";
const QString SystemStatus::JSON_IS_RELEASE_START_TURN = "isReleaseStartTurn";
const QString SystemStatus::JSON_RELEASE_START_TURN = "releaseStartTurn";
const QString SystemStatus::JSON_MESSAGE_ALLY_AFFECTED = "messageAllyAffected";
const QString SystemStatus::JSON_MESSAGE_ENEMY_AFFECTED = "messageEnemyAffected";
const QString SystemStatus::JSON_MESSAGE_STATUS_HEALED = "messageStatusHealed";
const QString SystemStatus::JSON_MESSAGE_STATUS_STILL_AFFECTED = "messageStatusStillAffected";
const QString SystemStatus::JSON_EFFECTS = "effects";
const QString SystemStatus::JSON_CHARACTERISTICS = "characteristics";
const StatusRestrictionsKind SystemStatus::DEFAULT_RESTRICTION_KIND = StatusRestrictionsKind::None;
const int SystemStatus::DEFAULT_PRIORITY = 0;
const int SystemStatus::DEFAULT_BATTLER_POSITION = 0;
const bool SystemStatus::DEFAULT_IS_RELEASE_AT_END_BATTLE = false;
const bool SystemStatus::DEFAULT_IS_RELEASE_AFTER_ATTACKED = false;
const double SystemStatus::DEFAULT_CHANCE_RELEASE_AFTER_ATTACKED = 0.0;
const bool SystemStatus::DEFAULT_IS_RELEASE_START_TURN = false;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemStatus::SystemStatus() :
    SystemStatus(1, new LangsTranslation, -1)
{

}

SystemStatus::SystemStatus(int i, LangsTranslation *names, int pictureID,
    PrimitiveValue *animationID, StatusRestrictionsKind restrictionsKind,
    PrimitiveValue *priority, PrimitiveValue *battlerPosition, bool
    isReleaseAtEndBattle, bool isReleaseAfterAttacked, PrimitiveValue
    *chanceReleaseAfterAttacked, bool isReleaseStartTurn, QStandardItemModel
    *modelReleaseStartTurn, PrimitiveValue *messageAllyAffected, PrimitiveValue
    *messageEnemyAffected, PrimitiveValue *messageStatusHealed, PrimitiveValue
    *messageStatusStillAffected, QStandardItemModel *modelEffects,
    QStandardItemModel *modelCharacteristics) :
    SystemIcon(i, names, pictureID),
    m_animationID(animationID),
    m_restrictionsKind(restrictionsKind),
    m_priority(priority),
    m_battlerPosition(battlerPosition),
    m_isReleaseAtEndBattle(isReleaseAtEndBattle),
    m_isReleaseAfterAttacked(isReleaseAfterAttacked),
    m_chanceReleaseAfterAttacked(chanceReleaseAfterAttacked),
    m_isReleaseStartTurn(isReleaseStartTurn),
    m_modelReleaseStartTurn(modelReleaseStartTurn),
    m_messageAllyAffected(messageAllyAffected),
    m_messageEnemyAffected(messageEnemyAffected),
    m_messageStatusHealed(messageStatusHealed),
    m_messageStatusStillAffected(messageStatusStillAffected),
    m_modelEffects(modelEffects),
    m_modelCharacteristics(modelCharacteristics)
{
    this->initializeHeaders();
    m_animationID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->animationsDatas()->model());
}

SystemStatus::~SystemStatus()
{
    delete m_animationID;
    delete m_priority;
    delete m_battlerPosition;
    delete m_chanceReleaseAfterAttacked;
    SuperListItem::deleteModel(m_modelReleaseStartTurn);
    delete m_messageAllyAffected;
    delete m_messageEnemyAffected;
    delete m_messageStatusHealed;
    delete m_messageStatusStillAffected;
    SuperListItem::deleteModel(m_modelEffects);
    SuperListItem::deleteModel(m_modelCharacteristics);
}

PrimitiveValue * SystemStatus::animationID() const
{
    return m_animationID;
}

StatusRestrictionsKind SystemStatus::restrictionsKind() const
{
    return m_restrictionsKind;
}

void SystemStatus::setRestrictionsKind(StatusRestrictionsKind restrictionKind)
{
    m_restrictionsKind = restrictionKind;
}

PrimitiveValue * SystemStatus::priority() const
{
    return m_priority;
}

PrimitiveValue * SystemStatus::battlerPosition() const
{
    return m_battlerPosition;
}

bool SystemStatus::isReleaseAtEndBattle() const
{
    return m_isReleaseAtEndBattle;
}

void SystemStatus::setIsReleaseAtEndBattle(bool isReleaseAtEndBattle)
{
    m_isReleaseAtEndBattle = isReleaseAtEndBattle;
}

bool SystemStatus::isReleaseAfterAttacked() const
{
    return m_isReleaseAfterAttacked;
}

void SystemStatus::setIsReleaseAfterAttacked(bool isReleaseAfterAttacked)
{
    m_isReleaseAfterAttacked = isReleaseAfterAttacked;
}

PrimitiveValue * SystemStatus::chanceReleaseAfterAttacked() const
{
    return m_chanceReleaseAfterAttacked;
}

bool SystemStatus::isReleaseStartTurn() const
{
    return m_isReleaseStartTurn;
}

void SystemStatus::setIsReleaseStartTurn(bool isReleaseStartTurn)
{
    m_isReleaseStartTurn = isReleaseStartTurn;
}

QStandardItemModel * SystemStatus::modelReleaseStartTurn() const
{
    return m_modelReleaseStartTurn;
}

PrimitiveValue * SystemStatus::messageAllyAffected() const
{
    return m_messageAllyAffected;
}

PrimitiveValue * SystemStatus::messageEnemyAffected() const
{
    return m_messageEnemyAffected;
}

PrimitiveValue * SystemStatus::messageStatusHealed() const
{
    return m_messageStatusHealed;
}

PrimitiveValue * SystemStatus::messageStatusStillAffected() const
{
    return m_messageStatusStillAffected;
}

QStandardItemModel * SystemStatus::modelEffects() const
{
    return m_modelEffects;
}

QStandardItemModel * SystemStatus::modelCharacteristics() const
{
    return m_modelCharacteristics;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemStatus::clearReleaseStartTurn()
{
    SuperListItem::deleteModel(m_modelReleaseStartTurn, false);
}

// -------------------------------------------------------

void SystemStatus::clearEffects()
{
    SuperListItem::deleteModel(m_modelEffects, false);
}

// -------------------------------------------------------

void SystemStatus::clearCharacteristics()
{
    SuperListItem::deleteModel(m_modelCharacteristics, false);
}

// -------------------------------------------------------

void SystemStatus::initializeHeaders()
{
    m_modelReleaseStartTurn->setHorizontalHeaderLabels(QStringList({"Turn", "% chance"}));
    m_modelEffects->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::EFFECTS)}));
    m_modelCharacteristics->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::CHARACTERISTICS)}));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemStatus::setDefault()
{

}

// -------------------------------------------------------

SuperListItem * SystemStatus::createCopy() const
{
    SystemStatus *super = new SystemStatus;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemStatus::setCopy(const SuperListItem &super)
{
    SystemIcon::setCopy(super);

    const SystemStatus *status = reinterpret_cast<const SystemStatus *>(&super);
    m_animationID->setCopy(*status->m_animationID);
    m_restrictionsKind = status->m_restrictionsKind;
    m_priority->setCopy(*status->m_priority);
    m_battlerPosition->setCopy(*status->m_battlerPosition);
    m_isReleaseAtEndBattle = status->m_isReleaseAtEndBattle;
    m_isReleaseAfterAttacked = status->m_isReleaseAfterAttacked;
    m_chanceReleaseAfterAttacked->setCopy(*status->m_chanceReleaseAfterAttacked);
    m_isReleaseStartTurn = status->m_isReleaseStartTurn;
    this->clearReleaseStartTurn();
    SuperListItem::copy(m_modelReleaseStartTurn, status->m_modelReleaseStartTurn);
    m_messageAllyAffected->setCopy(*status->m_messageAllyAffected);
    m_messageEnemyAffected->setCopy(*status->m_messageEnemyAffected);
    m_messageStatusHealed->setCopy(*status->m_messageStatusHealed);
    m_messageStatusStillAffected->setCopy(*status->m_messageStatusStillAffected);
    this->clearEffects();
    SuperListItem::copy(m_modelEffects, status->m_modelEffects);
    this->clearCharacteristics();
    SuperListItem::copy(m_modelCharacteristics, status->m_modelCharacteristics);
    this->initializeHeaders();
}

// -------------------------------------------------------

void SystemStatus::read(const QJsonObject &json) {
    SystemIcon::read(json);

    // Clear model
    this->clearReleaseStartTurn();
    this->clearEffects();
    this->clearCharacteristics();
    this->initializeHeaders();

    if (json.contains(JSON_ANIMATION_ID))
    {
        m_animationID->read(json[JSON_ANIMATION_ID].toObject());
    }
    if (json.contains(JSON_RESTRICTION_KIND))
    {
        m_restrictionsKind = static_cast<StatusRestrictionsKind>(json[
            JSON_RESTRICTION_KIND].toInt());
    }
    if (json.contains(JSON_PRIORITY))
    {
        m_priority->read(json[JSON_PRIORITY].toObject());
    }
    if (json.contains(JSON_BATTLER_POSITION))
    {
        m_battlerPosition->read(json[JSON_BATTLER_POSITION].toObject());
    }
    if (json.contains(JSON_IS_RELEASE_AT_END_BATTLE))
    {
        m_isReleaseAtEndBattle = json[JSON_IS_RELEASE_AT_END_BATTLE].toBool();
    }
    if (json.contains(JSON_IS_RELEASE_AFTER_ATTACKED))
    {
        m_isReleaseAfterAttacked = json[JSON_IS_RELEASE_AFTER_ATTACKED].toBool();
    }
    if (json.contains(JSON_CHANCE_RELEASE_AFTER_ATTACKED))
    {
        m_chanceReleaseAfterAttacked->read(json[
            JSON_CHANCE_RELEASE_AFTER_ATTACKED].toObject());
    }
    if (json.contains(JSON_IS_RELEASE_START_TURN))
    {
        m_isReleaseStartTurn = json[JSON_IS_RELEASE_START_TURN].toBool();
    }
    SuperListItem::readTree(m_modelReleaseStartTurn, new SystemStatus, json,
        JSON_RELEASE_START_TURN);
    if (json.contains(JSON_MESSAGE_ALLY_AFFECTED))
    {
        m_messageAllyAffected->read(json[JSON_MESSAGE_ALLY_AFFECTED].toObject());
    }
    if (json.contains(JSON_MESSAGE_ENEMY_AFFECTED))
    {
        m_messageEnemyAffected->read(json[JSON_MESSAGE_ENEMY_AFFECTED].toObject());
    }
    if (json.contains(JSON_MESSAGE_STATUS_HEALED))
    {
        m_messageStatusHealed->read(json[JSON_MESSAGE_STATUS_HEALED].toObject());
    }
    if (json.contains(JSON_MESSAGE_STATUS_STILL_AFFECTED))
    {
        m_messageStatusStillAffected->read(json[
            JSON_MESSAGE_STATUS_STILL_AFFECTED].toObject());
    }
    SuperListItem::readTree(m_modelEffects, new SystemEffect, json, JSON_EFFECTS);
    SuperListItem::readTree(m_modelCharacteristics, new SystemCharacteristic,
        json, JSON_CHARACTERISTICS);
}

// -------------------------------------------------------

void SystemStatus::write(QJsonObject &json) const {
    SystemIcon::write(json);

    QJsonObject obj;
    if (m_animationID->kind() != PrimitiveValueKind::None)
    {
        obj = QJsonObject();
        m_animationID->write(obj);
        json[JSON_ANIMATION_ID] = obj;
    }
    if (m_restrictionsKind != DEFAULT_RESTRICTION_KIND)
    {
        json[JSON_RESTRICTION_KIND] = static_cast<int>(m_restrictionsKind);
    }
    if (!m_priority->isDefaultNumberValue())
    {
        obj = QJsonObject();
        m_priority->write(obj);
        json[JSON_PRIORITY] = obj;
    }
    if (!m_battlerPosition->isDefaultNumberValue())
    {
        obj = QJsonObject();
        m_battlerPosition->write(obj);
        json[JSON_BATTLER_POSITION] = obj;
    }
    if (m_isReleaseAtEndBattle != DEFAULT_IS_RELEASE_AT_END_BATTLE)
    {
        json[JSON_IS_RELEASE_AT_END_BATTLE] = m_isReleaseAtEndBattle;
    }
    if (m_isReleaseAfterAttacked != DEFAULT_IS_RELEASE_AFTER_ATTACKED)
    {
        json[JSON_IS_RELEASE_AFTER_ATTACKED] = m_isReleaseAfterAttacked;
    }
    if (m_chanceReleaseAfterAttacked->kind() != PrimitiveValueKind::NumberDouble ||
        m_chanceReleaseAfterAttacked->numberDoubleValue() !=
        DEFAULT_CHANCE_RELEASE_AFTER_ATTACKED)
    {
        obj = QJsonObject();
        m_chanceReleaseAfterAttacked->write(obj);
        json[JSON_CHANCE_RELEASE_AFTER_ATTACKED] = obj;
    }
    if (m_isReleaseStartTurn != DEFAULT_IS_RELEASE_START_TURN)
    {
        json[JSON_IS_RELEASE_START_TURN] = m_isReleaseStartTurn;
    }
    SuperListItem::writeTree(m_modelReleaseStartTurn, json, JSON_RELEASE_START_TURN);
    if (!m_messageAllyAffected->isDefaultMessageValue())
    {
        obj = QJsonObject();
        m_messageAllyAffected->write(obj);
        json[JSON_MESSAGE_ALLY_AFFECTED] = obj;
    }
    if (!m_messageEnemyAffected->isDefaultMessageValue())
    {
        obj = QJsonObject();
        m_messageEnemyAffected->write(obj);
        json[JSON_MESSAGE_ENEMY_AFFECTED] = obj;
    }
    if (!m_messageStatusHealed->isDefaultMessageValue())
    {
        obj = QJsonObject();
        m_messageStatusHealed->write(obj);
        json[JSON_MESSAGE_STATUS_HEALED] = obj;
    }
    if (!m_messageStatusStillAffected->isDefaultMessageValue())
    {
        obj = QJsonObject();
        m_messageStatusStillAffected->write(obj);
        json[JSON_MESSAGE_STATUS_STILL_AFFECTED] = obj;
    }
    SuperListItem::writeTree(m_modelEffects, json, JSON_EFFECTS);
    SuperListItem::writeTree(m_modelCharacteristics, json, JSON_CHARACTERISTICS);
}
