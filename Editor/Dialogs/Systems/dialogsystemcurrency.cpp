/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemcurrency.h"
#include "ui_dialogsystemcurrency.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCurrency::DialogSystemCurrency(SystemCurrency &currency, QWidget
    *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCurrency),
    m_currency(currency)
{
    ui->setupUi(this);
    
    initialize();

    this->translate();
}

DialogSystemCurrency::~DialogSystemCurrency()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCurrency::initialize(){
    ui->widgetName->initializeNamesLang(&m_currency);
    ui->widgetIcon->initializeIcon(&m_currency);
}

//-------------------------------------------------

void DialogSystemCurrency::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_CURRENCY) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
