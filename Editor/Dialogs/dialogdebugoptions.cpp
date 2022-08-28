/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogdebugoptions.h"
#include "ui_dialogdebugoptions.h"
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
}

// -------------------------------------------------------

void DialogDebugOptions::translate() {
    this->setWindowTitle(RPM::translate(Translations::DEBUG_OPTIONS) + RPM
        ::DOT_DOT_DOT);
    ui->checkBoxBB->setText(RPM::translate(Translations::SHOW_COLLISIONS_BB));
    ui->checkBoxShowFPS->setText(RPM::translate(Translations::SHOW_FPS));
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
