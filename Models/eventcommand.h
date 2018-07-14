/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
    int commandsCount() const;
    QString valueCommandAt(int index) const;
    bool hasElse() const;
    bool isBattleWithoutGameOver() const;
    bool isEditable() const;
    bool isErasable() const;
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
    QString strChangeVariables() const;
    QString strChangeVariablesSelection(int &i, QString& several) const;
    QString strChangeVariablesOperation(int &i) const;
    QString strChangeVariablesValue(int &i) const;
    QString strInputNumber() const;
    QString strCondition() const;
    QString strConditionPageVariables(int &i) const;
    QString strModifyInventory() const;
    QString strModifyInventorySelection(int &i) const;
    QString strModifyTeam() const;
    QString strModifyTeamInstance(int &i) const;
    QString strModifyTeamMoveDelete(int &i) const;
    QString strStartBattle() const;
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
