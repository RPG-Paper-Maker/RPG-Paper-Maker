/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef EVENTCOMMAND_H
#define EVENTCOMMAND_H

#include <QMetaType>
#include <QString>
#include <QList>
#include <QJsonObject>
#include <QJsonArray>
#include <QStandardItemModel>
#include "eventcommandkind.h"
#include "systemcommonobject.h"
#include "songkind.h"

// -------------------------------------------------------
//
//  CLASS EventCommand
//
//  A game command (instruction).
//
// -------------------------------------------------------

class EventCommand
{
public:
    static const QString JSON_KIND;
    static const QString JSON_COMMANDS;
    static const QString BEGINNING_COMMAND;
    static const QString COLOR_ORANGE;
    static const QString COLOR_BLUE;
    static const QString COLOR_GREEN;
    static const QString COLOR_YELLOW;
    static const QString COLOR_GREY;
    static const QString COLOR_COMMENT;
    static QVector<QString> emptyCommandList;

    EventCommand();
    EventCommand(EventCommandKind k, QVector<QString> &l = emptyCommandList);
    virtual ~EventCommand();

    EventCommandKind kind() const;
    void setKind(EventCommandKind k);
    int commandsCount() const;
    QString valueCommandAt(int index) const;
    QVector<QString> commands();
    void setCommands(QVector<QString> &commands);

    static QString kindToString(EventCommandKind kind);
    static bool eventCommandKindLessThan(const EventCommandKind &v1, const
        EventCommandKind &v2);

    bool hasElse() const;
    bool isBattleWithoutGameOver() const;
    bool isEditable() const;
    bool isErasable() const;
    int getSongID(QStandardItemModel *parameters) const;
    int getChoicesNumber() const;
    void getChoicesIDs(QList<int> &list);
    void setCopy(const EventCommand &copy);
    QString toString(QStandardItemModel *properties = nullptr, QStandardItemModel
        *parameters = nullptr, QStandardItemModel *troopMonstersList = nullptr,
        bool style = true) const;
    void read(const QJsonObject &json);
    QJsonObject getJSON() const;

private:
    EventCommandKind m_kind;
    QVector<QString> m_listCommand;

