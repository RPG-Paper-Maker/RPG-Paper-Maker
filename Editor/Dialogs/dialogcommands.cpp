/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
#include "dialogcommandlabel.h"
#include "dialogcommandcomment.h"
#include "dialogcommandchangeastatistic.h"
#include "dialogcommandchangeaskill.h"
#include "dialogcommandchangename.h"
#include "dialogcommandchangeequipment.h"
#include "dialogcommandchangemoney.h"
#include "dialogcommanddisplayananimation.h"
#include "dialogcommandshakescreen.h"
#include "dialogcommandflashscreen.h"
#include "dialogcommandplugin.h"
#include "dialogcommandstartshopmenu.h"
#include "dialogcommandenteranamemenu.h"
#include "dialogcommandcreateobjectinmap.h"
#include "dialogcommandchangestatus.h"
#include "dialogcommandforceanaction.h"
#include "dialogcommandchangemapproperties.h"
#include "dialogcommandchangeexperiencecurve.h"
#include "dialogcommandchangeclass.h"
#include "dialogcommandchangechronometer.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommands::DialogCommands(SystemCommonObject *object, QStandardItemModel
    *parameters, QStandardItemModel *troopMonstersList, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogCommands),
    m_linkedObject(object),
    m_parameters(parameters),
    m_troopMonstersList(troopMonstersList)
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

