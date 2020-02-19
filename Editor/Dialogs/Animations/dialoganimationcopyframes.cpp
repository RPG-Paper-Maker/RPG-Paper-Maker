/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialoganimationcopyframes.h"
#include "ui_dialoganimationcopyframes.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogAnimationCopyFrames::DialogAnimationCopyFrames(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogAnimationCopyFrames)
{
    ui->setupUi(this);
}

DialogAnimationCopyFrames::~DialogAnimationCopyFrames() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int DialogAnimationCopyFrames::from() const {
    return ui->spinBoxFrom->value();
}

// -------------------------------------------------------

int DialogAnimationCopyFrames::to() const {
    return ui->spinBoxTo->value();
}

// -------------------------------------------------------

int DialogAnimationCopyFrames::paste() const {
    return ui->spinBoxPaste->value();
}
