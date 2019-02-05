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

#include "widgetselectrect.h"
#include "ui_widgetselectrect.h"
#include "dialogrect.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetSelectRect::WidgetSelectRect(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetSelectRect),
    m_dialogOpened(false),
    m_selecting(false)
{
    ui->setupUi(this);
}

WidgetSelectRect::~WidgetSelectRect()
{
    delete ui;
}

void WidgetSelectRect::setWidgetShowPicture(WidgetShowPicture *w) {
    m_widgetShowPicture = w;

    connect(w, SIGNAL(rectDrawn()), this, SLOT(on_rectDrawn()));
}

void WidgetSelectRect::setRect(QRectF *rect) {
    m_rect = rect;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetSelectRect::updateLabel(QString label) {
    ui->label->setText(label);
}

// -------------------------------------------------------
//
//  VIRTUAL METHODS
//
// -------------------------------------------------------

void WidgetSelectRect::enterEvent(QEvent *) {
    if (!m_selecting && this->isEnabled()) {
        m_widgetShowPicture->setRect(m_rect);
        m_widgetShowPicture->repaint();
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetSelectRect::on_pushButtonEnter_clicked() {
    DialogRect dialog(m_rect, false, m_widgetShowPicture);
    m_dialogOpened = true;
    dialog.exec();
    m_dialogOpened = false;
}

// -------------------------------------------------------

void WidgetSelectRect::on_pushButtonSelect_clicked() {
    m_selecting = true;
    m_widgetShowPicture->activateCanDrawRect();
    emit selecting();
}

// -------------------------------------------------------

void WidgetSelectRect::on_rectDrawn() {
    m_selecting = false;
}
