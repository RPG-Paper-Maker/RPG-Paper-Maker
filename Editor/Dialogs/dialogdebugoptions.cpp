/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include "dialogdebugoptions.h"
#include "ui_dialogdebugoptions.h"
#include "mainwindow.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogDebugOptions::DialogDebugOptions(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogDebugOptions)
{
    ui->setupUi(this);
    initialize();
    this->translate();
}

DialogDebugOptions::~DialogDebugOptions()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogDebugOptions::initialize() {
    ui->checkBoxBB->setChecked(RPM::get()->project()->gameDatas()->systemDatas()->showBB());
    ui->checkBoxShowFPS->setChecked(RPM::get()->project()->gameDatas()->systemDatas()->showFPS());
    ui->checkBoxBackupsActivated->setChecked(RPM::get()->project()->gameDatas()->systemDatas()->backupsActivated());
}

// -------------------------------------------------------

void DialogDebugOptions::translate() {
    this->setWindowTitle(RPM::translate(Translations::DEBUG_OPTIONS) + RPM
        ::DOT_DOT_DOT);
    ui->checkBoxBB->setText(RPM::translate(Translations::SHOW_COLLISIONS_BB));
    ui->checkBoxShowFPS->setText(RPM::translate(Translations::SHOW_FPS));
    ui->checkBoxBackupsActivated->setText(RPM::translate(Translations::ACTIVATED));
    ui->pushButtonSyncMapObjects->setText(RPM::translate(Translations::SYNCHRONIZE_MAP_OBJECTS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogDebugOptions::on_checkBoxBB_toggled(bool checked) {
    RPM::get()->project()->gameDatas()->systemDatas()->setShowBB(checked);
}

// -------------------------------------------------------

void DialogDebugOptions::on_checkBoxShowFPS_toggled(bool checked)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setShowFPS(checked);
}

// -------------------------------------------------------

void DialogDebugOptions::on_checkBoxBackupsActivated_toggled(bool checked)
{
    RPM::get()->project()->gameDatas()->systemDatas()->setBackupsActivated(checked);
}

// -------------------------------------------------------

void DialogDebugOptions::on_pushButtonSyncMapObjects_clicked() {
    Map *map = RPM::get()->project()->currentMap(true);
    if (map != nullptr) {
        map->syncObjects();
        MainWindow::get()->on_actionSave_triggered();
        MainWindow::get()->updateTextures();
        QMessageBox::information(nullptr, RPM::translate(Translations::SUCCESS),
            RPM::translate(Translations::SUCCESS) + "!");
    }
}
