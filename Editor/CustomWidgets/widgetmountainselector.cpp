/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QtMath>
#include "widgetmountainselector.h"
#include "ui_widgetmountainselector.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetMountainSelector::WidgetMountainSelector(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetMountainSelector)
{
    ui->setupUi(this);

    this->updateAngle();
}

WidgetMountainSelector::~WidgetMountainSelector()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetMountainSelector::initializeTilesetPictureID(int pictureID) {
    ui->widgetTilesetTexture->initialize(pictureID);
}

// -------------------------------------------------------

void WidgetMountainSelector::updateAngle() {
    int width;
    double angle;

    width = ui->spinBoxSquareWidth->value() * RPM::get()->getSquareSize() + ui
        ->spinBoxPixelWidth->value();
    angle = width == 0 ? 90 : qRadiansToDegrees(qAtan((ui->spinBoxSquareHeight
        ->value() * RPM::get()->getSquareSize() + ui->spinBoxPixelHeight
        ->value()) / static_cast<qreal>(width)));
    ui->labelAngle->setText("(angle = " + QString::number(angle) + "°)");
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetMountainSelector::on_spinBoxSquareWidth_valueChanged(int) {
    this->updateAngle();
}

// -------------------------------------------------------

void WidgetMountainSelector::on_spinBoxPixelWidth_valueChanged(int) {
    this->updateAngle();
}

// -------------------------------------------------------

void WidgetMountainSelector::on_spinBoxSquareHeight_valueChanged(int) {
    this->updateAngle();
}

// -------------------------------------------------------

void WidgetMountainSelector::on_spinBoxPixelHeight_valueChanged(int) {
    this->updateAngle();
}
