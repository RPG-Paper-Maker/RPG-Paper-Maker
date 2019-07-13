/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    EventCommand();
    EventCommand(EventCommandKind k, QVector<QString>& l = emptyCommandList);
    virtual ~EventCommand();
    static QVector<QString> emptyCommandList;
    EventCommandKind kind() const;
    void setKind(EventCommandKind k);
    int commandsCount() const;
    QString valueCommandAt(int index) const;
    void setCommands(QVector<QString>& commands);
    bool hasElse() const;
    bool isBattleWithoutGameOver() const;
    bool isEditable() const;
    bool isErasable() const;
    int getSongID(QStandardItemModel* parameters) const;

    static QString kindToString(EventCommandKind kind);
    static bool eventCommandKindLessThan(const EventCommandKind &v1, const
        EventCommandKind &v2);

    void read(const QJsonObject &json);
    QJsonObject getJSON() const;
    void setCopy(const EventCommand& copy);
    QString toString(SystemCommonObject* object = nullptr,
                     QStandardItemModel* parameters = nullptr) const;

private:
    EventCommandKind p_kind;
    QVector<QString> p_listCommand;

    void readCommand(const QJsonArray &json);
    QJsonArray getArrayJSON() const;
    QString strNumberVariable(int &i) const;
    QString strDataBaseId(int &i, QStandardItemModel *dataBase = nullptr,
                          QStandardItemModel *parameters = nullptr) const;
    QString strNumber(int &i, QStandardItemModel *parameters = nullptr) const;
    QString strShowText() const;
    QString strChangeVariables(SystemCommonObject *object, QStandardItemModel
        *parameters) const;
    QString strChangeVariablesSelection(int &i, QString& several) const;
    QString strChangeVariablesOperation(int &i) const;
    QString strChangeVariablesValue(int &i, SystemCommonObject *object,
        QStandardItemModel *parameters) const;
    QString strInputNumber() const;
    QString strCondition() const;
    QString strConditionPageVariables(int &i) const;
    QString strModifyInventory() const;
    QString strModifyInventorySelection(int &i) const;
    QString strModifyTeam(QStandardItemModel* parameters) const;
    QString strModifyTeamInstance(int &i, QStandardItemModel* parameters) const;
    QString strModifyTeamMoveDelete(int &i, QStandardItemModel* parameters) const;
    QString strStartBattle(QStandardItemModel* parameters) const;
    QString strStartBattleTroop(QStandardItemModel* parameters, int& i) const;
    QString strStartBattleMap(QStandardItemModel* parameters, int& i) const;
    QString strStartBattleOptions(int& i) const;
    QString strStartBattleTransition(QStandardItemModel* parameters, int& i) const;
    QString strStartBattleTransitionType(QStandardItemModel* parameters, int& i,
        int type, QString name) const;
    QString strChangeState(SystemCommonObject* object,
                           QStandardItemModel* parameters) const;
    QString strChangeStateOperation(int& i) const;
    QString strSendEvent() const;
    QString strSendEventTarget(int& i) const;
    QString strTeleportObject(SystemCommonObject* object,
                              QStandardItemModel* parameters) const;
    QString strTeleportObjectPosition(SystemCommonObject*,
                                      QStandardItemModel* parameters,
                                      int& i) const;
    QString strTeleportObjectOptions(int& i) const;
    QString strMoveObject(QStandardItemModel* parameters) const;
    QString strMoveObjectID(QStandardItemModel* parameters, int& i) const;
    QString strMoveObjectOptions(int& i) const;
    QString strMoveObjectMoves(int& i) const;
    QString strWait() const;
    QString strMoveCamera(QStandardItemModel* parameters) const;
    QString strMoveCameraTarget(QStandardItemModel* parameters, int& i) const;
    QString strMoveCameraMove(QStandardItemModel* parameters, int& i,
                              QString& operation) const;
    QString strMoveCameraRotation(QStandardItemModel* parameters, int& i,
                                  QString &operation) const;
    QString strMoveCameraZoom(QStandardItemModel *parameters, int& i,
                              QString &operation) const;
    QString strMoveCameraOptions(QStandardItemModel *parameters, int& i) const;
    QString strPlaySong(SystemCommonObject*,
                        QStandardItemModel* parameters, SongKind kind) const;
    QString strPlayMusic(SystemCommonObject* object,
                         QStandardItemModel* parameters) const;
    QString strPlayBackgroundSound(SystemCommonObject* object,
                                   QStandardItemModel* parameters) const;
    QString strPlaySound(SystemCommonObject* object,
                         QStandardItemModel* parameters) const;
    QString strPlayMusicEffect(SystemCommonObject* object,
                               QStandardItemModel* parameters) const;
    QString strStopSong(SystemCommonObject*,
                        QStandardItemModel* parameters) const;
    QString strStopMusic(SystemCommonObject* object,
                         QStandardItemModel* parameters) const;
    QString strStopBackgroundSound(SystemCommonObject* object,
                                   QStandardItemModel* parameters) const;
};

Q_DECLARE_METATYPE(EventCommand)

#endif // EVENTCOMMAND_H
