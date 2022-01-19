/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandchangeweather.h"
#include "ui_dialogcommandchangeweather.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeWeather::DialogCommandChangeWeather(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeWeather),
    m_properties(properties),
    m_parameters(parameters),
    m_imageValueID(new PrimitiveValue(-1))
{
    ui->setupUi(this);
    this->initializePrimitives();
    if (command != nullptr)
    {
        this->initialize(command);
    }
    this->translate();
}

DialogCommandChangeWeather::~DialogCommandChangeWeather()
{
    delete ui;
    delete m_imageValueID;
    delete m_buttonGroupMain;
    delete m_buttonGroupTexture;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeWeather::initializePrimitives()
{
    m_buttonGroupMain = new QButtonGroup;
    m_buttonGroupMain->addButton(ui->radioButtonNone);
    m_buttonGroupMain->addButton(ui->radioButtonCustom);
    m_buttonGroupTexture = new QButtonGroup;
    m_buttonGroupTexture->addButton(ui->radioButtonColor);
    m_buttonGroupTexture->addButton(ui->radioButtonImage);
    ui->radioButtonNone->setChecked(true);
    ui->panelPrimitiveColorID->initializeDataBaseCommandId(RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), m_parameters, m_properties);
    ui->widgetPictureImage->setKind(PictureKind::Particles);
    ui->widgetPictureImage->initializePrimitive(m_imageValueID, m_properties,
        m_parameters);
    ui->panelPrimitiveNumberPerPortion->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitivePortionsRay->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveSize->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveDepthTest->initializeSwitch(m_parameters, m_properties);
    ui->panelPrimitiveDepthWrite->initializeSwitch(m_parameters, m_properties);
    ui->panelPrimitiveInitialVelocity->initializeMessage(true, m_parameters, m_properties);
    ui->panelPrimitiveVelocityAddition->initializeMessage(true, m_parameters, m_properties);
    ui->panelPrimitiveInitialYRotation->initializeMessage(true, m_parameters, m_properties);
    ui->panelPrimitiveYRotationAddition->initializeMessage(true, m_parameters, m_properties);
    ui->panelPrimitiveTime->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitiveTime->setNumberDoubleValue(0);
    this->on_pushButtonRain_clicked();
}

// -------------------------------------------------------

