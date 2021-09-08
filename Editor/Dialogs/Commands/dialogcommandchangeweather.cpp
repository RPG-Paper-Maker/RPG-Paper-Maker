/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    ui->widgetPictureImage->setKind(PictureKind::Pictures);
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
}

// -------------------------------------------------------

void DialogCommandChangeWeather::translate()
{
    /*
    this->setWindowTitle(RPM::translate(Translations::CHANGE_WEATHER) + RPM
        ::DOT_DOT_DOT);*/
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

    return new EventCommand(EventCommandKind::ChangeWeather, command);
}

// -------------------------------------------------------

void DialogCommandChangeWeather::initialize(EventCommand *command)
{
    int i = 0;

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
