/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemcreateparameter.h"
#include "ui_dialogsystemcreateparameter.h"
#include "rpm.h"

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

    this->translate();
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

//-------------------------------------------------

void DialogSystemCreateParameter::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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
