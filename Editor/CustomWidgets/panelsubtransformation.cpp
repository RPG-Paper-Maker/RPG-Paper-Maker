/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelsubtransformation.h"
#include "ui_panelsubtransformation.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelSubTransformation::PanelSubTransformation(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelSubTransformation),
    m_mapElementPosition(nullptr),
    m_axisKind(AxisKind::X)
{
    ui->setupUi(this);

    this->translate();
}

PanelSubTransformation::~PanelSubTransformation() {
    delete ui;
}

void PanelSubTransformation::setMapElementPosition(Position *p) {
    m_mapElementPosition = p;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool PanelSubTransformation::operation() const {
    return ui->comboBoxOperation->currentIndex() == 1;
}

// -------------------------------------------------------

double PanelSubTransformation::angle() const {
    return ui->doubleSpinBoxAngle->value();
}

// -------------------------------------------------------

bool PanelSubTransformation::applyLeftRightClick() const {
    return ui->checkBoxApplyLeftRightClick->isChecked();
}

// -------------------------------------------------------

void PanelSubTransformation::initializeRotation(AxisKind ak) {
    m_axisKind = ak;
    ui->comboBoxOperation->setCurrentIndex(RPM::get()->engineSettings()
        ->rotationOperation(ak) ? 1 : 0);
    ui->doubleSpinBoxAngle->setValue(RPM::get()->engineSettings()->rotationAngle
        (ak));
    ui->checkBoxApplyLeftRightClick->setChecked(RPM::get()->engineSettings()
        ->rotationLeftRightClick(ak));
    ui->pushButtonDefineDefault->setText(RPM::translate(Translations
        ::DEFINE_AS_DEFAULT) + RPM::SPACE + RPM::ENUM_TO_STRING_AXIS_KIND.at(
        static_cast<int>(ak)) + RPM::SPACE + RPM::translate(Translations
        ::ROTATION).toLower());
    ui->pushButtonResetDefault->setText(RPM::translate(Translations
        ::RESET_TO_DEFAULT) + RPM::SPACE + RPM::ENUM_TO_STRING_AXIS_KIND.at(
        static_cast<int>(ak)) + RPM::SPACE + RPM::translate(Translations
        ::ROTATION).toLower());
}

// -------------------------------------------------------

void PanelSubTransformation::updatePositionAuto() {
    if (m_mapElementPosition != nullptr && !this->applyLeftRightClick()) {
        Position previousPosition;

        previousPosition = *m_mapElementPosition;
        m_mapElementPosition->setAngle(m_axisKind, this->angle());

        if (*m_mapElementPosition != previousPosition) {
            emit positionChanged(previousPosition);
        }
    }
}

// -------------------------------------------------------

void PanelSubTransformation::updatePositionClick(bool positive) {
    if (m_mapElementPosition != nullptr && this->applyLeftRightClick()) {
        Position previousPosition;

        previousPosition = *m_mapElementPosition;
        if (this->operation()) {
            m_mapElementPosition->setAngle(m_axisKind, positive ? this->angle()
                : -this->angle());
        } else {
            m_mapElementPosition->addAngle(m_axisKind, positive ? this->angle()
                : -this->angle());

        }

        if (*m_mapElementPosition != previousPosition) {
            emit positionChanged(previousPosition);
        }
    }
}

//-------------------------------------------------

void PanelSubTransformation::translate()
{
    ui->labelAngle->setText(RPM::translate(Translations::ANGLE) + RPM::COLON);
    ui->checkBoxApplyLeftRightClick->setText(RPM::translate(Translations
        ::APPLY_ON_LEFT_RIGHT_CLICK));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelSubTransformation::on_comboBoxOperation_currentIndexChanged(int index)
{
    bool equal;

    equal = index == 1;
    RPM::get()->engineSettings()->setRotationOperation(m_axisKind, equal);
    RPM::get()->engineSettings()->write();
    if (equal) {
        this->updatePositionAuto();
    }
}

// -------------------------------------------------------

void PanelSubTransformation::on_doubleSpinBoxAngle_valueChanged(double) {
    this->updatePositionAuto();
}

// -------------------------------------------------------

void PanelSubTransformation::on_checkBoxApplyLeftRightClick_toggled(bool checked)
{
    QModelIndex modelIndex;

    RPM::get()->engineSettings()->setRotationLeftRightClick(m_axisKind, checked);
    RPM::get()->engineSettings()->write();

    // If not checked, impossible to select + operation
    modelIndex = ui->comboBoxOperation->model()->index(0, 0);
    if (!checked) {
        QVariant vDisable(0);

        ui->comboBoxOperation->setCurrentIndex(1);
        ui->comboBoxOperation->model()->setData(modelIndex, vDisable, Qt
            ::UserRole - 1);
    } else {
        QVariant vEnable(1 | 32);

        ui->comboBoxOperation->model()->setData(modelIndex, vEnable, Qt
            ::UserRole - 1);
    }

    this->updatePositionAuto();
}

// -------------------------------------------------------

void PanelSubTransformation::on_pushButtonDefineDefault_clicked() {
    RPM::get()->engineSettings()->setRotationAngle(m_axisKind, this->angle());
    RPM::get()->engineSettings()->write();
}

// -------------------------------------------------------

void PanelSubTransformation::on_pushButtonResetDefault_clicked() {
    ui->doubleSpinBoxAngle->setValue(RPM::get()->engineSettings()->rotationAngle
        (m_axisKind));
    this->updatePositionAuto();
}
