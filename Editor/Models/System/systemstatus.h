/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSTATUS_H
#define SYSTEMSTATUS_H

#include <QMetaType>
#include "systemicon.h"
#include "primitivevalue.h"
#include "statusrestrictionskind.h"

// -------------------------------------------------------
//
//  CLASS SystemStatus
//
//  A particulary status (datas).
//
// -------------------------------------------------------

class SystemStatus : public SystemIcon
{
public:
    static const QString JSON_ANIMATION_ID;
    static const QString JSON_RESTRICTION_KIND;
    static const QString JSON_PRIORITY;
    static const QString JSON_BATTLER_POSITION;
    static const QString JSON_IS_RELEASE_AT_END_BATTLE;
    static const QString JSON_IS_RELEASE_AFTER_ATTACKED;
    static const QString JSON_CHANCE_RELEASE_AFTER_ATTACKED;
    static const QString JSON_IS_RELEASE_START_TURN;
    static const QString JSON_RELEASE_START_TURN;
    static const QString JSON_MESSAGE_ALLY_AFFECTED;
    static const QString JSON_MESSAGE_ENEMY_AFFECTED;
    static const QString JSON_MESSAGE_STATUS_HEALED;
    static const QString JSON_MESSAGE_STATUS_STILL_AFFECTED;
    static const QString JSON_EFFECTS;
    static const QString JSON_CHARACTERISTICS;
    static const StatusRestrictionsKind DEFAULT_RESTRICTION_KIND;
    static const int DEFAULT_PRIORITY;
    static const int DEFAULT_BATTLER_POSITION;
    static const bool DEFAULT_IS_RELEASE_AT_END_BATTLE;
    static const bool DEFAULT_IS_RELEASE_AFTER_ATTACKED;
    static const double DEFAULT_CHANCE_RELEASE_AFTER_ATTACKED;
    static const bool DEFAULT_IS_RELEASE_START_TURN;

    SystemStatus();
    SystemStatus(int i, QString name, int pictureID, PrimitiveValue
        *animationID = new PrimitiveValue(PrimitiveValueKind::None),
        StatusRestrictionsKind restrictionsKind = DEFAULT_RESTRICTION_KIND,
        PrimitiveValue *priority = new PrimitiveValue(DEFAULT_PRIORITY),
        PrimitiveValue *battlerPosition = new PrimitiveValue(
        DEFAULT_BATTLER_POSITION), bool isReleaseAtEndBattle =
        DEFAULT_IS_RELEASE_AT_END_BATTLE, bool isReleaseAfterAttacked =
        DEFAULT_IS_RELEASE_AFTER_ATTACKED, PrimitiveValue
        *chanceReleaseAfterAttacked = new PrimitiveValue(
        DEFAULT_CHANCE_RELEASE_AFTER_ATTACKED), bool isReleaseStartTurn =
        DEFAULT_IS_RELEASE_START_TURN, QStandardItemModel *modelReleaseStartTurn =
        new QStandardItemModel, PrimitiveValue *messageAllyAffected = new
        PrimitiveValue(QString()), PrimitiveValue *messageEnemyAffected = new
        PrimitiveValue(QString()), PrimitiveValue *messageStatusHealed = new
        PrimitiveValue(QString()), PrimitiveValue *messageStatusStillAffected =
        new PrimitiveValue(QString()), QStandardItemModel *modelEffects = new
        QStandardItemModel, QStandardItemModel *modelCharacteristics = new
        QStandardItemModel);
    virtual ~SystemStatus();
    PrimitiveValue * animationID() const;
    StatusRestrictionsKind restrictionsKind() const;
    void setRestrictionsKind(StatusRestrictionsKind restrictionKind);
    PrimitiveValue * priority() const;
    PrimitiveValue * battlerPosition() const;
    bool isReleaseAtEndBattle() const;
    void setIsReleaseAtEndBattle(bool isReleaseAtEndBattle);
    bool isReleaseAfterAttacked() const;
    void setIsReleaseAfterAttacked(bool isReleaseAfterAttacked);
    PrimitiveValue * chanceReleaseAfterAttacked() const;
    bool isReleaseStartTurn() const;
    void setIsReleaseStartTurn(bool isReleaseStartTurn);
    QStandardItemModel * modelReleaseStartTurn() const;
    PrimitiveValue * messageAllyAffected() const;
    PrimitiveValue * messageEnemyAffected() const;
    PrimitiveValue * messageStatusHealed() const;
    PrimitiveValue * messageStatusStillAffected() const;
    QStandardItemModel * modelEffects() const;
    QStandardItemModel * modelCharacteristics() const;

    void clearReleaseStartTurn();
    void clearEffects();
    void clearCharacteristics();
    void initializeHeaders();

    virtual void setDefault();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_animationID;
    StatusRestrictionsKind m_restrictionsKind;
    PrimitiveValue *m_priority;
    PrimitiveValue *m_battlerPosition;
    bool m_isReleaseAtEndBattle;
    bool m_isReleaseAfterAttacked;
    PrimitiveValue *m_chanceReleaseAfterAttacked;
    bool m_isReleaseStartTurn;
    QStandardItemModel *m_modelReleaseStartTurn;
    PrimitiveValue *m_messageAllyAffected;
    PrimitiveValue *m_messageEnemyAffected;
    PrimitiveValue *m_messageStatusHealed;
    PrimitiveValue *m_messageStatusStillAffected;
    QStandardItemModel *m_modelEffects;
    QStandardItemModel *m_modelCharacteristics;
};

Q_DECLARE_METATYPE(SystemStatus)

#endif // SYSTEMSTATUS_H
