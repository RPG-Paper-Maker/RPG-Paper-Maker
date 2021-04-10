/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    connect(ui->panelPrimitiveValue, SIGNAL(kindUpdated(PrimitiveValueKind)),
        this, SLOT(on_kindUpdated(PrimitiveValueKind)));
    ui->panelPrimitiveValue->initializeAllAndUpdate(m_element.value());
    ui->panelPrimitiveValueX->initializeNumberAndUpdate(m_element.value()->x());
    ui->panelPrimitiveValueY->initializeNumberAndUpdate(m_element.value()->y());
    ui->panelPrimitiveValueZ->initializeNumberAndUpdate(m_element.value()->z());
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

// -------------------------------------------------------

void DialogSystemCustomStructureElement::on_kindUpdated(PrimitiveValueKind kind)
{
    ui->labelX->setVisible(false);
    ui->labelY->setVisible(false);
    ui->labelZ->setVisible(false);
    ui->panelPrimitiveValueX->setVisible(false);
    ui->panelPrimitiveValueY->setVisible(false);
    ui->panelPrimitiveValueZ->setVisible(false);
    switch (kind)
    {
    case PrimitiveValueKind::Vector2:
        ui->labelX->setVisible(true);
        ui->labelY->setVisible(true);
        ui->panelPrimitiveValueX->setVisible(true);
        ui->panelPrimitiveValueY->setVisible(true);
        break;
    case PrimitiveValueKind::Vector3:
        ui->labelX->setVisible(true);
        ui->labelY->setVisible(true);
        ui->labelZ->setVisible(true);
        ui->panelPrimitiveValueX->setVisible(true);
        ui->panelPrimitiveValueY->setVisible(true);
        ui->panelPrimitiveValueZ->setVisible(true);
        break;
    default:
        break;
    }
}
