/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogprogress.h"
#include "ui_dialogprogress.h"
#include <QtMath>
//#include "rpm.h"

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

    ui->labelDescription->setWordWrap(true);
    
    setWindowFlags(Qt::FramelessWindowHint);
    setWindowFlags(Qt::WindowTitleHint);

    this->translate();
}

DialogProgress::~DialogProgress()
{
    delete ui;
}

//-------------------------------------------------

void DialogProgress::translate()
{
    //this->setWindowTitle(RPM::translate(Translations::IN_PROGRESS));
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
