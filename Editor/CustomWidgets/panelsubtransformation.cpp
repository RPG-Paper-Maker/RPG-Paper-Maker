/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    ui->pushButtonDefineDefault->setText("Define as default " + RPM
        ::ENUM_TO_STRING_AXIS_KIND.at(static_cast<int>(ak)) + " rotation");
    ui->pushButtonResetDefault->setText("Reset to default " + RPM
        ::ENUM_TO_STRING_AXIS_KIND.at(static_cast<int>(ak)) + " rotation");
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
    if (equal) {
        this->on_doubleSpinBoxAngle_valueChanged(this->angle());
    }
}

// -------------------------------------------------------

void PanelSubTransformation::on_doubleSpinBoxAngle_valueChanged(double d) {
    if (this->operation()) {
        if (m_mapElementPosition != nullptr) {
            m_mapElementPosition->setAngle(m_axisKind, d);
        }
    }
}

// -------------------------------------------------------

void PanelSubTransformation::on_checkBoxApplyLeftRightClick_toggled(bool checked)
{
    QModelIndex modelIndex;

    RPM::get()->engineSettings()->setRotationLeftRightClick(m_axisKind, checked);

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
}

// -------------------------------------------------------

void PanelSubTransformation::on_pushButtonDefineDefault_clicked() {
    RPM::get()->engineSettings()->setRotationAngle(m_axisKind, this->angle());
}

// -------------------------------------------------------

void PanelSubTransformation::on_pushButtonResetDefault_clicked() {
    ui->doubleSpinBoxAngle->setValue(RPM::get()->engineSettings()->rotationAngle
        (m_axisKind));
}
