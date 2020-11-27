/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include "dialogsystemcustomstructureelement.h"
#include "ui_dialogsystemcustomstructureelement.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCustomStructureElement::DialogSystemCustomStructureElement(
    SystemCustomStructureElement &element, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCustomStructureElement),
    m_element(element),
    m_previousName(element.name())
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemCustomStructureElement::~DialogSystemCustomStructureElement()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCustomStructureElement::initialize()
{
    if (m_element.isProperty())
    {
        ui->lineEditKey->setText(m_element.name());
        ui->lineEditDescription->setText(m_element.description());
    } else
    {
        ui->labelKey->hide();
        ui->lineEditKey->hide();
        ui->labelDescription->hide();
        ui->lineEditDescription->hide();
    }
    ui->panelPrimitiveValue->initializeAllAndUpdate(m_element.value());
}

// -------------------------------------------------------

void DialogSystemCustomStructureElement::translate()
{
    this->setWindowTitle(RPM::translate(Translations::ELEMENT) + RPM
        ::DOT_DOT_DOT);
    ui->labelKey->setText(RPM::translate(Translations::KEY) + RPM::COLON);
    ui->labelDescription->setText(RPM::translate(Translations::DESCRIPTION) +
        RPM::COLON);
    ui->labelValue->setText(RPM::translate(Translations::VALUE) + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCustomStructureElement::accept()
{
    if (m_element.isProperty())
    {
        if (m_element.name().isEmpty())
        {
            QMessageBox::information(nullptr, RPM::translate(Translations
                ::WARNING), "The key can't be empty.");
            return;
        }
        if (m_previousName != m_element.name() && SuperListItem::containsName(
            RPM::get()->selectedList(), m_element.name()))
        {
            QMessageBox::information(nullptr, RPM::translate(Translations
                ::WARNING), "This key already exists in your custom structure.");
            return;
        }
    }
    QDialog::accept();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemCustomStructureElement::on_lineEditKey_textEdited(const QString
    &text)
{
    m_element.setName(text);
}

// -------------------------------------------------------

void DialogSystemCustomStructureElement::on_lineEditDescription_textEdited(const
    QString &text)
{
    m_element.setDescription(text);
}
