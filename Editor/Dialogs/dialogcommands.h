/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

    void openDialogCommand(EventCommandKind kind, EventCommand *command =
        nullptr);
    void openNonDialogCommand(EventCommandKind kind);
    void translate();

private slots:
    void on_pushButtonShowText_clicked();
    void on_pushButtonDisplayChoice_clicked();
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
    void on_pushButtonChangeProperty_clicked();
    void on_pushButtonScript_clicked();
    void on_pushButtonDisplayPicture_clicked();
    void on_pushButtonSetMoveTurnPicture_clicked();
    void on_pushButtonRemovePicture_clicked();
    void on_pushButtonSetDialogBoxOptions_clicked();
    void on_pushButtonTitleScreen_clicked();
    void on_pushButtonChangeScreenTone_clicked();
    void on_pushButtonRemoveObjectFromMap_clicked();
    void on_pushButtonStopReaction_clicked();
    void on_pushButtonAllowForbidSaves_clicked();
    void on_pushButtonAllowForbidMainMenu_clicked();
    void on_pushButtonCallCommonReaction_clicked();
    void on_pushButtonLabel_clicked();
    void on_pushButtonJumpLabel_clicked();
    void on_pushButtonComment_clicked();
    void on_pushButtonChangeStatistic_clicked();
    void on_pushButtonChangeSkill_clicked();
    void on_pushButtonChangeName_clicked();
    void on_pushButtonChangeEquiment_clicked();
    void on_pushButtonModifyCurrency_clicked();
    void on_pushButtonDisplayAnimation_clicked();
    void on_pushButtonShakeScreen_clicked();
    void on_pushButtonFlashScreen_clicked();
    void on_pushButtonPlugin_clicked();
    void on_pushButtonStartShopMenu_clicked();
    void on_pushButtonRestockShop_clicked();
    void on_pushButtonEnterANameMenu_clicked();
    void on_pushButtonCreateObjectInMap_clicked();
    void on_pushButtonChangeStatus_clicked();
    void on_pushButtonResetCamera_clicked();
    void on_pushButtonChangeBattleMusic_clicked();
    void on_pushButtonChangeVictoryMusic_clicked();
    void on_pushButtonEndBattle_clicked();
    void on_pushButtonForceAction_clicked();
};

#endif // DIALOGCOMMANDS_H
