/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetselectrect.h"
#include "ui_widgetselectrect.h"
#include "dialogrect.h"
#include "rpm.h"

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

    this->translate();
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

//-------------------------------------------------

void WidgetSelectRect::translate()
{
    ui->pushButtonEnter->setText(RPM::translate(Translations::ENTER) + RPM
        ::DOT_DOT_DOT);
    ui->pushButtonSelect->setText(RPM::translate(Translations::SELECT) + RPM
        ::DOT_DOT_DOT);
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
