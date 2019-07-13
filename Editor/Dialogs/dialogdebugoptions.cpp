/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    ui->checkBoxBB->setChecked(RPM::get()->project()->gameDatas()
                               ->systemDatas()->showBB());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogDebugOptions::on_checkBoxBB_toggled(bool checked) {
    RPM::get()->project()->gameDatas()->systemDatas()->setShowBB(checked);
}
