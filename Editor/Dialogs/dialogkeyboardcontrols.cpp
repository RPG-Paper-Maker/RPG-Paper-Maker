/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogkeyboardcontrols.h"
#include "ui_dialogkeyboardcontrols.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogKeyBoardControls::DialogKeyBoardControls(Project* project,
                                               EngineSettings *settings,
                                               QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogKeyBoardControls),
    m_gameKeyBoardDatas(project->keyBoardDatas()),
    m_canUpdateKey(false)
{
    ui->setupUi(this);
    

    // Engine keyBoard
    ui->treeViewEngine->initializeModel(settings->keyBoardDatas()->model());
    ui->treeViewEngine->setColumnWidth(0,150);
    ui->treeViewEngine->setColumnWidth(1,150);
    ui->treeViewEngine->setCanMove(false);
    ui->treeViewEngine->setHasContextMenu(false);

    // Game keyboard
    ui->treeViewGame->initializeModel(m_gameKeyBoardDatas->model());
    ui->treeViewGame->initializeNewItemInstance(new SystemKeyBoard);
    ui->treeViewGame->setUpdateId(true);
    ui->treeViewGame->setColumnWidth(0,150);
    ui->treeViewGame->setColumnWidth(1,150);
    connect(ui->treeViewGame,
            SIGNAL(needsUpdateJson(SuperListItem*)), this,
            SLOT(on_updateJsonGame(SuperListItem*)));
    m_gameKeyBoardDatas->model()->appendRow(SuperListItem::getEmptyItem());

    // Menu controls
    updateMenuControls();

    this->translate();
}

DialogKeyBoardControls::~DialogKeyBoardControls()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogKeyBoardControls::updateMenuControls(){
    m_canUpdateKey = false;

    // Updating combobox
    ui->comboBoxAction->clear();
    ui->comboBoxCancel->clear();
    ui->comboBoxUp->clear();
    ui->comboBoxDown->clear();
    ui->comboBoxLeft->clear();
    ui->comboBoxRight->clear();
    SuperListItem::fillComboBox(ui->comboBoxAction,
                                m_gameKeyBoardDatas->model());
    SuperListItem::fillComboBox(ui->comboBoxCancel,
                                m_gameKeyBoardDatas->model());
    SuperListItem::fillComboBox(ui->comboBoxUp,
                                m_gameKeyBoardDatas->model());
    SuperListItem::fillComboBox(ui->comboBoxDown,
                                m_gameKeyBoardDatas->model());
    SuperListItem::fillComboBox(ui->comboBoxLeft,
                                m_gameKeyBoardDatas->model());
    SuperListItem::fillComboBox(ui->comboBoxRight,
                                m_gameKeyBoardDatas->model());

    // Setting index
    ui->comboBoxAction->setCurrentIndex(
                SuperListItem::getIndexById(m_gameKeyBoardDatas->model()
                                            ->invisibleRootItem(),
                                            m_gameKeyBoardDatas->keyAction()));
    ui->comboBoxCancel->setCurrentIndex(
                SuperListItem::getIndexById(m_gameKeyBoardDatas->model()
                                            ->invisibleRootItem(),
                                            m_gameKeyBoardDatas->keyCancel()));
    ui->comboBoxUp->setCurrentIndex(
                SuperListItem::getIndexById(m_gameKeyBoardDatas->model()
                                            ->invisibleRootItem(),
                                            m_gameKeyBoardDatas->keyUp()));
    ui->comboBoxDown->setCurrentIndex(
                SuperListItem::getIndexById(m_gameKeyBoardDatas->model()
                                            ->invisibleRootItem(),
                                            m_gameKeyBoardDatas->keyDown()));
    ui->comboBoxLeft->setCurrentIndex(
                SuperListItem::getIndexById(m_gameKeyBoardDatas->model()
                                            ->invisibleRootItem(),
                                            m_gameKeyBoardDatas->keyLeft()));
    ui->comboBoxRight->setCurrentIndex(
                SuperListItem::getIndexById(m_gameKeyBoardDatas->model()
                                            ->invisibleRootItem(),
                                            m_gameKeyBoardDatas->keyRight()));

    m_canUpdateKey = true;
}

// -------------------------------------------------------

void DialogKeyBoardControls::translate() {
    this->setWindowTitle(RPM::translate(Translations::KEYBOARD_CONTROLS) + RPM
        ::DOT_DOT_DOT);
    ui->labelUp->setText(RPM::translate(Translations::UP) + RPM::COLON);
    ui->labelDown->setText(RPM::translate(Translations::DOWN) + RPM::COLON);
    ui->labelLeft->setText(RPM::translate(Translations::LEFT) + RPM::COLON);
    ui->labelRight->setText(RPM::translate(Translations::RIGHT) + RPM::COLON);
    ui->labelAction->setText(RPM::translate(Translations::ACTION) + RPM::COLON);
    ui->labelCancel->setText(RPM::translate(Translations::CANCEL) + RPM::COLON);
    ui->groupBoxGameControls->setTitle(RPM::translate(Translations
        ::GAME_CONTROLS));
    ui->groupBoxMenuControls->setTitle(RPM::translate(Translations
        ::MENU_CONTROLS));
    ui->groupBoxEngineControls->setTitle(RPM::translate(Translations
        ::ENGINE_CONTROLS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogKeyBoardControls::on_comboBoxAction_currentIndexChanged(int index){
    if (m_canUpdateKey){
        m_gameKeyBoardDatas->setKeyAction(
                    SuperListItem::getIdByIndex(m_gameKeyBoardDatas->model(),
                                                index));
    }
}

// -------------------------------------------------------

void DialogKeyBoardControls::on_comboBoxCancel_currentIndexChanged(int index){
    if (m_canUpdateKey){
        m_gameKeyBoardDatas->setKeyCancel(
                    SuperListItem::getIdByIndex(m_gameKeyBoardDatas->model(),
                                                index));
    }
}

// -------------------------------------------------------

void DialogKeyBoardControls::on_comboBoxUp_currentIndexChanged(int index){
    if (m_canUpdateKey){
        m_gameKeyBoardDatas->setKeyUp(
                    SuperListItem::getIdByIndex(m_gameKeyBoardDatas->model(),
                                                index));
    }
}

// -------------------------------------------------------

void DialogKeyBoardControls::on_comboBoxDown_currentIndexChanged(int index){
    if (m_canUpdateKey){
        m_gameKeyBoardDatas->setKeyDown(
                    SuperListItem::getIdByIndex(m_gameKeyBoardDatas->model(),
                                                index));
    }
}

// -------------------------------------------------------

void DialogKeyBoardControls::on_comboBoxLeft_currentIndexChanged(int index){
    if (m_canUpdateKey){
        m_gameKeyBoardDatas->setKeyLeft(
                    SuperListItem::getIdByIndex(m_gameKeyBoardDatas->model(),
                                                index));
    }
}

// -------------------------------------------------------

void DialogKeyBoardControls::on_comboBoxRight_currentIndexChanged(int index){
    if (m_canUpdateKey){
        m_gameKeyBoardDatas->setKeyRight(
                    SuperListItem::getIdByIndex(m_gameKeyBoardDatas->model(),
                                                index));
    }
}

// -------------------------------------------------------

void DialogKeyBoardControls::on_updateJsonGame(SuperListItem*){
    updateMenuControls();
}
