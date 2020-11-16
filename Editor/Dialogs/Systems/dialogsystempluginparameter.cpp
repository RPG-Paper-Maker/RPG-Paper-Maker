/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystempluginparameter.h"
#include "ui_dialogsystempluginparameter.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemPluginParameter::DialogSystemPluginParameter(SystemPluginParameter
    &parameter, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemPluginParameter),
    m_parameter(parameter)
{
    ui->setupUi(this);

    this->initialize();
}

DialogSystemPluginParameter::~DialogSystemPluginParameter()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemPluginParameter::initialize()
{
    ui->lineEditName->setText(m_parameter.name());
    ui->lineEditDescription->setText(m_parameter.description());
    ui->panelPrimitiveDefaultValue->initializeAllAndUpdate(m_parameter
        .defaultValue());
}

// -------------------------------------------------------

void DialogSystemPluginParameter::on_lineEditName_textEdited(const QString &text)
{
    m_parameter.setName(text);
}

// -------------------------------------------------------

void DialogSystemPluginParameter::on_lineEditDescription_textEdited(const
    QString &text)
{
    m_parameter.setDescription(text);
}
