/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
