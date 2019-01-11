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
    m_coef(1.0f),
    m_rect(nullptr),
    m_canDrawRect(false)
{
    this->setMouseTracking(true);
}

void WidgetShowPicture::setActivateCoef(bool b) {
    m_activateCoef = b;
}

void WidgetShowPicture::setCover(bool b) {
    m_cover = b;
}

void WidgetShowPicture::setCoef(float coef) {
    m_coef = coef;
    updatePictureSize();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetShowPicture::updatePicture(SystemPicture* picture, PictureKind kind)
{
    QString path = picture->getPath(kind);
    m_baseImage = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) :
        QImage();
    if (!m_image.isNull()) {
        if (m_activateCoef) {
            float coef = RPM::coefReverseSquareSize();
            m_image = m_baseImage.scaled(static_cast<int>(m_baseImage.width() *
                coef), static_cast<int>(m_baseImage.height() * coef));
        } else {
            m_image = m_baseImage.scaled(static_cast<int>(m_baseImage.width() *
                m_coef), static_cast<int>(m_baseImage.height() * m_coef));
        }
        if (!m_cover) {
            this->setGeometry(this->geometry().x(), this->geometry().y(),
                m_image.width(), m_image.height());
            setFixedSize(m_image.width(), m_image.height());
        }
    } else {
        m_image = m_baseImage;
    }

    this->repaint();
}

// -------------------------------------------------------

void WidgetShowPicture::updatePictureSize() {
    m_image = m_baseImage.scaled(static_cast<int>(m_baseImage.width() * m_coef),
        static_cast<int>(m_baseImage.height() * m_coef));
    this->repaint();
}

// -------------------------------------------------------
//
//  VIRTUAL
//
// -------------------------------------------------------

void WidgetShowPicture::paintEvent(QPaintEvent *){
    QPainter painter(this);

    painter.fillRect(0, 0, m_image.width(), m_image.height(), RPM
        ::colorAlmostTransparent);
    painter.drawImage(0, 0, m_image);

    if (m_rect != nullptr) {
        painter.setPen(Qt::red);
        painter.drawRect(*m_rect);
    }
}

// -------------------------------------------------------

void WidgetShowPicture::mouseMoveEvent(QMouseEvent *event) {
    QPoint pos = event->pos();
    if (pos.x() <= m_image.width() && pos.y() <= m_image.height()) {
        this->setCursor(QCursor(Qt::CrossCursor));
    } else {
        this->setCursor(QCursor(Qt::ArrowCursor));
    }
}

// -------------------------------------------------------

void WidgetShowPicture::leaveEvent(QEvent *) {
    this->setCursor(QCursor(Qt::ArrowCursor));
}
