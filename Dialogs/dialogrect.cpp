/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogRect::DialogRect(QRectF *rect, bool controlSquare, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogRect),
    m_rect(rect),
    m_controlSquare(controlSquare)
{
    ui->setupUi(this);
    
    if (m_controlSquare) {
        int squareSize = RPM::get()->getSquareSize();
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
    } else {
        ui->spinBoxX->setMinimum(static_cast<int>(rect->x()));
        ui->spinBoxY->setMinimum(static_cast<int>(rect->y()));
        ui->spinBoxWidth->setMinimum(static_cast<int>(rect->width()));
        ui->spinBoxHeight->setMinimum(static_cast<int>(rect->height()));
    }
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
    if (this->parent() != nullptr) {
        reinterpret_cast<QWidget *>(this->parent())->repaint();
    }
}

// -------------------------------------------------------

int DialogRect::translateToSpinValue(float percent) {
    return qRound((percent / 100.0f) * RPM::get()->getSquareSize());
}

// -------------------------------------------------------

float DialogRect::translateFromSpinValue(int px) {
    return (px / (float) RPM::get()->getSquareSize()) * 100.0f;
}

// -------------------------------------------------------

int DialogRect::getOne() {
    return RPM::coefSquareSize() * 1;
}

// -------------------------------------------------------

int DialogRect::getTwo() {
    return RPM::coefSquareSize() * 2;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogRect::on_spinBoxX_valueChanged(int i) {
    if (m_controlSquare) {
        m_rect->setX(translateFromSpinValue(i));
        if (translateToSpinValue(m_rect->width()) == getOne()) {
            m_rect->setWidth(translateFromSpinValue(getTwo()));
            ui->spinBoxWidth->setValue(getTwo());
        }
        else
            ui->spinBoxWidth->setValue(translateToSpinValue(m_rect->width()));
    } else {
        m_rect->setX(i);
    }

    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxY_valueChanged(int i) {
    if (m_controlSquare) {
        m_rect->setY(translateFromSpinValue(i));
        if (translateToSpinValue(m_rect->height()) == getOne()) {
            m_rect->setHeight(translateFromSpinValue(getTwo()));
            ui->spinBoxHeight->setValue(getTwo());
        }
        else
            ui->spinBoxHeight->setValue(translateToSpinValue(m_rect->height()));
    } else {
        m_rect->setY(i);
    }

    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxWidth_valueChanged(int i) {
    if (m_controlSquare) {
        m_rect->setWidth(translateFromSpinValue(i));
        if (m_rect->right() >= 100) {
            m_rect->setRight(translateFromSpinValue(
                                 RPM::get()->project()->gameDatas()->systemDatas()
                                 ->squareSize()));
            ui->spinBoxX->setValue(RPM::get()->project()->gameDatas()
                                   ->systemDatas()->squareSize() - i);
        }
    } else {
        m_rect->setWidth(i);
    }

    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxHeight_valueChanged(int i) {
    if (m_controlSquare) {
        m_rect->setHeight(translateFromSpinValue(i));
        if (m_rect->bottom() >= 100) {
            m_rect->setBottom(translateFromSpinValue(
                                 RPM::get()->project()->gameDatas()->systemDatas()
                                 ->squareSize()));
            ui->spinBoxY->setValue(RPM::get()->project()->gameDatas()
                                   ->systemDatas()->squareSize() - i);
        }
    } else {
        m_rect->setHeight(i);
    }

    updateValues();
}
