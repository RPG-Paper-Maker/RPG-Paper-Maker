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
#include "systemcustomstructureelement.h"
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
    m_previousName(parameter.name())
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
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
    // Keep space when hiding widgets
    QSizePolicy sp_retain;
    sp_retain = ui->treeView->sizePolicy();
    sp_retain.setRetainSizeWhenHidden(true);
    ui->treeView->setSizePolicy(sp_retain);

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
    connect(ui->panelPrimitiveDefaultValue, SIGNAL(kindUpdated(
        PrimitiveValueKind)), this, SLOT(on_kindUpdated(PrimitiveValueKind)));
    ui->panelPrimitiveDefaultValue->initializeAllAndUpdate(m_parameter
        .defaultValue());
    this->on_kindUpdated(ui->panelPrimitiveDefaultValue->model()->kind());
    ui->lineEditName->setFocus();
}

// -------------------------------------------------------

void DialogSystemPluginParameter::translate()
{
    this->setWindowTitle(RPM::translate(Translations::PARAMETER) + RPM
        ::DOT_DOT_DOT);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelDescription->setText(RPM::translate(Translations::DESCRIPTION) +
        RPM::COLON);
    ui->labelDefaultValue->setText(RPM::translate(m_parameter.isDefault() ?
        Translations::DEFAULT_VALUE : Translations::VALUE));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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
            ::WARNING), RPM::translate(Translations
            ::THE_PLUGIN_PARAMETER_NAME_EMPTY) + RPM::DOT);
        return;
    }
    if (m_previousName != m_parameter.name() && SuperListItem::containsName(RPM
        ::get()->selectedList(), m_parameter.name()))
    {
        QMessageBox::information(nullptr, RPM::translate(Translations
            ::WARNING), RPM::translate(Translations
            ::THIS_PLUGIN_PARAMETER_NAME_ALREADY_EXISTS) + RPM::DOT);
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

void DialogSystemPluginParameter::on_kindUpdated(PrimitiveValueKind kind)
{
    switch (kind)
    {
    case PrimitiveValueKind::CustomStructure:
    case PrimitiveValueKind::CustomList:
        ui->treeView->setVisible(true);
        ui->treeView->initializeNodes(ui->panelPrimitiveDefaultValue->model());
        break;
    default:
        ui->treeView->setVisible(false);
        break;
    }
}
