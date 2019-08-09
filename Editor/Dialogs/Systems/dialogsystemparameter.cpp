/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemparameter.h"
#include "ui_dialogsystemparameter.h"
#include "rpm.h"

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
    ui->widgetValue->initializeParameterEvent(RPM::get()->project()
        ->currentObject() == nullptr ? nullptr : RPM::get()->project()
        ->currentObject()->modelProperties());
}
