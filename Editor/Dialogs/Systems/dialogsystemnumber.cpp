/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemnumber.h"
#include "ui_dialogsystemnumber.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemNumber::DialogSystemNumber(SystemNumber &model, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemNumber),
    m_model(model)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemNumber::~DialogSystemNumber()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemNumber::initialize()
{
    ui->panelPrimitiveValue->initializeNumberAndUpdate(m_model.value());
}

//-------------------------------------------------

void DialogSystemNumber::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_NUMBER) + RPM
        ::DOT_DOT_DOT);
    ui->labelValue->setText(RPM::translate(Translations::VALUE) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
