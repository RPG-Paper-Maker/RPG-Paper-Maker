/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogtransformations.h"
#include "ui_dialogtransformations.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogTransformations::DialogTransformations(PrimitiveValue *centerX,
    PrimitiveValue *centerY, PrimitiveValue *angleX, PrimitiveValue *angleY,
    PrimitiveValue *angleZ, PrimitiveValue *scaleX, PrimitiveValue *scaleY,
    PrimitiveValue *scaleZ, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogTransformations),
    m_centerX(centerX),
    m_centerY(centerY),
    m_angleX(angleX),
    m_angleY(angleY),
    m_angleZ(angleZ),
    m_scaleX(scaleX),
    m_scaleY(scaleY),
    m_scaleZ(scaleZ)
{
    ui->setupUi(this);

    this->initialize();
    this->translate();
}

DialogTransformations::~DialogTransformations()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY
//
// -------------------------------------------------------

void DialogTransformations::initialize()
{
    ui->PanelPrimitiveCenterX->initializeNumberAndUpdate(m_centerX, false);
    ui->PanelPrimitiveCenterY->initializeNumberAndUpdate(m_centerY, false);
    ui->PanelPrimitiveAngleX->initializeNumberAndUpdate(m_angleX, false);
    ui->PanelPrimitiveAngleY->initializeNumberAndUpdate(m_angleY, false);
    ui->PanelPrimitiveAngleZ->initializeNumberAndUpdate(m_angleZ, false);
    ui->PanelPrimitiveScaleX->initializeNumberAndUpdate(m_scaleX, false);
    ui->PanelPrimitiveScaleY->initializeNumberAndUpdate(m_scaleY, false);
    ui->PanelPrimitiveScaleZ->initializeNumberAndUpdate(m_scaleZ, false);
}

// -------------------------------------------------------

void DialogTransformations::translate()
{
    this->setWindowTitle(RPM::translate(Translations::UPDATE_TRANSFORMATIONS) + RPM::DOT_DOT_DOT);
    ui->labelCenterX->setText(RPM::translate(Translations::CENTER) + RPM::SPACE + "X" + RPM::COLON);
    ui->labelCenterZ->setText(RPM::translate(Translations::CENTER) + RPM::SPACE + "Z" + RPM::COLON);
    ui->labelAngleX->setText(RPM::translate(Translations::ANGLE) + RPM::SPACE + "X" + RPM::COLON);
    ui->labelAngleY->setText(RPM::translate(Translations::ANGLE) + RPM::SPACE + "Y" + RPM::COLON);
    ui->labelAngleZ->setText(RPM::translate(Translations::ANGLE) + RPM::SPACE + "Z" + RPM::COLON);
    ui->labelScaleX->setText(RPM::translate(Translations::SCALE) + RPM::SPACE + "X" + RPM::COLON);
    ui->labelScaleY->setText(RPM::translate(Translations::SCALE) + RPM::SPACE + "Y" + RPM::COLON);
    ui->labelScaleZ->setText(RPM::translate(Translations::SCALE) + RPM::SPACE + "Z" + RPM::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}
