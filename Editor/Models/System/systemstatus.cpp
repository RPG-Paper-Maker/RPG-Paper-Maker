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
const QString SystemStatus::JSON_IS_RELEASE_AT_END_BATTLE = "isReleaseAtEndBattle";
const QString SystemStatus::JSON_IS_RELEASE_AFTER_ATTACKED = "isReleaseAfterAttacked";
const QString SystemStatus::JSON_CHANCE_RELEASE_AFTER_ATTACKED = "chanceReleaseAfterAttacked";
const QString SystemStatus::JSON_IS_RELEASE_AFTER_TURN = "isReleaseAfterTurn";
const QString SystemStatus::JSON_RELEASE_AFTER_TURN = "releaseAfterTurn";
const QString SystemStatus::JSON_MESSAGE_ALLY_AFFECTED = "messageAllyAffected";
const QString SystemStatus::JSON_MESSAGE_ENEMY_AFFECTED = "messageEnemyAffected";
const QString SystemStatus::JSON_MESSAGE_STATUS_HEALED = "messageStatusHealed";
const QString SystemStatus::JSON_MESSAGE_STATUS_STILL_AFFECTED = "messageStatusStillAffected";
const QString SystemStatus::JSON_EFFECTS = "effects";
const QString SystemStatus::JSON_CHARACTERISTICS = "characteristics";
const StatusRestrictionsKind SystemStatus::DEFAULT_RESTRICTION_KIND = StatusRestrictionsKind::None;
const bool SystemStatus::DEFAULT_IS_RELEASE_AT_END_BATTLE = true;
const bool SystemStatus::DEFAULT_IS_RELEASE_AFTER_ATTACKED = false;
const double SystemStatus::DEFAULT_CHANCE_RELEASE_AFTER_ATTACKED = 0.0;
const bool SystemStatus::DEFAULT_IS_RELEASE_AFTER_TURN = false;

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
    PrimitiveValue *animationID, StatusRestrictionsKind restrictionsKind, bool
    isReleaseAtEndBattle, bool isReleaseAfterAttacked, PrimitiveValue
    *chanceReleaseAfterAttacked, bool isReleaseAfterTurn, QStandardItemModel
    *modelReleaseAfterTurn, PrimitiveValue *messageAllyAffected, PrimitiveValue
    *messageEnemyAffected, PrimitiveValue *messageStatusHealed, PrimitiveValue
    *messageStatusStillAffected, QStandardItemModel *modelEffects,
    QStandardItemModel *modelCharacteristics) :
    SystemIcon(i, names, pictureID),
    m_animationID(animationID),
    m_restrictionsKind(restrictionsKind),
    m_isReleaseAtEndBattle(isReleaseAtEndBattle),
    m_isReleaseAfterAttacked(isReleaseAfterAttacked),
    m_chanceReleaseAfterAttacked(chanceReleaseAfterAttacked),
    m_isReleaseAfterTurn(isReleaseAfterTurn),
    m_modelReleaseAfterTurn(modelReleaseAfterTurn),
    m_messageAllyAffected(messageAllyAffected),
    m_messageEnemyAffected(messageEnemyAffected),
    m_messageStatusHealed(messageStatusHealed),
    m_messageStatusStillAffected(messageStatusStillAffected),
    m_modelEffects(modelEffects),
    m_modelCharacteristics(modelCharacteristics)
{
    this->initializeHeaders();
}

SystemStatus::~SystemStatus()
{
    delete m_animationID;
    delete m_chanceReleaseAfterAttacked;
    SuperListItem::deleteModel(m_modelReleaseAfterTurn);
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

bool SystemStatus::isReleaseAfterTurn() const
{
    return m_isReleaseAfterTurn;
}

void SystemStatus::setIsReleaseAfterTurn(bool isReleaseAfterTurn)
{
    m_isReleaseAfterTurn = isReleaseAfterTurn;
}

QStandardItemModel * SystemStatus::modelReleaseAfterTurn() const
{
    return m_modelReleaseAfterTurn;
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

void SystemStatus::clearReleaseAfterTurn()
{
    SuperListItem::deleteModel(m_modelReleaseAfterTurn, false);
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
    m_modelReleaseAfterTurn->setHorizontalHeaderLabels(QStringList({"Turn", "% chance"}));
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
    m_isReleaseAtEndBattle = status->m_isReleaseAtEndBattle;
    m_isReleaseAfterAttacked = status->m_isReleaseAfterAttacked;
    m_chanceReleaseAfterAttacked->setCopy(*status->m_chanceReleaseAfterAttacked);
    m_isReleaseAfterTurn = status->m_isReleaseAfterTurn;
    this->clearReleaseAfterTurn();
    SuperListItem::copy(m_modelReleaseAfterTurn, status->m_modelReleaseAfterTurn);
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
    this->clearReleaseAfterTurn();
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
    if (json.contains(JSON_IS_RELEASE_AFTER_TURN))
    {
        m_isReleaseAfterTurn = json[JSON_IS_RELEASE_AFTER_TURN].toBool();
    }
    SuperListItem::readTree(m_modelReleaseAfterTurn, new SystemStatus, json,
        JSON_RELEASE_AFTER_TURN);
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
    m_animationID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->animationsDatas()->model());
    if (m_restrictionsKind != DEFAULT_RESTRICTION_KIND)
    {
        json[JSON_RESTRICTION_KIND] = static_cast<int>(m_restrictionsKind);
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
    if (m_isReleaseAfterTurn != DEFAULT_IS_RELEASE_AFTER_TURN)
    {
        json[JSON_IS_RELEASE_AFTER_TURN] = m_isReleaseAfterTurn;
    }
    SuperListItem::writeTree(m_modelReleaseAfterTurn, json, JSON_RELEASE_AFTER_TURN);
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
