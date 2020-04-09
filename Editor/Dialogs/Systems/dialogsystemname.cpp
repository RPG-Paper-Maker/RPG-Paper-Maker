/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemname.h"
#include "ui_dialogsystemname.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemName::DialogSystemName(SuperListItem& model, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemName),
    m_model(model)
{
    ui->setupUi(this);
    

    initialize();

    this->translate();
}

DialogSystemName::~DialogSystemName()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemName::initialize(){
    ui->lineEditName->setText(m_model.name());
}

//-------------------------------------------------

void DialogSystemName::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_NAME) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemName::on_lineEditName_textChanged(const QString &text){
    m_model.setName(text);
}
