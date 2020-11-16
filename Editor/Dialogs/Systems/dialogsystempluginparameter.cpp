/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include "dialogsystempluginparameter.h"
#include "ui_dialogsystempluginparameter.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemPluginParameter::DialogSystemPluginParameter(SystemPluginParameter
    &parameter, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemPluginParameter),
    m_parameter(parameter),
    m_previousName(parameter.name()),
    m_completeList(RPM::get()->selectedList())
{
    ui->setupUi(this);

    this->initialize();
}

DialogSystemPluginParameter::~DialogSystemPluginParameter()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemPluginParameter::initialize()
{
    if (m_parameter.isDefault())
    {
        ui->lineEditName->setText(m_parameter.name());
        ui->lineEditDescription->setText(m_parameter.description());
        ui->labelNameValue->hide();
        ui->labelDescriptionValue->hide();
    } else
    {
        ui->labelNameValue->setText(m_parameter.name());
        ui->labelDescriptionValue->setText(m_parameter.description());
        ui->lineEditName->hide();
        ui->lineEditDescription->hide();
    }
    ui->panelPrimitiveDefaultValue->initializeAllAndUpdate(m_parameter
        .defaultValue());
    connect(ui->panelPrimitiveDefaultValue->widgetCustomStructure(), SIGNAL(
        windowClosed()), this, SLOT(on_widgetCustomStructureListClosed()));
    connect(ui->panelPrimitiveDefaultValue->widgetCustomList(), SIGNAL(
        windowClosed()), this, SLOT(on_widgetCustomStructureListClosed()));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemPluginParameter::accept()
{
    if (m_parameter.name().isEmpty())
    {
        QMessageBox::information(nullptr, RPM::translate(Translations
            ::WARNING), "The plugin parameter name can't be empty.");
        return;
    }
    if (m_previousName != m_parameter.name() && SuperListItem::containsName(RPM
        ::get()->selectedList(), m_parameter.name()))
    {
        QMessageBox::information(nullptr, RPM::translate(Translations
            ::WARNING), "This plugin parameter name already exists in your parameters list.");
        return;
    }
    QDialog::accept();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemPluginParameter::on_lineEditName_textEdited(const QString &text)
{
    m_parameter.setName(text);
}

// -------------------------------------------------------

void DialogSystemPluginParameter::on_lineEditDescription_textEdited(const
    QString &text)
{
    m_parameter.setDescription(text);
}

// -------------------------------------------------------

void DialogSystemPluginParameter::on_widgetCustomStructureListClosed()
{
    RPM::get()->setSelectedList(m_completeList);
}
