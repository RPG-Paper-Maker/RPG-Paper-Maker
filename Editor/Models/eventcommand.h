/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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
    QString toString(SystemCommonObject *object = nullptr, QStandardItemModel
        *parameters = nullptr) const;
    void read(const QJsonObject &json);
    QJsonObject getJSON() const;

private:
    EventCommandKind m_kind;
    QVector<QString> m_listCommand;

    QString strNumberVariable(int &i) const;
    QString strDataBaseId(int &i, SystemCommonObject *object = nullptr,
        QStandardItemModel *dataBase = nullptr, QStandardItemModel *parameters =
        nullptr) const;
    QString strProperty(int &i, SystemCommonObject *object = nullptr,
        QStandardItemModel *parameters = nullptr) const;
    QString strNumber(int &i, QStandardItemModel *parameters = nullptr) const;
    QString strShowText(SystemCommonObject *object = nullptr, QStandardItemModel
        *parameters = nullptr) const;
    QString strChangeVariables(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strChangeVariablesOperation(int &i) const;
    QString strInputNumber() const;
    QString strCondition(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strConditionPageVariables(SystemCommonObject *object,
        QStandardItemModel *parameters, int &i, int radioIndex) const;
    QString strModifyInventory(SystemCommonObject *object, QStandardItemModel
                               *parameters) const;
    QString strModifyInventorySelection(SystemCommonObject *object,
        QStandardItemModel *parameters, int &i) const;
    QString strModifyTeam(QStandardItemModel *parameters) const;
    QString strModifyTeamInstance(int &i, QStandardItemModel *parameters) const;
    QString strModifyTeamMoveDelete(int &i, QStandardItemModel *parameters) const;
    QString strStartBattle(QStandardItemModel *parameters) const;
    QString strStartBattleTroop(QStandardItemModel *parameters, int &i) const;
    QString strStartBattleMap(QStandardItemModel *parameters, int &i) const;
    QString strStartBattleOptions(int &i) const;
    QString strStartBattleTransition(QStandardItemModel *parameters, int &i) const;
    QString strStartBattleTransitionType(QStandardItemModel *parameters, int &i,
        int type, QString name) const;
    QString strChangeState(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strChangeStateOperation(int &i) const;
    QString strSendEvent(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strSendEventTarget(SystemCommonObject *object, QStandardItemModel
        *parameters, int &i) const;
    QString strTeleportObject(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strTeleportObjectPosition(SystemCommonObject *object,
        QStandardItemModel *parameters, int &i) const;
    QString strTeleportObjectOptions(int &i) const;
    QString strMoveObject(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strMoveObjectID(SystemCommonObject *object, QStandardItemModel
        *parameters, int &i) const;
    QString strMoveObjectOptions(int &i) const;
    QString strMoveObjectMoves(int &i) const;
    QString strWait(SystemCommonObject *object, QStandardItemModel *parameters)
        const;
    QString strMoveCamera(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strMoveCameraTarget(SystemCommonObject *object, QStandardItemModel
        *parameters, int &i) const;
    QString strMoveCameraMove(QStandardItemModel *parameters, int &i, QString
        &operation) const;
    QString strMoveCameraRotation(QStandardItemModel *parameters, int &i,
        QString &operation) const;
    QString strMoveCameraZoom(QStandardItemModel *parameters, int &i, QString
        &operation) const;
    QString strMoveCameraOptions(QStandardItemModel *parameters, int &i) const;
    QString strPlaySong(SystemCommonObject*, QStandardItemModel *parameters,
        SongKind kind) const;
    QString strPlayMusic(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strPlayBackgroundSound(SystemCommonObject *object,
        QStandardItemModel *parameters) const;
    QString strPlaySound(SystemCommonObject *object, QStandardItemModel
         *parameters) const;
    QString strPlayMusicEffect(SystemCommonObject *object, QStandardItemModel
         *parameters) const;
    QString strStopSong(SystemCommonObject*, QStandardItemModel *parameters) const;
    QString strStopMusic(SystemCommonObject *object, QStandardItemModel
         *parameters) const;
    QString strStopBackgroundSound(SystemCommonObject *object,
         QStandardItemModel *parameters) const;
    QString strChangeProperty(SystemCommonObject *object,
         QStandardItemModel *parameters) const;
    QString strDisplayChoice(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strScript(SystemCommonObject *object, QStandardItemModel *parameters
        ) const;
    QString strChoice() const;
    QString strDisplayAPicture(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strSetMoveTurnAPicture(SystemCommonObject *object,
        QStandardItemModel *parameters) const;
    QString strRemoveAPicture(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strSetDialogBoxOptions(SystemCommonObject *object,
        QStandardItemModel *parameters) const;
    QString strChangeScreenTone(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strRemoveObjectFromMap(SystemCommonObject *object,
        QStandardItemModel *parameters) const;
    QString strAllowForbidSaves(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strAllowForbidMainMenu(SystemCommonObject *object,
        QStandardItemModel *parameters) const;
    QString strCallACommonReaction() const;
    QString strLabel(bool jump, SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strComment() const;
    QString strChangeAStatistic(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strChangeASkill(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strOperationLearnForget(int &i) const;
    QString strChangeName(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strChangeEquipment(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strModifyCurrency(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strDisplayAnAnimation(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strShakeScreen(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strFlashScreen(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
};

Q_DECLARE_METATYPE(EventCommand)

#endif // EVENTCOMMAND_H
