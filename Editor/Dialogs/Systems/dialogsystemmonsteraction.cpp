/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemmonsteraction.h"
#include "ui_dialogsystemmonsteraction.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemMonsterAction::DialogSystemMonsterAction(SystemMonsterAction &action
    , QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemMonsterAction),
    m_monsterAction(action)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemMonsterAction::~DialogSystemMonsterAction()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemMonsterAction::initialize()  {
    ui->panelPrimitiveValueItemID->initializeDataBaseAndUpdate(m_monsterAction
        .itemID());
}

// -------------------------------------------------------

void DialogSystemMonsterAction::translate() {
    this->setWindowTitle(RPM::translate(Translations::ACTION) + RPM::DOT_DOT_DOT);

    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
