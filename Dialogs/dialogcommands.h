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

#ifndef DIALOGCOMMANDS_H
#define DIALOGCOMMANDS_H

#include <QDialog>
#include "dialogcommandshowtext.h"
#include "gamedatas.h"
#include "systemcommonobject.h"
#include "systemcreateparameter.h"

// -------------------------------------------------------
//
//  CLASS DialogCommands
//
//  A dialog used for showing all the possible commands.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommands;
}

class DialogCommands : public QDialog
{
    Q_OBJECT

public:
    explicit DialogCommands(SystemCommonObject* object = nullptr,
                            QStandardItemModel* parameters = nullptr,
                            QWidget *parent = 0);
    ~DialogCommands();
    static DialogCommand* getDialogCommand(EventCommandKind kind,
                                           EventCommand *command,
                                           SystemCommonObject *object,
                                           QStandardItemModel *parameters);
    EventCommand* getCommand() const;

private:
    Ui::DialogCommands *ui;
    EventCommand* p_command;
    SystemCommonObject* m_linkedObject;
    QStandardItemModel* m_parameters;
    void openDialogCommand(EventCommandKind kind,
                           EventCommand *command = nullptr);
    void openNonDialogCommand(EventCommandKind kind);

private slots:
    void on_pushButtonShowText_clicked();
    void on_pushButtonEndGame_clicked();
    void on_pushButtonChangeVariables_clicked();
    void on_pushButtonWhile_clicked();
    void on_pushButtonWhileBreak_clicked();
    void on_pushButtonInputNumber_clicked();
    void on_pushButtonCondition_clicked();
    void on_pushButtonOpenMainMenu_clicked();
    void on_pushButtonOpenSavesMenu_clicked();
    void on_pushButtonModifyInventory_clicked();
    void on_pushButtonModifyTeam_clicked();
    void on_pushButtonStartBattle_clicked();
    void on_pushButtonChangeState_clicked();
    void on_pushButtonSendEvent_clicked();
    void on_pushButtonTeleportObject_clicked();
    void on_pushButtonMoveObject_clicked();
    void on_pushButtonWait_clicked();
    void on_pushButtonMoveCamera_clicked();
    void on_pushButtonPlayMusic_clicked();
};

#endif // DIALOGCOMMANDS_H
