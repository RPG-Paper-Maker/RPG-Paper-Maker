/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemcameraproperties.h"
#include "ui_dialogsystemcameraproperties.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemCameraProperties::DialogSystemCameraProperties(
    SystemCameraProperties &cameraProperties, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemCameraProperties),
    m_cameraProperties(cameraProperties)
{
    ui->setupUi(this);

    this->initialize();
}

DialogSystemCameraProperties::~DialogSystemCameraProperties()
{
    delete ui;
}

SystemCameraProperties & DialogSystemCameraProperties::cameraProperties() const
{
    return m_cameraProperties;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCameraProperties::initialize() {
    ui->lineEditName->setText(m_cameraProperties.name());

    ui->panelPrimitiveDistance->initializeNumberAndUpdate(m_cameraProperties
        .distance(), false);
    ui->panelPrimitiveHorizontalAngle->initializeNumberAndUpdate(
        m_cameraProperties.horizontalAngle(), false);
    ui->panelPrimitiveVerticalAngle->initializeNumberAndUpdate(
        m_cameraProperties.verticalAngle(), false);

    ui->panelPrimitiveTargetOffsetX->initializeNumberAndUpdate(
        m_cameraProperties.targetOffsetX());
    ui->panelPrimitiveTargetOffsetY->initializeNumberAndUpdate(
        m_cameraProperties.targetOffsetY());
    ui->panelPrimitiveTargetOffsetZ->initializeNumberAndUpdate(
        m_cameraProperties.targetOffsetZ());

    ui->panelPrimitiveFOV->initializeNumberAndUpdate(m_cameraProperties
        .fieldOfView(), false);
    ui->panelPrimitiveNear->initializeNumberAndUpdate(m_cameraProperties.near(),
        false);
    ui->panelPrimitiveFar->initializeNumberAndUpdate(m_cameraProperties.far(),
        false);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemCameraProperties::on_lineEditName_textChanged(const QString
    &text)
{
    m_cameraProperties.setName(text);
}
