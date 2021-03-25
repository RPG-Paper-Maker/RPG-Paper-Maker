/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialognumber.h"
#include "ui_dialognumber.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogNumber::DialogNumber(PrimitiveValue *value, QString title, QString label,
    QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogNumber),
    m_title(title),
    m_label(label),
    m_value(value)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogNumber::~DialogNumber()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogNumber::initialize()
{
    ui->panelPrimitiveNumber->initializeDataBaseAndUpdate(m_value);
}

// -------------------------------------------------------

void DialogNumber::translate()
{
    this->setWindowTitle(m_title.isEmpty() ? RPM::translate(Translations
        ::SET_NUMBER) + RPM::DOT_DOT_DOT : m_title);
    ui->label->setText(m_label.isEmpty() ? RPM::translate(Translations::NUMBER)
        + RPM::COLON : m_label);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
