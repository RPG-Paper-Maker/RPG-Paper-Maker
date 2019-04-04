/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystemparameter.h"
#include "ui_dialogsystemparameter.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemParameter::DialogSystemParameter(SystemParameter &param,
                                             QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemParameter),
    m_param(param)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemParameter::~DialogSystemParameter()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemParameter::initialize(){
    ui->widgetValue->initializeModel(m_param.value());
    ui->widgetValue->initializeParameterEvent();
}
