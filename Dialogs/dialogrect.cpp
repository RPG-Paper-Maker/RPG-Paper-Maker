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

DialogRect::DialogRect(QRect *rect, QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogRect),
    m_rect(rect)
{
    ui->setupUi(this);
    setFixedSize(geometry().width(), geometry().height());

    ui->spinBoxX->setValue(m_rect->x());
    ui->spinBoxY->setValue(m_rect->y());
    ui->spinBoxWidth->setValue(m_rect->width());
    ui->spinBoxHeight->setValue(m_rect->height());
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
//
//  SLOTS
//
// -------------------------------------------------------

void DialogRect::on_spinBoxX_valueChanged(int i) {
    m_rect->setX(i);
    ui->spinBoxWidth->setValue(m_rect->width());
    if (m_rect->width() == 1) {
        m_rect->setWidth(2);
        ui->spinBoxWidth->setValue(2);
    }
    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxY_valueChanged(int i) {
    m_rect->setY(i);
    ui->spinBoxHeight->setValue(m_rect->height());
    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxWidth_valueChanged(int i) {
    m_rect->setWidth(i);
    if (m_rect->right() >= Wanok::BASIC_SQUARE_SIZE) {
        m_rect->setRight(Wanok::BASIC_SQUARE_SIZE - 1);
        ui->spinBoxX->setValue(Wanok::BASIC_SQUARE_SIZE - i);
    }
    updateValues();
}

// -------------------------------------------------------

void DialogRect::on_spinBoxHeight_valueChanged(int i) {
    m_rect->setHeight(i);
    if (m_rect->bottom() >= Wanok::BASIC_SQUARE_SIZE) {
        m_rect->setBottom(Wanok::BASIC_SQUARE_SIZE - 1);
        ui->spinBoxY->setValue(Wanok::BASIC_SQUARE_SIZE - i);
    }
    updateValues();
}
