/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsysteminitialpartymember.h"
#include "ui_dialogsysteminitialpartymember.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemInitialPartyMember::DialogSystemInitialPartyMember(
    SystemInitialPartyMember &model, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemInitialPartyMember),
    m_model(model)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemInitialPartyMember::~DialogSystemInitialPartyMember()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemInitialPartyMember::initialize()
{

}

//-------------------------------------------------

void DialogSystemInitialPartyMember::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_INITIAL_PARTY_MEMBERS)
        + RPM::DOT_DOT_DOT);

    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
