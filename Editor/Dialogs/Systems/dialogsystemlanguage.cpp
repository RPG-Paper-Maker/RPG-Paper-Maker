/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemlanguage.h"
#include "ui_dialogsystemlanguage.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemLanguage::DialogSystemLanguage(SystemLanguage &language, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemLanguage),
    m_language(language),
    m_block(false)
{
    ui->setupUi(this);
    this->initialize();
    this->translate();
}

DialogSystemLanguage::~DialogSystemLanguage()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemLanguage::initialize()
{
    ui->lineEditName->setText(m_language.name());
    int index = static_cast<int>(m_language.kind());
    m_block = true;
    ui->comboBoxType->addItems(RPM::ENUM_TO_STRING_LANGUAGE_KIND);
    ui->comboBoxType->setCurrentIndex(index);
    m_block = false;
}

// -------------------------------------------------------

void DialogSystemLanguage::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_LANGUAGE) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelType->setText(RPM::translate(Translations::TYPE) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemLanguage::on_lineEditName_textEdited(const QString &text)
{
    m_language.setName(text);
}

// -------------------------------------------------------

void DialogSystemLanguage::on_comboBoxType_currentIndexChanged(int index)
{
    if (!m_block)
    {
        LanguageKind kind = static_cast<LanguageKind>(index);
        m_language.setKind(kind);
        ui->lineEditName->setText(kind == LanguageKind::Custom ? "Custom" : RPM
            ::get()->translations()->languagesNames().at(index - 1));
        m_language.setName(ui->lineEditName->text());
    }
}
