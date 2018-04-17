/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "dialogrect.h"
#include "ui_dialogrect.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogRect::DialogRect(QRectF *rect, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogRect),
    m_rect(rect)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    int squareSize = Wanok::get()->getSquareSize();
    int two = getTwo();

    ui->spinBoxX->setMinimum(0);
    ui->spinBoxX->setMaximum(squareSize - two);
    ui->spinBoxX->setValue(translateToSpinValue(m_rect->x()));

    ui->spinBoxY->setMinimum(0);
    ui->spinBoxY->setMaximum(squareSize - two);
    ui->spinBoxY->setValue(translateToSpinValue(m_rect->y()));

    ui->spinBoxWidth->setMinimum(two);
    ui->spinBoxWidth->setMaximum(squareSize);
    ui->spinBoxWidth->setValue(translateToSpinValue(m_rect->width()));

    ui->spinBoxHeight->setMinimum(two);
    ui->spinBoxHeight->setMaximum(squareSize);
    ui->spinBoxHeight->setValue(translateToSpinValue(m_rect->height()));
}

DialogRect::~DialogRect()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogRect::updateValues() {
    if (this->parent() != nullptr)
        ((QWidget*) this->parent())->repaint();
}

// -------------------------------------------------------

int DialogRect::translateToSpinValue(float percent) {
    return qRound((percent / 100.0f) * Wanok::get()->getSquareSize());
}

// -------------------------------------------------------

float DialogRect::translateFromSpinValue(int px) {
    return (px / (float) Wanok::get()->getSquareSize()) * 100.0f;
}

// -------------------------------------------------------

int DialogRect::getOne() {
    return Wanok::coefSquareSize() * 1;
}

// -------------------------------------------------------

int DialogRect::getTwo() {
    return Wanok::coefSquareSize() * 2;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogRect::on_spinBoxX_valueChanged(int i) {
    m_rect->setX(translateFromSpinValue(i));
    if (translateToSpinValue(m_rect->width()) == getOne()) {
        m_rect->setWidth(translateFromSpinValue(getTwo()));
        ui->spinBoxWidth->setValue(getTwo());
    }
    else
        ui->spinBoxWidth->setValue(translateToSpinValue(m_rect->width()));
    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxY_valueChanged(int i) {
    m_rect->setY(translateFromSpinValue(i));
    if (translateToSpinValue(m_rect->height()) == getOne()) {
        m_rect->setHeight(translateFromSpinValue(getTwo()));
        ui->spinBoxHeight->setValue(getTwo());
    }
    else
        ui->spinBoxHeight->setValue(translateToSpinValue(m_rect->height()));
    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxWidth_valueChanged(int i) {
    m_rect->setWidth(translateFromSpinValue(i));
    if (m_rect->right() >= 100) {
        m_rect->setRight(translateFromSpinValue(
                             Wanok::get()->project()->gameDatas()->systemDatas()
                             ->squareSize()));
        ui->spinBoxX->setValue(Wanok::get()->project()->gameDatas()
                               ->systemDatas()->squareSize() - i);
    }
    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxHeight_valueChanged(int i) {
    m_rect->setHeight(translateFromSpinValue(i));
    if (m_rect->bottom() >= 100) {
        m_rect->setBottom(translateFromSpinValue(
                             Wanok::get()->project()->gameDatas()->systemDatas()
                             ->squareSize()));
        ui->spinBoxY->setValue(Wanok::get()->project()->gameDatas()
                               ->systemDatas()->squareSize() - i);
    }
    updateValues();
}
