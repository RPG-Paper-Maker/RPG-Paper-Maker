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

#include "widgetshowpicture.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetShowPicture::WidgetShowPicture(QWidget *parent) :
    QWidget(parent),
    m_activateCoef(true),
    m_cover(false),
    m_coef(1.0f)
{

}

void WidgetShowPicture::setActivateCoef(bool b) {
    m_activateCoef = b;
}

void WidgetShowPicture::setCover(bool b) {
    m_cover = b;
}

void WidgetShowPicture::setCoef(float coef) {
    m_coef = coef;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetShowPicture::updatePicture(SystemPicture* picture, PictureKind kind)
{
    QString path = picture->getPath(kind);
    m_image = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) :
        QImage();
    if (!m_image.isNull()) {
        if (m_activateCoef) {
            float coef = RPM::coefReverseSquareSize();
            m_image = m_image.scaled(static_cast<int>(m_image.width() * coef),
                static_cast<int>(m_image.height() * coef));
        } else {
            m_image = m_image.scaled(static_cast<int>(m_image.width() * m_coef),
                static_cast<int>(m_image.height() * m_coef));
        }
    }
    if (!m_cover) {
        this->setGeometry(this->geometry().x(), this->geometry().y(), m_image
            .width(), m_image.height());
        setFixedSize(m_image.width(), m_image.height());
    }

    this->repaint();
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetShowPicture::paintEvent(QPaintEvent *){
    QPainter painter(this);

    painter.drawImage(0, 0, m_image);
}
