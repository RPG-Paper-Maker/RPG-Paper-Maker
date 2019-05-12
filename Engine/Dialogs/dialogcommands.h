/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
                            QWidget *parent = nullptr);
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
    void on_pushButtonStopMusic_clicked();
    void on_pushButtonPlayBackgroundSound_clicked();
    void on_pushButtonStopBackgroundSound_clicked();
    void on_pushButtonPlaySound_clicked();
    void on_pushButtonPlayMusicEffect_clicked();
};

#endif // DIALOGCOMMANDS_H
