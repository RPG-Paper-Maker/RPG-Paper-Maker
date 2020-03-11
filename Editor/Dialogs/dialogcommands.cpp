/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include "dialogcommands.h"
#include "ui_dialogcommands.h"
#include "dialogcommandshowtext.h"
#include "dialogcommandchangevariables.h"
#include "dialogcommandinputnumber.h"
#include "dialogcommandconditions.h"
#include "dialogcommandmodifyinventory.h"
#include "dialogcommandmodifyteam.h"
#include "dialogcommandstartbattle.h"
#include "dialogcommandchangestate.h"
#include "dialogcommandsendevent.h"
#include "dialogcommandteleportobject.h"
#include "dialogcommandmoveobject.h"
#include "dialogcommandwait.h"
#include "dialogcommandmovecamera.h"
#include "dialogcommandplaysong.h"
#include "dialogcommandstopsong.h"
#include "dialogcommandchangeproperty.h"
#include "dialogcommanddisplaychoice.h"
#include "dialogcommandscript.h"
#include "dialogcommanddisplayapicture.h"
#include "dialogcommandsetmoveturnapicture.h"
#include "dialogcommandremoveapicture.h"
#include "dialogcommandsetdialogboxoptions.h"
#include "dialogcommandchangescreentone.h"
#include "dialogcommandremoveobjectfrommap.h"
#include "dialogcommandallowforbidsavesmainmenu.h"
#include "dialogcommandcallacommonreaction.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommands::DialogCommands(SystemCommonObject *object,
                               QStandardItemModel *parameters,
                               QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogCommands),
    m_linkedObject(object),
    m_parameters(parameters)
{
    ui->setupUi(this);

    this->translate();
}

DialogCommands::~DialogCommands()
{
    delete ui;
}

