/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystemlang.h"
#include "ui_dialogsystemlang.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemLang::DialogSystemLang(SystemLang &model, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemLang),
    m_model(model)
{
    ui->setupUi(this);
    
    initialize();
}

DialogSystemLang::~DialogSystemLang()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemLang::initialize(){
    ui->widgetName->initializeNamesLang(&m_model);
}