void DialogCommandChangeWeather::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CHANGE_WEATHER) + RPM
        ::DOT_DOT_DOT);
    ui->radioButtonNone->setText(RPM::translate(Translations::NONE));
    ui->radioButtonCustom->setText(RPM::translate(Translations::CUSTOM) + RPM::COLON);
    ui->pushButtonRain->setText(RPM::translate(Translations::RAIN));
    ui->pushButtonSnow->setText(RPM::translate(Translations::SNOW));
    ui->groupBoxOptions->setTitle(RPM::translate(::Translations::OPTIONS));
    ui->labelTexture->setText(RPM::translate(Translations::TEXTURE) + RPM::COLON);
    ui->radioButtonColor->setText(RPM::translate(Translations::COLOR_ID) + RPM::COLON);
    ui->radioButtonImage->setText(RPM::translate(Translations::IMAGE) + RPM::COLON);
    ui->labelNumberPerPortion->setText(RPM::translate(Translations::NUMBER_PER_PORTION) + RPM::COLON);
    ui->labelPortionsRay->setText(RPM::translate(Translations::RAY_PORTIONS) + RPM::COLON);
    ui->labelSize->setText(RPM::translate(Translations::SIZE) + RPM::COLON);
    ui->labelInitialVelocity->setText(RPM::translate(Translations::INITIAL_VELOCITY) + RPM::COLON);
    ui->labelVelocityAddition->setText(RPM::translate(Translations::VELOCITY_ADDITION) + RPM::COLON);
    ui->labelInitialYRotation->setText(RPM::translate(Translations::INITIAL_Y_ROTATION) + RPM::COLON);
    ui->labelYRotationAddition->setText(RPM::translate(Translations::Y_ROTATION_ADDITION) + RPM::COLON);
    ui->checkBoxWaitEnd->setText(RPM::translate(Translations::WAIT_END_MOVE_BEFORE_NEXT_COMMAND));
    ui->labelTime->setText(RPM::translate(Translations::TIME) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandChangeWeather::getCommand() const
{
    QVector<QString> command;
    if (ui->radioButtonNone->isChecked())
    {
        command.append("0");
    } else {
        command.append("1");
        if (ui->radioButtonColor->isChecked())
        {
            command.append("0");
            ui->panelPrimitiveColorID->getCommand(command);
        } else {
            command.append("1");
            m_imageValueID->getCommandParameter(command, true);
        }
        ui->panelPrimitiveNumberPerPortion->getCommand(command);
        ui->panelPrimitivePortionsRay->getCommand(command);
        ui->panelPrimitiveSize->getCommand(command);
        ui->panelPrimitiveDepthTest->getCommand(command);
        ui->panelPrimitiveDepthWrite->getCommand(command);
        ui->panelPrimitiveInitialVelocity->getCommand(command);
        ui->panelPrimitiveVelocityAddition->getCommand(command);
        ui->panelPrimitiveInitialYRotation->getCommand(command);
        ui->panelPrimitiveYRotationAddition->getCommand(command);
    }
    command.append(RPM::boolToString(ui->checkBoxWaitEnd->isChecked()));
    ui->panelPrimitiveTime->getCommand(command);
    return new EventCommand(EventCommandKind::ChangeWeather, command);
}

// -------------------------------------------------------

void DialogCommandChangeWeather::initialize(EventCommand *command)
{
    int i = 0;
    switch (command->valueCommandAt(i++).toInt())
    {
    case 0:
        ui->radioButtonNone->setChecked(true);
        break;
    case 1:
        ui->radioButtonCustom->setChecked(true);
        switch (command->valueCommandAt(i++).toInt())
        {
        case 0:
            ui->radioButtonColor->setChecked(true);
            ui->panelPrimitiveColorID->initializeCommand(command, i);
            break;
        case 1:
            ui->radioButtonImage->setChecked(true);
            m_imageValueID->initializeCommandParameter(command, i, true);
            ui->widgetPictureImage->initializePrimitive(m_imageValueID,
                m_properties, m_parameters);
            break;
        }
        ui->panelPrimitiveNumberPerPortion->initializeCommand(command, i);
        ui->panelPrimitivePortionsRay->initializeCommand(command, i);
        ui->panelPrimitiveSize->initializeCommand(command, i);
        ui->panelPrimitiveDepthTest->initializeCommand(command, i);
        ui->panelPrimitiveDepthWrite->initializeCommand(command, i);
        ui->panelPrimitiveInitialVelocity->initializeCommand(command, i);
        ui->panelPrimitiveVelocityAddition->initializeCommand(command, i);
        ui->panelPrimitiveInitialYRotation->initializeCommand(command, i);
        ui->panelPrimitiveYRotationAddition->initializeCommand(command, i);
        break;
    }
    ui->checkBoxWaitEnd->setChecked(RPM::stringToBool(command->valueCommandAt(i++)));
    ui->panelPrimitiveTime->initializeCommand(command, i);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeWeather::on_radioButtonCustom_toggled(bool checked)
{
    ui->pushButtonRain->setEnabled(checked);
    ui->pushButtonSnow->setEnabled(checked);
    ui->labelTexture->setEnabled(checked);
    ui->radioButtonColor->setEnabled(checked);
    ui->radioButtonImage->setEnabled(checked);
    this->on_radioButtonColor_toggled(checked && ui->radioButtonColor->isChecked());
    this->on_radioButtonImage_toggled(checked && ui->radioButtonImage->isChecked());
    ui->labelNumberPerPortion->setEnabled(checked);
    ui->panelPrimitiveNumberPerPortion->setEnabled(checked);
    ui->labelPortionsRay->setEnabled(checked);
    ui->panelPrimitivePortionsRay->setEnabled(checked);
    ui->labelSize->setEnabled(checked);
    ui->panelPrimitiveSize->setEnabled(checked);
    ui->labelDepthTest->setEnabled(checked);
    ui->panelPrimitiveDepthTest->setEnabled(checked);
    ui->labelDepthWrite->setEnabled(checked);
    ui->panelPrimitiveDepthWrite->setEnabled(checked);
    ui->labelInitialVelocity->setEnabled(checked);
    ui->panelPrimitiveInitialVelocity->setEnabled(checked);
    ui->labelVelocityAddition->setEnabled(checked);
    ui->panelPrimitiveVelocityAddition->setEnabled(checked);
    ui->labelInitialYRotation->setEnabled(checked);
    ui->panelPrimitiveInitialYRotation->setEnabled(checked);
    ui->labelYRotationAddition->setEnabled(checked);
    ui->panelPrimitiveYRotationAddition->setEnabled(checked);
    ui->groupBoxOptions->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeWeather::on_radioButtonColor_toggled(bool checked)
{
    ui->panelPrimitiveColorID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeWeather::on_radioButtonImage_toggled(bool checked)
{
    ui->widgetPictureImage->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeWeather::on_pushButtonRain_clicked()
{
    ui->radioButtonImage->setChecked(true);
    m_imageValueID->setIsActivated(false);
    m_imageValueID->setKind(PrimitiveValueKind::Number);
    m_imageValueID->setNumberValue(1);
    ui->widgetPictureImage->setPicture(reinterpret_cast<SystemPicture *>(
        SuperListItem::getById(RPM::get()->project()->picturesDatas()->model(
        PictureKind::Particles)->invisibleRootItem(), 1)));
    ui->panelPrimitiveNumberPerPortion->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveNumberPerPortion->setNumberValue(300);
    ui->panelPrimitivePortionsRay->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitivePortionsRay->setNumberValue(1);
    ui->panelPrimitiveSize->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveSize->setNumberValue(6);
    ui->panelPrimitiveDepthTest->setKind(PrimitiveValueKind::Switch);
    ui->panelPrimitiveDepthTest->setSwitchValue(true);
    ui->panelPrimitiveDepthWrite->setKind(PrimitiveValueKind::Switch);
    ui->panelPrimitiveDepthWrite->setSwitchValue(false);
    ui->panelPrimitiveInitialVelocity->setKind(PrimitiveValueKind::Message);
    ui->panelPrimitiveInitialVelocity->setMessageValue("-6");
    ui->panelPrimitiveVelocityAddition->setKind(PrimitiveValueKind::Message);
    ui->panelPrimitiveVelocityAddition->setMessageValue("-Math.random() * 0.002");
    ui->panelPrimitiveInitialYRotation->setKind(PrimitiveValueKind::Message);
    ui->panelPrimitiveInitialYRotation->setMessageValue("0");
    ui->panelPrimitiveYRotationAddition->setKind(PrimitiveValueKind::Message);
    ui->panelPrimitiveYRotationAddition->setMessageValue("0");
}

// -------------------------------------------------------

void DialogCommandChangeWeather::on_pushButtonSnow_clicked()
{
    ui->radioButtonImage->setChecked(true);
    m_imageValueID->setIsActivated(false);
    m_imageValueID->setKind(PrimitiveValueKind::Number);
    m_imageValueID->setNumberValue(2);
    ui->widgetPictureImage->setPicture(reinterpret_cast<SystemPicture *>(
        SuperListItem::getById(RPM::get()->project()->picturesDatas()->model(
        PictureKind::Particles)->invisibleRootItem(), 2)));
    ui->panelPrimitiveNumberPerPortion->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveNumberPerPortion->setNumberValue(200);
    ui->panelPrimitivePortionsRay->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitivePortionsRay->setNumberValue(2);
    ui->panelPrimitiveSize->setKind(PrimitiveValueKind::Number);
    ui->panelPrimitiveSize->setNumberValue(6);
    ui->panelPrimitiveDepthTest->setKind(PrimitiveValueKind::Switch);
    ui->panelPrimitiveDepthTest->setSwitchValue(true);
    ui->panelPrimitiveDepthWrite->setKind(PrimitiveValueKind::Switch);
    ui->panelPrimitiveDepthWrite->setSwitchValue(false);
    ui->panelPrimitiveInitialVelocity->setKind(PrimitiveValueKind::Message);
    ui->panelPrimitiveInitialVelocity->setMessageValue("-1");
    ui->panelPrimitiveVelocityAddition->setKind(PrimitiveValueKind::Message);
    ui->panelPrimitiveVelocityAddition->setMessageValue("-Math.random() * 0.002");
    ui->panelPrimitiveInitialYRotation->setKind(PrimitiveValueKind::Message);
    ui->panelPrimitiveInitialYRotation->setMessageValue("0");
    ui->panelPrimitiveYRotationAddition->setKind(PrimitiveValueKind::Message);
    ui->panelPrimitiveYRotationAddition->setMessageValue("0.001");
}
