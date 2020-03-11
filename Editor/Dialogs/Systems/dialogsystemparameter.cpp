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

    this->translate();
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

void DialogSystemParameter::initialize() {
    SystemCommonObject *object;

    object = RPM::get()->project()->currentObject();
    ui->widgetValue->initializeModel(m_param.value());
    ui->widgetValue->initializeParameterEvent(object == nullptr ? nullptr :
        object->modelProperties(), RPM::get()->project()->currentParameters());
}

//-------------------------------------------------

void DialogSystemParameter::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