    QString strTroopMonstersList(QStandardItemModel *model, int &i) const;
    QString strNumberVariable(int &i) const;
    QString strDataBaseId(int &i, QStandardItemModel *properties = nullptr,
        QStandardItemModel *dataBase = nullptr, QStandardItemModel *parameters =
        nullptr) const;
    QString strProperty(int &i, QStandardItemModel *properties = nullptr,
        QStandardItemModel *parameters = nullptr, bool active = false) const;
    QString strNumber(int &i, QStandardItemModel *parameters = nullptr) const;
    QString strShowText(QStandardItemModel *properties = nullptr, QStandardItemModel
        *parameters = nullptr) const;
    QString strChangeVariables(QStandardItemModel *properties, QStandardItemModel
        *parameters, QStandardItemModel *troopMonstersList) const;
    QString strChangeVariablesOperation(int &i) const;
    QString strInputNumber(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strCondition(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strConditionPageVariables(QStandardItemModel *properties,
        QStandardItemModel *parameters, int &i, int radioIndex) const;
    QString strModifyInventory(QStandardItemModel *properties, QStandardItemModel
                               *parameters) const;
    QString strModifyInventorySelection(QStandardItemModel *properties,
        QStandardItemModel *parameters, int &i) const;
    QString strModifyTeam(QStandardItemModel *properties, QStandardItemModel *parameters) const;
    QString strStartBattle(QStandardItemModel *parameters) const;
    QString strStartBattleTroop(QStandardItemModel *parameters, int &i) const;
    QString strStartBattleMap(QStandardItemModel *parameters, int &i) const;
    QString strStartBattleOptions(int &i) const;
    QString strStartBattleTransition(QStandardItemModel *parameters, int &i) const;
    QString strStartBattleTransitionType(QStandardItemModel *parameters, int &i,
        int type, QString name) const;
    QString strChangeState(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strChangeStateOperation(int &i) const;
    QString strSendEvent(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strSendEventTarget(QStandardItemModel *properties, QStandardItemModel
        *parameters, int &i) const;
    QString strTeleportObject(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strTeleportObjectPosition(QStandardItemModel *properties,
        QStandardItemModel *parameters, int &i) const;
    QString strTeleportObjectOptions(int &i) const;
    QString strMoveObject(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strMoveObjectID(QStandardItemModel *properties, QStandardItemModel
        *parameters, int &i) const;
    QString strMoveObjectOptions(int &i) const;
    QString strMoveObjectMoves(int &i) const;
    QString strWait(QStandardItemModel *properties, QStandardItemModel *parameters, bool style = true)
        const;
    QString strMoveCamera(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strMoveCameraTarget(QStandardItemModel *properties, QStandardItemModel
        *parameters, int &i) const;
    QString strMoveCameraMove(QStandardItemModel *parameters, int &i, QString
        &operation) const;
    QString strMoveCameraRotation(QStandardItemModel *parameters, int &i,
        QString &operation) const;
    QString strMoveCameraZoom(QStandardItemModel *parameters, int &i, QString
        &operation) const;
    QString strMoveCameraOptions(QStandardItemModel *parameters, int &i) const;
    QString strPlaySong(QStandardItemModel *properties, QStandardItemModel *parameters,
        SongKind kind, int &i) const;
    QString strPlayMusic(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strPlayBackgroundSound(QStandardItemModel *properties,
        QStandardItemModel *parameters) const;
    QString strPlaySound(QStandardItemModel *properties, QStandardItemModel
         *parameters, bool style = true) const;
    QString strPlayMusicEffect(QStandardItemModel *properties, QStandardItemModel
         *parameters) const;
    QString strStopSong(QStandardItemModel *properties, QStandardItemModel *parameters) const;
    QString strStopMusic(QStandardItemModel *properties, QStandardItemModel
         *parameters) const;
    QString strStopBackgroundSound(QStandardItemModel *properties,
         QStandardItemModel *parameters) const;
    QString strChangeProperty(QStandardItemModel *properties,
         QStandardItemModel *parameters) const;
    QString strDisplayChoice(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strScript(QStandardItemModel *properties, QStandardItemModel *parameters
        , bool style = true) const;
    QString strChoice() const;
    QString strDisplayAPicture(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strSetMoveTurnAPicture(QStandardItemModel *properties,
        QStandardItemModel *parameters) const;
    QString strRemoveAPicture(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strSetDialogBoxOptions(QStandardItemModel *properties,
        QStandardItemModel *parameters) const;
    QString strChangeScreenTone(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strRemoveObjectFromMap(QStandardItemModel *properties,
        QStandardItemModel *parameters) const;
    QString strAllowForbidSaves(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strAllowForbidMainMenu(QStandardItemModel *properties,
        QStandardItemModel *parameters) const;
    QString strCallACommonReaction(bool style = true) const;
    QString strLabel(bool jump, QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strComment() const;
    QString strChangeAStatistic(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strChangeASkill(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strOperationLearnForget(int &i) const;
    QString strOperationAddRemove(int &i) const;
    QString strChangeName(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strChangeEquipment(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strModifyCurrency(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strDisplayAnAnimation(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strShakeScreen(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strFlashScreen(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strPlugin(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strStartShopMenu(QStandardItemModel *properties, QStandardItemModel
        *parameters, bool isRestock = false) const;
    QString strEnterANameMenu(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strCreateObjectInMap(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strChangeStatus(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strChangeBattleMusic(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strChangeVictoryMusic(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strForceAnAction(QStandardItemModel *properties, QStandardItemModel
        *parameters, QStandardItemModel *troopMonstersList) const;
    QString strChangeMapProperties(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strChangeExperienceCurve(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strChangeClass(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strChangeChronometer(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strChangeWeather(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strPlayAVideo(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
    QString strSwitchTexture(QStandardItemModel *properties, QStandardItemModel
        *parameters) const;
};

Q_DECLARE_METATYPE(EventCommand)

#endif // EVENTCOMMAND_H
