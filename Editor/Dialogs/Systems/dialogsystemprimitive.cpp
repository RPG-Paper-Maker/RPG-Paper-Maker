/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemprimitive.h"
#include "ui_dialogsystemprimitive.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemPrimitive::DialogSystemPrimitive(SystemPrimitive &prim, QWidget
    *parent) :
    QDialog(parent),
    m_prim(prim),
    ui(new Ui::DialogSystemPrimitive)
{
    ui->setupUi(this);

    this->translate();
}

DialogSystemPrimitive::~DialogSystemPrimitive() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemPrimitive::initializeNumberVariableDouble(QString title) {
    this->setWindowTitle(title);
    ui->widget->initializeNumberAndUpdate(m_prim.prim(), false);
}

//-------------------------------------------------

void DialogSystemPrimitive::translate()
{
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
