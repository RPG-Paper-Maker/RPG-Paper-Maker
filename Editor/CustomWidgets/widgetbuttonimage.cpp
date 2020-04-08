/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QPainter>
#include "widgetbuttonimage.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetButtonImage::WidgetButtonImage(QWidget *parent) :
    QWidget(parent)
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetButtonImage::updateImage(QString path, double zoom)
{
    int w, h;

    m_image = QImage(path);
    w = qRound(m_image.width() * zoom);
    h = qRound(m_image.height() * zoom);
    m_image = m_image.scaled(w, h);
    this->setFixedSize(w, h);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void WidgetButtonImage::enterEvent(QEvent *)
{
    this->setCursor(Qt::PointingHandCursor);
}

// -------------------------------------------------------

void WidgetButtonImage::leaveEvent(QEvent *)
{
    this->setCursor(Qt::ArrowCursor);
}

// -------------------------------------------------------

void WidgetButtonImage::mousePressEvent(QMouseEvent *)
{
    emit clicked();
}

// -------------------------------------------------------

void WidgetButtonImage::paintEvent(QPaintEvent *)
{
    QPainter painter(this);

    painter.drawImage(0, 0, m_image);
}
