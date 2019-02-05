/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include "dialogprogress.h"
#include "ui_dialogprogress.h"
#include <QtMath>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogProgress::DialogProgress(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogProgress),
    m_totalCount(1),
    m_count(0),
    m_beginValue(0),
    m_endValue(0)
{
    ui->setupUi(this);
    

    setWindowFlags(Qt::FramelessWindowHint);
    setWindowFlags(Qt::WindowTitleHint);
}

DialogProgress::~DialogProgress()
{
    delete ui;
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogProgress::setValueLabel(int v, QString s) {
    m_beginValue = m_endValue;
    m_count = 0;
    m_totalCount = 1;
    ui->progressBar->setValue(m_endValue);
    m_endValue = v;
    ui->label->setText(s);
}

// -------------------------------------------------------

void DialogProgress::setDescription(QString s) {
    ui->labelDescription->setText(s);
}

// -------------------------------------------------------

void DialogProgress::setCount(int v) {
    m_totalCount = v;
}

// -------------------------------------------------------

void DialogProgress::addOne() {
    m_count++;
    ui->progressBar->setValue(qFloor(m_beginValue + ((float) m_count /
                              m_totalCount) * (m_endValue - m_beginValue)));
}
