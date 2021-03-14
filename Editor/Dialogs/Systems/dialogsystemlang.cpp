/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemlang.h"
#include "ui_dialogsystemlang.h"
#include "rpm.h"

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
    this->initialize();
    this->translate();
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

void DialogSystemLang::initialize()
{

}

//-------------------------------------------------

void DialogSystemLang::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_NAME) + RPM
        ::DOT_DOT_DOT);
    ui->labelAll->setText(RPM::translate(Translations::ALL) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemLang::on_lineEditAll_textEdited(const QString &text)
{
    m_model.setAllNames(text);
}
