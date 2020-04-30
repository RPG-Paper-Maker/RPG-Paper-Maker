/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemcameraproperties.h"
#include "ui_dialogsystemcameraproperties.h"
#include "rpm.h"

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

    this->translate();
}

DialogSystemCameraProperties::~DialogSystemCameraProperties()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemCameraProperties::initialize() {
    int index;

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
    index = m_cameraProperties.isSquareTargetOffsetX() ? 0 : 1;
    ui->comboBoxX->addItem(RPM::translate(Translations::SQUARE_S));
    ui->comboBoxX->addItem(RPM::translate(Translations::PIXEL_S));
    ui->comboBoxX->setCurrentIndex(index);
    index = m_cameraProperties.isSquareTargetOffsetY() ? 0 : 1;
    ui->comboBoxY->addItem(RPM::translate(Translations::SQUARE_S));
    ui->comboBoxY->addItem(RPM::translate(Translations::PIXEL_S));
    ui->comboBoxY->setCurrentIndex(index);
    index = m_cameraProperties.isSquareTargetOffsetZ() ? 0 : 1;
    ui->comboBoxZ->addItem(RPM::translate(Translations::SQUARE_S));
    ui->comboBoxZ->addItem(RPM::translate(Translations::PIXEL_S));
    ui->comboBoxZ->setCurrentIndex(index);

    ui->panelPrimitiveFOV->initializeNumberAndUpdate(m_cameraProperties
        .fieldOfView(), false);
    ui->panelPrimitiveNear->initializeNumberAndUpdate(m_cameraProperties.nearCam(),
        false);
    ui->panelPrimitiveFar->initializeNumberAndUpdate(m_cameraProperties.farCam(),
        false);
}

//-------------------------------------------------

void DialogSystemCameraProperties::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_CAMERA_PROPERTIES) +
        RPM::DOT_DOT_DOT);
    ui->labelX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->labelY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->labelZ->setText(RPM::translate(Translations::Z) + RPM::COLON);
    ui->labelFar->setText(RPM::translate(Translations::FAR_MESSAGE) + RPM::COLON);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelNear->setText(RPM::translate(Translations::NEAR_MESSAGE) + RPM::COLON);
    ui->labelDistance->setText(RPM::translate(Translations::DISTANCE) + RPM
        ::COLON);
    ui->labelFieldOfView->setText(RPM::translate(Translations::FIELD_OF_VIEW) +
        RPM::COLON);
    ui->labelVerticalAngle->setText(RPM::translate(Translations::VERTICAL_ANGLE)
        + RPM::COLON);
    ui->labelHorizontalAngle->setText(RPM::translate(Translations
        ::HORIZONTAL_ANGLE) + RPM::COLON);
    ui->groupBoxTargetOffset->setTitle(RPM::translate(Translations
        ::TARGET_OFFSET));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
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

// -------------------------------------------------------

void DialogSystemCameraProperties::on_comboBoxX_currentIndexChanged(int index)
{
    m_cameraProperties.setIsSquareTargetOffsetX(index == 0);
}

// -------------------------------------------------------

void DialogSystemCameraProperties::on_comboBoxY_currentIndexChanged(int index)
{
    m_cameraProperties.setIsSquareTargetOffsetY(index == 0);
}

// -------------------------------------------------------

void DialogSystemCameraProperties::on_comboBoxZ_currentIndexChanged(int index)
{
    m_cameraProperties.setIsSquareTargetOffsetZ(index == 0);
}