EventCommand* DialogCommands::getCommand() const{ return p_command; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

DialogCommand* DialogCommands::getDialogCommand(EventCommandKind kind,
                                                EventCommand* command,
                                                SystemCommonObject *object,
                                                QStandardItemModel *parameters)
{
    switch(kind){
    case EventCommandKind::ShowText:
        return new DialogCommandShowText(command, object, parameters);
    case EventCommandKind::ChangeVariables:
        return new DialogCommandChangeVariables(command, object, parameters);
    case EventCommandKind::InputNumber:
        return new DialogCommandInputNumber(command);
    case EventCommandKind::If:
        return new DialogCommandConditions(command, object, parameters);
    case EventCommandKind::ModifyInventory:
        return new DialogCommandModifyInventory(command);
    case EventCommandKind::ModifyTeam:
        return new DialogCommandModifyTeam(command);
    case EventCommandKind::StartBattle:
        return new DialogCommandStartBattle(command, object, parameters);
    case EventCommandKind::ChangeState:
        return new DialogCommandChangeState(command, object, parameters);
    case EventCommandKind::SendEvent:
        return new DialogCommandSendEvent(command, object, parameters);
    case EventCommandKind::TeleportObject:
        return new DialogCommandTeleportObject(command, object, parameters);
    case EventCommandKind::MoveObject:
        return new DialogCommandMoveObject(command, object, parameters);
    case EventCommandKind::Wait:
        return new DialogCommandWait(command, object, parameters);
    case EventCommandKind::MoveCamera:
        return new DialogCommandMoveCamera(command, object, parameters);
    case EventCommandKind::PlayMusic:
        return new DialogCommandPlaySong("Play a music", SongKind::Music,
                                         command, object, parameters);
    case EventCommandKind::StopMusic:
        return new DialogCommandStopSong("Stop a music", SongKind::Music,
                                         command, object, parameters);
    case EventCommandKind::PlayBackgroundSound:
        return new DialogCommandPlaySong("Play a background sound",
                                         SongKind::BackgroundSound,
                                         command, object, parameters);
    case EventCommandKind::StopBackgroundSound:
        return new DialogCommandStopSong("Stop a background sound",
                                         SongKind::BackgroundSound,
                                         command, object, parameters);
    case EventCommandKind::PlayASound:
        return new DialogCommandPlaySong("Play a sound", SongKind::Sound,
                                         command, object, parameters);
    case EventCommandKind::PlayMusicEffect:
        return new DialogCommandPlaySong("Play a music effect",
                                         SongKind::MusicEffect,
                                         command, object, parameters);
    case EventCommandKind::ChangeProperty:
        // Warning if no property available
        if (object == nullptr || object->modelProperties() == nullptr || object
            ->modelProperties()->invisibleRootItem()->rowCount() == 1)
        {
            QMessageBox::information(nullptr, "Warning", "There are no properties "
                "available to change.");
            return nullptr;
        }
        return new DialogCommandChangeProperty(command, object, parameters);
    case EventCommandKind::DisplayChoice:
        return new DialogCommandDisplayChoice(command, object, parameters);
    case EventCommandKind::Script:
        return new DialogCommandScript(command, object, parameters);
    case EventCommandKind::DisplayAPicture:
        return new DialogCommandDisplayAPicture(command, object, parameters);
    case EventCommandKind::SetMoveTurnAPicture:
        return new DialogCommandSetMoveTurnAPicture(command, object, parameters);
    case EventCommandKind::RemoveAPicture:
        return new DialogCommandRemoveAPicture(command, object, parameters);
    case EventCommandKind::SetDialogBoxOptions:
        return new DialogCommandSetDialogBoxOptions(command, object, parameters);
    case EventCommandKind::ChangeScreenTone:
        return new DialogCommandChangeScreenTone(command, object, parameters);
    case EventCommandKind::RemoveObjectFromMap:
        return new DialogCommandRemoveObjectFromMap(command, object, parameters);
    case EventCommandKind::AllowForbidSaves:
    case EventCommandKind::AllowForbidMainMenu:
        return new DialogCommandAllowForbidSavesMainMenu(kind, command, object,
            parameters);
    case EventCommandKind::CallACommonReaction:
        return new DialogCommandCallACommonReaction(command);
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

void DialogCommands::openDialogCommand(EventCommandKind kind,
                                       EventCommand* command)
{
    DialogCommand *dialog;

    dialog = this->getDialogCommand(kind, command, m_linkedObject, m_parameters);
    if (dialog != nullptr) {
        if (dialog->exec() == QDialog::Accepted){
            p_command = dialog->getCommand();
            accept();
        }
        delete dialog;
    }
}

// -------------------------------------------------------

void DialogCommands::openNonDialogCommand(EventCommandKind kind){
    p_command = new EventCommand(kind);
    accept();
}

// -------------------------------------------------------

void DialogCommands::translate() {
    this->setWindowTitle(RPM::translate(Translations::COMMANDS));
    ui->pushButtonShowText->setText(EventCommand::kindToString(EventCommandKind
        ::ShowText));
    ui->pushButtonChangeVariables->setText(EventCommand::kindToString(
        EventCommandKind::ChangeVariables));
    ui->pushButtonEndGame->setText(EventCommand::kindToString(EventCommandKind
        ::EndGame));
    ui->pushButtonWhile->setText(EventCommand::kindToString(EventCommandKind
        ::While));
    ui->pushButtonWhileBreak->setText(EventCommand::kindToString(
        EventCommandKind::WhileBreak));
    ui->pushButtonInputNumber->setText(EventCommand::kindToString(
        EventCommandKind::InputNumber));
    ui->pushButtonCondition->setText(EventCommand::kindToString(EventCommandKind
        ::If));
    ui->pushButtonOpenMainMenu->setText(EventCommand::kindToString(
        EventCommandKind::OpenMainMenu));
    ui->pushButtonOpenSavesMenu->setText(EventCommand::kindToString(
        EventCommandKind::OpenSavesMenu));
    ui->pushButtonModifyInventory->setText(EventCommand::kindToString(
        EventCommandKind::ModifyInventory));
    ui->pushButtonModifyTeam->setText(EventCommand::kindToString(
        EventCommandKind::ModifyTeam));
    ui->pushButtonStartBattle->setText(EventCommand::kindToString(
        EventCommandKind::StartBattle));
    ui->pushButtonChangeState->setText(EventCommand::kindToString(
        EventCommandKind::ChangeState));
    ui->pushButtonSendEvent->setText(EventCommand::kindToString(EventCommandKind
        ::SendEvent));
    ui->pushButtonTeleportObject->setText(EventCommand::kindToString(
        EventCommandKind::TeleportObject));
    ui->pushButtonMoveObject->setText(EventCommand::kindToString(
        EventCommandKind::MoveObject));
    ui->pushButtonWait->setText(EventCommand::kindToString(EventCommandKind
        ::Wait));
    ui->pushButtonMoveCamera->setText(EventCommand::kindToString(
        EventCommandKind::MoveCamera));
    ui->pushButtonPlayMusic->setText(EventCommand::kindToString(EventCommandKind
        ::PlayMusic));
    ui->pushButtonStopMusic->setText(EventCommand::kindToString(EventCommandKind
        ::StopMusic));
    ui->pushButtonPlayBackgroundSound->setText(EventCommand::kindToString(
        EventCommandKind::PlayBackgroundSound));
    ui->pushButtonStopBackgroundSound->setText(EventCommand::kindToString(
        EventCommandKind::StopBackgroundSound));
    ui->pushButtonPlaySound->setText(EventCommand::kindToString(EventCommandKind
        ::PlayASound));
    ui->pushButtonPlayMusicEffect->setText(EventCommand::kindToString(
        EventCommandKind::PlayMusicEffect));
    ui->pushButtonChangeProperty->setText(EventCommand::kindToString(
        EventCommandKind::ChangeProperty));
    ui->pushButtonDisplayChoice->setText(EventCommand::kindToString(
        EventCommandKind::DisplayChoice));
    ui->pushButtonScript->setText(EventCommand::kindToString(EventCommandKind
        ::Script));
    ui->pushButtonDisplayPicture->setText(EventCommand::kindToString(
        EventCommandKind::DisplayAPicture));
    ui->pushButtonSetMoveTurnPicture->setText(EventCommand::kindToString(
        EventCommandKind::SetMoveTurnAPicture));
    ui->pushButtonRemovePicture->setText(EventCommand::kindToString(
        EventCommandKind::RemoveAPicture));
    ui->pushButtonSetDialogBoxOptions->setText(EventCommand::kindToString(
        EventCommandKind::SetDialogBoxOptions));
    ui->pushButtonTitleScreen->setText(EventCommand::kindToString(
        EventCommandKind::TitleScreen));
    ui->pushButtonChangeScreenTone->setText(EventCommand::kindToString(
        EventCommandKind::ChangeScreenTone));
    ui->pushButtonRemoveObjectFromMap->setText(EventCommand::kindToString(
        EventCommandKind::RemoveObjectFromMap));
    ui->pushButtonStopReaction->setText(EventCommand::kindToString(
        EventCommandKind::StopReaction));
    ui->pushButtonAllowForbidSaves->setText(EventCommand::kindToString(
        EventCommandKind::AllowForbidSaves));
    ui->pushButtonAllowForbidMainMenu->setText(EventCommand::kindToString(
        EventCommandKind::AllowForbidMainMenu));
    ui->pushButtonCallCommonReaction->setText(EventCommand::kindToString(
        EventCommandKind::CallACommonReaction));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommands::on_pushButtonShowText_clicked(){
    this->openDialogCommand(EventCommandKind::ShowText);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonDisplayChoice_clicked() {
    this->openDialogCommand(EventCommandKind::DisplayChoice);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonEndGame_clicked(){
    this->openNonDialogCommand(EventCommandKind::EndGame);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeVariables_clicked(){
    this->openDialogCommand(EventCommandKind::ChangeVariables);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonWhile_clicked(){
    this->openNonDialogCommand(EventCommandKind::While);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonWhileBreak_clicked(){
    this->openNonDialogCommand(EventCommandKind::WhileBreak);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonInputNumber_clicked(){
    this->openDialogCommand(EventCommandKind::InputNumber);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonCondition_clicked(){
    this->openDialogCommand(EventCommandKind::If);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonOpenMainMenu_clicked(){
    this->openNonDialogCommand(EventCommandKind::OpenMainMenu);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonOpenSavesMenu_clicked(){
    this->openNonDialogCommand(EventCommandKind::OpenSavesMenu);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonModifyInventory_clicked(){
    this->openDialogCommand(EventCommandKind::ModifyInventory);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonModifyTeam_clicked(){
    this->openDialogCommand(EventCommandKind::ModifyTeam);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonStartBattle_clicked(){
    this->openDialogCommand(EventCommandKind::StartBattle);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeState_clicked(){
    this->openDialogCommand(EventCommandKind::ChangeState);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonSendEvent_clicked(){
    this->openDialogCommand(EventCommandKind::SendEvent);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonTeleportObject_clicked(){
    this->openDialogCommand(EventCommandKind::TeleportObject);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonMoveObject_clicked(){
    this->openDialogCommand(EventCommandKind::MoveObject);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonWait_clicked(){
    this->openDialogCommand(EventCommandKind::Wait);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonMoveCamera_clicked() {
    this->openDialogCommand(EventCommandKind::MoveCamera);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonPlayMusic_clicked() {
    this->openDialogCommand(EventCommandKind::PlayMusic);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonStopMusic_clicked() {
    this->openDialogCommand(EventCommandKind::StopMusic);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonPlayBackgroundSound_clicked() {
    this->openDialogCommand(EventCommandKind::PlayBackgroundSound);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonStopBackgroundSound_clicked() {
    this->openDialogCommand(EventCommandKind::StopBackgroundSound);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonPlaySound_clicked() {
    this->openDialogCommand(EventCommandKind::PlayASound);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonPlayMusicEffect_clicked() {
    this->openDialogCommand(EventCommandKind::PlayMusicEffect);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeProperty_clicked() {
    this->openDialogCommand(EventCommandKind::ChangeProperty);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonScript_clicked() {
    this->openDialogCommand(EventCommandKind::Script);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonDisplayPicture_clicked() {
    this->openDialogCommand(EventCommandKind::DisplayAPicture);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonSetMoveTurnPicture_clicked() {
    this->openDialogCommand(EventCommandKind::SetMoveTurnAPicture);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonRemovePicture_clicked() {
    this->openDialogCommand(EventCommandKind::RemoveAPicture);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonSetDialogBoxOptions_clicked() {
    this->openDialogCommand(EventCommandKind::SetDialogBoxOptions);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonTitleScreen_clicked() {
    this->openNonDialogCommand(EventCommandKind::TitleScreen);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeScreenTone_clicked() {
    this->openDialogCommand(EventCommandKind::ChangeScreenTone);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonRemoveObjectFromMap_clicked() {
    this->openDialogCommand(EventCommandKind::RemoveObjectFromMap);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonStopReaction_clicked() {
    this->openNonDialogCommand(EventCommandKind::StopReaction);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonAllowForbidSaves_clicked() {
    this->openDialogCommand(EventCommandKind::AllowForbidSaves);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonAllowForbidMainMenu_clicked() {
    this->openDialogCommand(EventCommandKind::AllowForbidMainMenu);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonCallCommonReaction_clicked() {
    this->openDialogCommand(EventCommandKind::CallACommonReaction);
}
