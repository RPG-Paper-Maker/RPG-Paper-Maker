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

    this->translate();
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

int WidgetMountainSelector::getWidthSquares() const {
    return ui->spinBoxSquareWidth->value();
}

// -------------------------------------------------------

double WidgetMountainSelector::getWidthPixels() const {
    return static_cast<double>(ui->spinBoxPixelWidth->value()) / RPM::get()
        ->getSquareSize() * 100;
}

// -------------------------------------------------------

int WidgetMountainSelector::getHeightSquares() const {
    return ui->spinBoxSquareHeight->value();
}

// -------------------------------------------------------

double WidgetMountainSelector::getHeightPixels() const {
    return static_cast<double>(ui->spinBoxPixelHeight->value()) / RPM::get()
        ->getSquareSize() * 100;
}

// -------------------------------------------------------

void WidgetMountainSelector::getDefaultFloorRect(QRect& rect) const {
    ui->widgetTilesetTexture->getRect(rect);
}

// -------------------------------------------------------

void WidgetMountainSelector::initializeTilesetPictureID(int pictureID) {
    ui->widgetTilesetTexture->initialize(pictureID);
}

// -------------------------------------------------------

void WidgetMountainSelector::updateAngle() {
    double angle, width;

    width = ui->spinBoxSquareWidth->value() * RPM::get()->getSquareSize() + ui
        ->spinBoxPixelWidth->value();
    angle = width == 0.0 ? 90 : qRadiansToDegrees(qAtan((ui->spinBoxSquareHeight
        ->value() * RPM::get()->getSquareSize() + ui->spinBoxPixelHeight
        ->value()) / width));
    ui->labelAngle->setText(RPM::PARENTHESIS_LEFT + RPM::translate(Translations
        ::ANGLE).toLower() + RPM::SPACE + RPM::EQUAL + RPM::SPACE + QString
        ::number(angle) + "°" + RPM::PARENTHESIS_RIGHT);
}

//-------------------------------------------------

void WidgetMountainSelector::translate()
{
    ui->labelTopFloor->setText(RPM::translate(Translations::TOP_FLOOR) + RPM
        ::COLON);
    ui->labelWidthPixels->setText(RPM::translate(Translations::PIXEL_S) + RPM
        ::COLON);
    ui->labelHeightPixels->setText(RPM::translate(Translations::PIXEL_S) + RPM
        ::COLON);
    ui->labelWidthSquares->setText(RPM::translate(Translations::SQUARE_S) + RPM
        ::COLON);
    ui->labelHeightSquares->setText(RPM::translate(Translations::SQUARE_S) + RPM
        ::COLON);
    ui->groupBoxBorderWidth->setTitle(RPM::translate(Translations::BORDER_WIDTH));
    ui->groupBoxHeight->setTitle(RPM::translate(Translations::HEIGHT));
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
