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

#include "dialogkeyboardcontrols.h"
#include "ui_dialogkeyboardcontrols.h"

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
    QStandardItem* item = new QStandardItem;
    item->setText(SuperListItem::beginningText);
    m_gameKeyBoardDatas->model()->appendRow(item);

    // Menu controls
    updateMenuControls();
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
