/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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

    // Primitives
    ui->panelPrimitiveDefaultValue->initializeAllAndUpdate(m_parameter
        .defaultValue());
    ui->panelPrimitiveValueX->initializeNumberAndUpdate(ui->panelPrimitiveDefaultValue->model()->x());
    ui->panelPrimitiveValueY->initializeNumberAndUpdate(ui->panelPrimitiveDefaultValue->model()->y());
    ui->panelPrimitiveValueZ->initializeNumberAndUpdate(ui->panelPrimitiveDefaultValue->model()->z());

    // Min + max
    if (m_parameter.defaultValue()->isMinActivated())
    {
        ui->spinBoxMin->setValue(m_parameter.defaultValue()->min());
        ui->checkBoxMin->setChecked(true);
    }
    if (m_parameter.defaultValue()->isMaxActivated())
    {
        ui->spinBoxMax->setValue(m_parameter.defaultValue()->max());
        ui->checkBoxMax->setChecked(true);
    }

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
        Translations::DEFAULT_VALUE : Translations::VALUE) + RPM::COLON);
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
    ui->treeView->setVisible(false);
    ui->labelX->setVisible(false);
    ui->labelY->setVisible(false);
    ui->labelZ->setVisible(false);
    ui->panelPrimitiveValueX->setVisible(false);
    ui->panelPrimitiveValueY->setVisible(false);
    ui->panelPrimitiveValueZ->setVisible(false);
    ui->checkBoxMin->setVisible(false);
    ui->checkBoxMax->setVisible(false);
    ui->spinBoxMin->setVisible(false);
    ui->spinBoxMax->setVisible(false);
    switch (kind)
    {
    case PrimitiveValueKind::CustomStructure:
    case PrimitiveValueKind::CustomList:
        ui->treeView->setVisible(true);
        ui->treeView->initializeNodes(ui->panelPrimitiveDefaultValue->model());
        break;
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
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::NumberDouble:
        ui->checkBoxMin->setVisible(true);
        ui->checkBoxMax->setVisible(true);
        ui->spinBoxMin->setVisible(true);
        ui->spinBoxMax->setVisible(true);
        break;
    default:
        break;
    }
}

// -------------------------------------------------------

void DialogSystemPluginParameter::on_checkBoxMin_toggled(bool checked)
{
    ui->panelPrimitiveDefaultValue->updateMin(checked ? ui->spinBoxMin->value() : -QWIDGETSIZE_MAX);
    ui->spinBoxMin->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemPluginParameter::on_checkBoxMax_toggled(bool checked)
{
    ui->panelPrimitiveDefaultValue->updateMax(checked ? ui->spinBoxMax->value() : QWIDGETSIZE_MAX);
    ui->spinBoxMax->setEnabled(checked);
}

// -------------------------------------------------------

void DialogSystemPluginParameter::on_spinBoxMin_valueChanged(int i)
{
    ui->panelPrimitiveDefaultValue->updateMin(i);
}

// -------------------------------------------------------

void DialogSystemPluginParameter::on_spinBoxMax_valueChanged(int i)
{
    ui->panelPrimitiveDefaultValue->updateMax(i);
}
