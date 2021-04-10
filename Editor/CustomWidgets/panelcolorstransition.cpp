/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelcolorstransition.h"
#include "ui_panelcolorstransition.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelColorsTransition::PanelColorsTransition(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelColorsTransition)
{
    ui->setupUi(this);
}

PanelColorsTransition::~PanelColorsTransition()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelColorsTransition::initializePrimitives(QStandardItemModel *properties,
    QStandardItemModel *parameters)
{
    m_properties = properties;
    m_parameters = parameters;
    ui->panelPrimitiveRed->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveGreen->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveBlue->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveGrey->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveColor->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), m_parameters, m_properties);

    // Connections
    connect(ui->panelPrimitiveRed->spinBoxNumber(), SIGNAL(valueChanged(
        int)), this, SLOT(on_spinBoxRedValueChanged(int)));
    connect(ui->panelPrimitiveGreen->spinBoxNumber(), SIGNAL(valueChanged(
        int)), this, SLOT(on_spinBoxGreenValueChanged(int)));
    connect(ui->panelPrimitiveBlue->spinBoxNumber(), SIGNAL(valueChanged(
        int)), this, SLOT(on_spinBoxBlueValueChanged(int)));
    connect(ui->panelPrimitiveGrey->spinBoxNumber(), SIGNAL(valueChanged(
        int)), this, SLOT(on_spinBoxGreyValueChanged(int)));
}

//-------------------------------------------------

void PanelColorsTransition::translate()
{
    ui->labelRed->setText(RPM::translate(Translations::RED) + RPM::COLON);
    ui->labelBlue->setText(RPM::translate(Translations::BLUE) + RPM::COLON);
    ui->labelGrey->setText(RPM::translate(Translations::GREY) + RPM::COLON);
    ui->labelGreen->setText(RPM::translate(Translations::GREEN) + RPM::COLON);
    ui->checkBoxColor->setText(RPM::translate(Translations::ADDING_COLOR_ID) +
        RPM::COLON);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void PanelColorsTransition::initialize(EventCommand *command, int &i)
{
    ui->panelPrimitiveRed->initializeCommand(command, i);
    ui->panelPrimitiveGreen->initializeCommand(command, i);
    ui->panelPrimitiveBlue->initializeCommand(command, i);
    ui->panelPrimitiveGrey->initializeCommand(command, i);
    if (RPM::stringToBool(command->valueCommandAt(i++))) {
        ui->checkBoxColor->setChecked(true);
        ui->comboBoxColor->setCurrentIndex(command->valueCommandAt(i++).toInt());
        ui->panelPrimitiveColor->initializeCommand(command, i);
    }
}

// -------------------------------------------------------

void PanelColorsTransition::getCommand(QVector<QString> &command) const
{
    bool checked;

    ui->panelPrimitiveRed->getCommand(command);
    ui->panelPrimitiveGreen->getCommand(command);
    ui->panelPrimitiveBlue->getCommand(command);
    ui->panelPrimitiveGrey->getCommand(command);
    checked = ui->checkBoxColor->isChecked();
    command.append(RPM::boolToString(checked));
    if (checked) {
        command.append(QString::number(ui->comboBoxColor->currentIndex()));
        ui->panelPrimitiveColor->getCommand(command);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelColorsTransition::on_checkBoxColor_toggled(bool checked) {
    ui->comboBoxColor->setEnabled(checked);
    ui->panelPrimitiveColor->setEnabled(checked);
}

// -------------------------------------------------------

void PanelColorsTransition::on_spinBoxRedValueChanged(int value) {
    ui->horizontalSliderRed->setValue(value);
}

// -------------------------------------------------------

void PanelColorsTransition::on_horizontalSliderRed_valueChanged(int
    value)
{
    ui->panelPrimitiveRed->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveRed->setNumberValue(value);
}

// -------------------------------------------------------

void PanelColorsTransition::on_spinBoxGreenValueChanged(int value) {
    ui->horizontalSliderGreen->setValue(value);
}

// -------------------------------------------------------

void PanelColorsTransition::on_horizontalSliderGreen_valueChanged(int
    value)
{
    ui->panelPrimitiveGreen->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveGreen->setNumberValue(value);
}

// -------------------------------------------------------

void PanelColorsTransition::on_spinBoxBlueValueChanged(int value) {
    ui->horizontalSliderBlue->setValue(value);
}

// -------------------------------------------------------

void PanelColorsTransition::on_horizontalSliderBlue_valueChanged(int
    value)
{
    ui->panelPrimitiveBlue->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveBlue->setNumberValue(value);
}

// -------------------------------------------------------

void PanelColorsTransition::on_spinBoxGreyValueChanged(int value) {
    ui->horizontalSliderGrey->setValue(value);
}

// -------------------------------------------------------

void PanelColorsTransition::on_horizontalSliderGrey_valueChanged(int
    value)
{
    ui->panelPrimitiveGrey->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveGrey->setNumberValue(value);
}
