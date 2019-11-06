/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangescreentone.h"
#include "ui_dialogcommandchangescreentone.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeScreenTone::DialogCommandChangeScreenTone(EventCommand
    *command, SystemCommonObject *object, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    ui(new Ui::DialogCommandChangeScreenTone)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }
}

DialogCommandChangeScreenTone::~DialogCommandChangeScreenTone() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeScreenTone::initializePrimitives() {
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    ui->panelPrimitiveRed->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveGreen->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveBlue->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveGrey->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveColor->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), m_parameters, properties);
    ui->panelPrimitiveTime->initializeNumber(m_parameters, properties, false);

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

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeScreenTone::initialize(EventCommand *command) {
    int i;

    i = 0;
    ui->panelPrimitiveRed->initializeCommand(command, i);
    ui->panelPrimitiveGreen->initializeCommand(command, i);
    ui->panelPrimitiveBlue->initializeCommand(command, i);
    ui->panelPrimitiveGrey->initializeCommand(command, i);
    if (RPM::stringToBool(command->valueCommandAt(i++))) {
        ui->checkBoxColor->setChecked(true);
        ui->comboBoxColor->setCurrentIndex(command->valueCommandAt(i++).toInt());
        ui->panelPrimitiveColor->initializeCommand(command, i);
    }
    ui->checkBoxWaitEnd->setChecked(RPM::stringToBool(command->valueCommandAt(
        i++)));
    ui->panelPrimitiveTime->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandChangeScreenTone::getCommand() const{
    QVector<QString> command;
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
    command.append(RPM::boolToString(ui->checkBoxWaitEnd->isChecked()));
    ui->panelPrimitiveTime->getCommand(command);

    return new EventCommand(EventCommandKind::ChangeScreenTone, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeScreenTone::on_checkBoxColor_toggled(bool checked) {
    ui->comboBoxColor->setEnabled(checked);
    ui->panelPrimitiveColor->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeScreenTone::on_spinBoxRedValueChanged(int value) {
    ui->horizontalSliderRed->setValue(value);
}

// -------------------------------------------------------

void DialogCommandChangeScreenTone::on_horizontalSliderRed_valueChanged(int
    value)
{
    ui->panelPrimitiveRed->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveRed->setNumberValue(value);
}

// -------------------------------------------------------

void DialogCommandChangeScreenTone::on_spinBoxGreenValueChanged(int value) {
    ui->horizontalSliderGreen->setValue(value);
}

// -------------------------------------------------------

void DialogCommandChangeScreenTone::on_horizontalSliderGreen_valueChanged(int
    value)
{
    ui->panelPrimitiveGreen->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveGreen->setNumberValue(value);
}

// -------------------------------------------------------

void DialogCommandChangeScreenTone::on_spinBoxBlueValueChanged(int value) {
    ui->horizontalSliderBlue->setValue(value);
}

// -------------------------------------------------------

void DialogCommandChangeScreenTone::on_horizontalSliderBlue_valueChanged(int
    value)
{
    ui->panelPrimitiveBlue->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveBlue->setNumberValue(value);
}

// -------------------------------------------------------

void DialogCommandChangeScreenTone::on_spinBoxGreyValueChanged(int value) {
    ui->horizontalSliderGrey->setValue(value);
}

// -------------------------------------------------------

void DialogCommandChangeScreenTone::on_horizontalSliderGrey_valueChanged(int
    value)
{
    ui->panelPrimitiveGrey->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveGrey->setNumberValue(value);
}
