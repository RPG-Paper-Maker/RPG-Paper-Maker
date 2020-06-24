/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemfontsize.h"
#include "ui_dialogsystemfontsize.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemFontSize::DialogSystemFontSize(SystemFontSize &fontSize, QWidget
    *parent) :
    QDialog(parent),
    m_fontSize(fontSize),
    ui(new Ui::DialogSystemFontSize)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemFontSize::~DialogSystemFontSize() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemFontSize::initialize() {
    ui->lineEditName->setText(m_fontSize.name());
    ui->panelPrimitiveSize->initializeNumberAndUpdate(m_fontSize.size());
}

//-------------------------------------------------

void DialogSystemFontSize::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_FONT_SIZE) + RPM
        ::DOT_DOT_DOT);
    ui->labelSize->setText(RPM::translate(Translations::SIZE) + RPM::COLON);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
