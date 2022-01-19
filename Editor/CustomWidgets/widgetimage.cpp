/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QFile>
#include <QPainter>
#include "widgetimage.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetImage::WidgetImage(QWidget *parent) :
    QWidget(parent)
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetImage::updatePath(QString path)
{
    m_image = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) : QImage();
    this->repaint();
}

// -------------------------------------------------------

void WidgetImage::updateImage(QImage& image)
{
    m_image = image;
    this->repaint();
}

// -------------------------------------------------------
//
//  VIRTUAL
//
// -------------------------------------------------------

void WidgetImage::paintEvent(QPaintEvent *)
{
    QPainter painter(this);
    float coef = static_cast<float>(this->width()) / m_image.width();
    float height = m_image.height() * coef;
    painter.drawImage(QRect(0, this->height() - height / 2, m_image.width() *
        coef, height), m_image);
}
