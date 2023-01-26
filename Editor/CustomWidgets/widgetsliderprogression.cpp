/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetsliderprogression.h"
#include "ui_widgetsliderprogression.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetSliderProgression::WidgetSliderProgression(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetSliderProgression)
{
    ui->setupUi(this);

    this->translate();
}

WidgetSliderProgression::~WidgetSliderProgression() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int WidgetSliderProgression::equation() const {
    return ui->horizontalSlider->value();
}

// -------------------------------------------------------

void WidgetSliderProgression::setEquation(int e) {
    ui->horizontalSlider->setValue(e);
}

//-------------------------------------------------

void WidgetSliderProgression::translate()
{
    ui->labelFast->setText(RPM::translate(Translations::FAST));
    ui->labelSlow->setText(RPM::translate(Translations::SLOW));
    ui->labelLinear->setText(RPM::translate(Translations::LINEAR));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetSliderProgression::on_horizontalSlider_valueChanged(int i) {
    emit this->equationChanged(i);
}
