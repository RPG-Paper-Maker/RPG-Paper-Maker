/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