DialogCommand * DialogCommands::getDialogCommand(EventCommandKind kind,
    EventCommand *command, SystemCommonObject *object, QStandardItemModel
    *parameters, QStandardItemModel *troopMonstersList)
{
    QStandardItemModel *properties = object == nullptr ? nullptr : object
        ->modelProperties();
    switch(kind)
    {
    case EventCommandKind::ShowText:
        return new DialogCommandShowText(command, properties, parameters);
    case EventCommandKind::ChangeVariables:
        return new DialogCommandChangeVariables(command, properties, parameters,
            troopMonstersList);
    case EventCommandKind::InputNumber:
        return new DialogCommandInputNumber(command, properties, parameters);
    case EventCommandKind::If:
        return new DialogCommandConditions(command, properties, parameters);
    case EventCommandKind::ModifyInventory:
        return new DialogCommandModifyInventory(command, properties, parameters);
    case EventCommandKind::ModifyTeam:
        return new DialogCommandModifyTeam(command);
    case EventCommandKind::StartBattle:
        return new DialogCommandStartBattle(command, properties, parameters);
    case EventCommandKind::ChangeState:
        return new DialogCommandChangeState(command, properties, parameters);
    case EventCommandKind::SendEvent:
        return new DialogCommandSendEvent(command, properties, parameters);
    case EventCommandKind::TeleportObject:
        return new DialogCommandTeleportObject(command, properties, parameters);
    case EventCommandKind::MoveObject:
        return new DialogCommandMoveObject(command, properties, parameters);
    case EventCommandKind::Wait:
        return new DialogCommandWait(command, properties, parameters);
    case EventCommandKind::MoveCamera:
        return new DialogCommandMoveCamera(command, properties, parameters);
    case EventCommandKind::PlayMusic:
        return new DialogCommandPlaySong(RPM::translate(Translations::PLAY_MUSIC
            ) + RPM::DOT_DOT_DOT, SongKind::Music, command, properties, parameters);
    case EventCommandKind::StopMusic:
        return new DialogCommandStopSong(RPM::translate(Translations::STOP_MUSIC
            ) + RPM::DOT_DOT_DOT, SongKind::Music, command, properties, parameters);
    case EventCommandKind::PlayBackgroundSound:
        return new DialogCommandPlaySong(RPM::translate(Translations
            ::PLAY_BACKGROUND_SOUND) + RPM::DOT_DOT_DOT , SongKind
            ::BackgroundSound, command, properties, parameters);
    case EventCommandKind::StopBackgroundSound:
        return new DialogCommandStopSong(RPM::translate(Translations
            ::PLAY_BACKGROUND_SOUND) + RPM::DOT_DOT_DOT, SongKind
            ::BackgroundSound, command, properties, parameters);
    case EventCommandKind::PlayASound:
        return new DialogCommandPlaySong(RPM::translate(Translations
            ::PLAY_A_SOUND) + RPM::DOT_DOT_DOT, SongKind::Sound, command,
            properties, parameters);
    case EventCommandKind::PlayMusicEffect:
        return new DialogCommandPlaySong(RPM::translate(Translations
            ::PLAY_MUSIC_EFFECT) + RPM::DOT_DOT_DOT, SongKind::MusicEffect,
            command, properties, parameters);
    case EventCommandKind::ChangeProperty:
        // Warning if no property available
        if (properties == nullptr || properties->rowCount() == 1)
        {
            QMessageBox::information(nullptr, RPM::translate(Translations
                ::WARNING), RPM::translate(Translations::THERE_ARE_NO_PROPERTIES)
                + RPM::DOT);
            return nullptr;
        }
        return new DialogCommandChangeProperty(command, properties, parameters);
    case EventCommandKind::DisplayChoice:
        return new DialogCommandDisplayChoice(command, properties, parameters);
    case EventCommandKind::Script:
        return new DialogCommandScript(command, properties, parameters);
    case EventCommandKind::DisplayAPicture:
        return new DialogCommandDisplayAPicture(command, properties, parameters);
    case EventCommandKind::SetMoveTurnAPicture:
        return new DialogCommandSetMoveTurnAPicture(command, properties, parameters);
    case EventCommandKind::RemoveAPicture:
        return new DialogCommandRemoveAPicture(command, properties, parameters);
    case EventCommandKind::SetDialogBoxOptions:
        return new DialogCommandSetDialogBoxOptions(command, properties, parameters);
    case EventCommandKind::ChangeScreenTone:
        return new DialogCommandChangeScreenTone(command, properties, parameters);
    case EventCommandKind::RemoveObjectFromMap:
        return new DialogCommandRemoveObjectFromMap(command, properties, parameters);
    case EventCommandKind::AllowForbidSaves:
    case EventCommandKind::AllowForbidMainMenu:
        return new DialogCommandAllowForbidSavesMainMenu(kind, command, properties,
            parameters);
    case EventCommandKind::CallACommonReaction:
        return new DialogCommandCallACommonReaction(command);
    case EventCommandKind::Label:
        return new DialogCommandLabel(false, command, properties, parameters);
    case EventCommandKind::JumpLabel:
        return new DialogCommandLabel(true, command, properties, parameters);
    case EventCommandKind::Comment:
        return new DialogCommandComment(command);
    case EventCommandKind::ChangeAStatistic:
        return new DialogCommandChangeAStatistic(command, properties, parameters);
    case EventCommandKind::ChangeASkill:
        return new DialogCommandChangeASkill(command, properties, parameters);
    case EventCommandKind::ChangeName:
        return new DialogCommandChangeName(command, properties, parameters);
    case EventCommandKind::ChangeEquipment:
        return new DialogCommandChangeEquipment(command, properties, parameters);
    case EventCommandKind::ModifyCurrency:
        return new DialogCommandChangeMoney(command, properties, parameters);
    case EventCommandKind::DisplayAnAnimation:
        return new DialogCommandDisplayAnAnimation(command, properties, parameters);
    case EventCommandKind::ShakeScreen:
        return new DialogCommandShakeScreen(command, properties, parameters);
    case EventCommandKind::FlashScreen:
        return new DialogCommandFlashScreen(command, properties, parameters);
    case EventCommandKind::Plugin:
        return new DialogCommandPlugin(command, properties, parameters);
    case EventCommandKind::StartShopMenu:
        return new DialogCommandStartShopMenu(command, properties, parameters);
    case EventCommandKind::RestockShop:
        return new DialogCommandStartShopMenu(command, properties, parameters, true);
    case EventCommandKind::EnterANameMenu:
        return new DialogCommandEnterANameMenu(command, properties, parameters);
    case EventCommandKind::CreateObjectInMap:
        return new DialogCommandCreateObjectInMap(command, properties, parameters);
    case EventCommandKind::ChangeStatus:
        return new DialogCommandChangeStatus(command, properties, parameters);
    case EventCommandKind::ChangeBattleMusic:
        return new DialogCommandPlaySong(RPM::translate(Translations
            ::CHANGE_BATTLE_MUSIC), SongKind::Music, command, properties,
            parameters, EventCommandKind::ChangeBattleMusic);
    case EventCommandKind::ChangeVictoryMusic:
        return new DialogCommandPlaySong(RPM::translate(Translations
            ::CHANGE_VICTORY_MUSIC), SongKind::Music, command, properties,
            parameters, EventCommandKind::ChangeVictoryMusic);
    case EventCommandKind::ForceAnAction:
        return new DialogCommandForceAnAction(command, properties, parameters,
            troopMonstersList);
    case EventCommandKind::ChangeMapProperties:
        return new DialogCommandChangeMapProperties(command, properties, parameters);
    case EventCommandKind::ChangeExperienceCurve:
        return new DialogCommandChangeExperienceCurve(command, properties, parameters);
    case EventCommandKind::ChangeClass:
        return new DialogCommandChangeClass(command, properties, parameters);
    case EventCommandKind::ChangeChronometer:
        return new DialogCommandChangeChronometer(command, properties, parameters);
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

void DialogCommands::openDialogCommand(EventCommandKind kind, EventCommand *command)
{
    DialogCommand *dialog;

    dialog = this->getDialogCommand(kind, command, m_linkedObject, m_parameters,
        m_troopMonstersList);
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
    this->setWindowTitle(RPM::translate(Translations::COMMANDS) + RPM
        ::DOT_DOT_DOT);
    ui->tabWidget->setTabText(0, RPM::translate(Translations::STAGING));
    ui->tabWidget->setTabText(1, RPM::translate(Translations::MAP));
    ui->tabWidget->setTabText(2, RPM::translate(Translations::BATTLE));
    ui->tabWidget->setTabText(3, RPM::translate(Translations::STRUCTURE));
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
    ui->pushButtonComment->setText(EventCommand::kindToString(
        EventCommandKind::Comment));
    ui->pushButtonJumpLabel->setText(EventCommand::kindToString(
        EventCommandKind::JumpLabel));
    ui->pushButtonLabel->setText(EventCommand::kindToString(
        EventCommandKind::Label));
    ui->pushButtonChangeStatistic->setText(EventCommand::kindToString(
        EventCommandKind::ChangeAStatistic));
    ui->pushButtonChangeSkill->setText(EventCommand::kindToString(
        EventCommandKind::ChangeASkill));
    ui->pushButtonChangeName->setText(EventCommand::kindToString(
        EventCommandKind::ChangeName));
    ui->pushButtonChangeEquiment->setText(EventCommand::kindToString(EventCommandKind::ChangeEquipment));
    ui->pushButtonModifyCurrency->setText(EventCommand::kindToString(EventCommandKind::ModifyCurrency));
    ui->pushButtonDisplayAnimation->setText(EventCommand::kindToString(EventCommandKind::DisplayAnAnimation));
    ui->pushButtonShakeScreen->setText(EventCommand::kindToString(EventCommandKind::ShakeScreen));
    ui->pushButtonFlashScreen->setText(EventCommand::kindToString(EventCommandKind::FlashScreen));
    ui->pushButtonPlugin->setText(EventCommand::kindToString(EventCommandKind::Plugin));
    ui->pushButtonStartShopMenu->setText(EventCommand::kindToString(EventCommandKind::StartShopMenu));
    ui->pushButtonRestockShop->setText(EventCommand::kindToString(EventCommandKind::RestockShop));
    ui->pushButtonEnterANameMenu->setText(EventCommand::kindToString(EventCommandKind::EnterANameMenu));
    ui->pushButtonCreateObjectInMap->setText(EventCommand::kindToString(EventCommandKind::CreateObjectInMap));
    ui->pushButtonChangeStatus->setText(EventCommand::kindToString(EventCommandKind::ChangeStatus));
    ui->pushButtonResetCamera->setText(EventCommand::kindToString(EventCommandKind::ResetCamera));
    ui->pushButtonChangeBattleMusic->setText(EventCommand::kindToString(EventCommandKind::ChangeBattleMusic));
    ui->pushButtonChangeVictoryMusic->setText(EventCommand::kindToString(EventCommandKind::ChangeVictoryMusic));
    ui->pushButtonForceAction->setText(EventCommand::kindToString(EventCommandKind::ForceAnAction));
    ui->pushButtonChangeMapProperties->setText(EventCommand::kindToString(EventCommandKind::ChangeMapProperties));
    ui->pushButtonChangeExperienceCurve->setText(EventCommand::kindToString(EventCommandKind::ChangeExperienceCurve));
    ui->pushButtonChangeClass->setText(EventCommand::kindToString(EventCommandKind::ChangeClass));
    ui->pushButtonChangeChronometer->setText(EventCommand::kindToString(EventCommandKind::ChangeChronometer));
    ui->groupBoxTeam->setTitle(RPM::translate(Translations::TEAM));
    ui->groupBoxTime->setTitle(RPM::translate(Translations::TIME));
    ui->groupBoxMedia->setTitle(RPM::translate(Translations::MEDIA));
    ui->groupBoxMenus->setTitle(RPM::translate(Translations::MENUS));
    ui->groupBoxMusics->setTitle(RPM::translate(Translations::MUSICS));
    ui->groupBoxSyntax->setTitle(RPM::translate(Translations::SYNTAX));
    ui->groupBoxBattles->setTitle(RPM::translate(Translations::BATTLES));
    ui->groupBoxDialogs->setTitle(RPM::translate(Translations::DIALOGS));
    ui->groupBoxAdvanced->setTitle(RPM::translate(Translations::ADVANCED));
    ui->groupBoxVariables->setTitle(RPM::translate(Translations::VARIABLES));
    ui->groupBoxMusicsSounds->setTitle(RPM::translate(Translations
        ::MUSICS_SOUNDS));
    ui->groupBoxHeroesEnemies->setTitle(RPM::translate(Translations
        ::HEROES_ENEMIES));
    ui->groupBoxVisualEffects->setTitle(RPM::translate(Translations
        ::VISUAL_EFFECTS));
    ui->groupBoxSystemParameters->setTitle(RPM::translate(Translations
        ::SYSTEM_PARAMETERS));
    ui->groupBoxObjectsInteractions->setTitle(RPM::translate(Translations
        ::OBJETS_INTERACTIONS));
    ui->groupBoxMoveAnimationsCamera->setTitle(RPM::translate(Translations
        ::MOVES_ANIMATIONS_CAMERA));
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

// -------------------------------------------------------

void DialogCommands::on_pushButtonLabel_clicked()
{
    this->openDialogCommand(EventCommandKind::Label);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonJumpLabel_clicked()
{
    this->openDialogCommand(EventCommandKind::JumpLabel);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonComment_clicked()
{
    this->openDialogCommand(EventCommandKind::Comment);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeStatistic_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeAStatistic);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeSkill_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeASkill);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeName_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeName);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeEquiment_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeEquipment);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonModifyCurrency_clicked()
{
    this->openDialogCommand(EventCommandKind::ModifyCurrency);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonDisplayAnimation_clicked()
{
    this->openDialogCommand(EventCommandKind::DisplayAnAnimation);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonShakeScreen_clicked()
{
    this->openDialogCommand(EventCommandKind::ShakeScreen);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonFlashScreen_clicked()
{
    this->openDialogCommand(EventCommandKind::FlashScreen);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonPlugin_clicked()
{
    this->openDialogCommand(EventCommandKind::Plugin);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonStartShopMenu_clicked()
{
    this->openDialogCommand(EventCommandKind::StartShopMenu);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonRestockShop_clicked()
{
    this->openDialogCommand(EventCommandKind::RestockShop);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonEnterANameMenu_clicked()
{
    this->openDialogCommand(EventCommandKind::EnterANameMenu);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonCreateObjectInMap_clicked()
{
    this->openDialogCommand(EventCommandKind::CreateObjectInMap);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeStatus_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeStatus);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonResetCamera_clicked()
{
    this->openNonDialogCommand(EventCommandKind::ResetCamera);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeBattleMusic_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeBattleMusic);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeVictoryMusic_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeVictoryMusic);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonEndBattle_clicked()
{
    this->openNonDialogCommand(EventCommandKind::EndBattle);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonForceAction_clicked()
{
    this->openDialogCommand(EventCommandKind::ForceAnAction);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeMapProperties_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeMapProperties);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeExperienceCurve_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeExperienceCurve);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeClass_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeClass);
}

// -------------------------------------------------------

void DialogCommands::on_pushButtonChangeChronometer_clicked()
{
    this->openDialogCommand(EventCommandKind::ChangeChronometer);
}
