/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemanimationframeelement.h"
#include "ui_dialogsystemanimationframeelement.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogSystemAnimationFrameElement::DialogSystemAnimationFrameElement(
    SystemAnimationFrameElement &element, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemAnimationFrameElement),
    m_element(element)
{
    ui->setupUi(this);

    this->initialize();

    this->translate();
}

DialogSystemAnimationFrameElement::~DialogSystemAnimationFrameElement() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemAnimationFrameElement::initialize() {
    ui->spinBoxIndex->setValue(m_element.id());
    ui->spinBoxX->setValue(m_element.x());
    ui->spinBoxY->setValue(m_element.y());
    ui->doubleSpinBoxZoom->setValue(m_element.zoom());
    ui->doubleSpinBoxAngle->setValue(m_element.angle());
    ui->checkBoxFlipVerticaly->setChecked(m_element.flipVerticaly());
    ui->doubleSpinBoxOpacity->setValue(m_element.opacity());
}

//-------------------------------------------------

void DialogSystemAnimationFrameElement::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_ELEMENT) + RPM
        ::DOT_DOT_DOT);
    ui->labelX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->labelY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->labelZoom->setText(RPM::translate(Translations::ZOOM) + RPM::COLON);
    ui->labelAngle->setText(RPM::translate(Translations::ANGLE) + RPM::COLON);
    ui->labelIndex->setText(RPM::translate(Translations::INDEX) + RPM::COLON);
    ui->labelOpacity->setText(RPM::translate(Translations::OPACITY) + RPM::COLON);
    ui->checkBoxFlipVerticaly->setText(RPM::translate(Translations
        ::FLIP_VERTICALY));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogSystemAnimationFrameElement::on_spinBoxIndex_valueChanged(int i) {
    m_element.setId(i);
}

// -------------------------------------------------------

void DialogSystemAnimationFrameElement::on_spinBoxX_valueChanged(int i) {
    m_element.setX(i);
}

// -------------------------------------------------------

void DialogSystemAnimationFrameElement::on_spinBoxY_valueChanged(int i) {
    m_element.setY(i);
}

// -------------------------------------------------------

void DialogSystemAnimationFrameElement::on_doubleSpinBoxZoom_valueChanged(double
    d)
{
    m_element.setZoom(d);
}

// -------------------------------------------------------

void DialogSystemAnimationFrameElement::on_doubleSpinBoxAngle_valueChanged(
    double d)
{
    m_element.setAngle(d);
}

// -------------------------------------------------------

void DialogSystemAnimationFrameElement::on_checkBoxFlipVerticaly_toggled(bool
    checked)
{
    m_element.setFlipVerticaly(checked);
}

// -------------------------------------------------------

void DialogSystemAnimationFrameElement::on_doubleSpinBoxOpacity_valueChanged(
    double d)
{
    m_element.setOpacity(d);
}
