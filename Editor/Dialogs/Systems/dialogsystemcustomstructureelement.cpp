/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemcustomstructureelement.h"
#include "ui_dialogsystemcustomstructureelement.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCustomStructureElement::DialogSystemCustomStructureElement(
    SystemCustomStructureElement &element, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCustomStructureElement),
    m_element(element)
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
