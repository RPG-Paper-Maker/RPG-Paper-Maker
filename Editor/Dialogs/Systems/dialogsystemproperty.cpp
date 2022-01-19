/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemproperty.h"
#include "ui_dialogsystemproperty.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemProperty::DialogSystemProperty(SystemProperty &property, QWidget
    *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemProperty),
    m_property(property)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemProperty::~DialogSystemProperty() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemProperty::initialize()
{
    ui->lineEditName->setText(m_property.name());
    ui->panelPrimitiveValueInitial->initializeModel(m_property.initialValue());
    ui->panelPrimitiveValueInitial->initializePropertyAndUpdate(m_property
        .initialValue(), nullptr, nullptr);
}

//-------------------------------------------------

void DialogSystemProperty::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_PROPERTY) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelInitialValue->setText(RPM::translate(Translations::INITIAL_VALUE) +
        RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemProperty::on_lineEditName_textEdited(const QString &text) {
    m_property.setName(text);
}
