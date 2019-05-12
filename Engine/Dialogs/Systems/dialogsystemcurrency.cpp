/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystemcurrency.h"
#include "ui_dialogsystemcurrency.h"

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
