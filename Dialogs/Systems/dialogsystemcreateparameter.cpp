/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystemcreateparameter.h"
#include "ui_dialogsystemcreateparameter.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCreateParameter::DialogSystemCreateParameter(
        SystemCreateParameter &param,
        QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCreateParameter),
    m_param(param)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemCreateParameter::~DialogSystemCreateParameter()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCreateParameter::initialize(){
    ui->lineEditName->setText(m_param.name());
    ui->widgetDefaultValue->initializeModel(m_param.defaultValue());
    ui->widgetDefaultValue->initializePrimitives();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemCreateParameter::on_lineEditName_textChanged(const QString &
                                                              text)
{
    m_param.setName(text);
}
