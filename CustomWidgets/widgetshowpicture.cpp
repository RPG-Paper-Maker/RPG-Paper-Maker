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

#include <QtMath>
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
    m_canDrawRect(false),
    m_firstPresure(true),
    m_width(-1),
    m_height(-1)
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

void WidgetShowPicture::setRect(QRectF *rect) {
    m_rect = rect;
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
    if (!m_baseImage.isNull()) {
        if (m_activateCoef) {
            float coef = RPM::coefReverseSquareSize();
            m_image = m_baseImage.scaled(static_cast<int>(m_baseImage.width() *
                coef), static_cast<int>(m_baseImage.height() * coef));
        } else {
            m_image = m_baseImage.scaled(static_cast<int>(m_baseImage.width() *
                m_coef), static_cast<int>(m_baseImage.height() * m_coef));
        }
    } else {
        m_image = m_baseImage;
    }

    updateSizePosition();
    this->repaint();
}

// -------------------------------------------------------

void WidgetShowPicture::updatePictureSize() {
    if (!m_image.isNull()) {
        m_image = m_baseImage.scaled(static_cast<int>(m_baseImage.width() * m_coef),
            static_cast<int>(m_baseImage.height() * m_coef));
    }
    updateSizePosition();
    this->repaint();
}

// -------------------------------------------------------

void WidgetShowPicture::activateCanDrawRect() {
    m_canDrawRect = true;
    m_rectBefore.setX(m_rect->x());
    m_rectBefore.setY(m_rect->y());
    m_rectBefore.setWidth(m_rect->width());
    m_rectBefore.setHeight(m_rect->height());
    m_rect->setWidth(-1);
    m_rect->setHeight(-1);
    this->repaint();
}

// -------------------------------------------------------

bool WidgetShowPicture::isInsideImage(QPoint& pos) const {
    return pos.x() <= m_image.width() && pos.y() <= m_image.height();
}

// -------------------------------------------------------

void WidgetShowPicture::updateToRectBefore() {
    if (m_rect->width() <= 0 || m_rect->height() <= 0) {
        m_rect->setX(m_rectBefore.x());
        m_rect->setY(m_rectBefore.y());
        m_rect->setWidth(m_rectBefore.width());
        m_rect->setHeight(m_rectBefore.height());
    }
}

// -------------------------------------------------------

void WidgetShowPicture::updateSizePosition() {
    if (!m_cover) {
        if (m_width == -1 && m_height == -1) {
            m_width = this->geometry().width();
            m_height = this->geometry().height();
        }
        int width, height;
        if (m_image.isNull()) {
            width = m_width;
            height = m_height;
        } else {
            width = m_image.width() < m_width ? m_width : m_image.width();
            height = m_image.height() < m_height ? m_height : m_image.height();
        }
        this->setGeometry(this->geometry().x(), this->geometry().y(), width,
            height);
        setFixedSize(width, height);
    }
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

    if (m_rect != nullptr && m_rect->width() > 0 && m_rect->height() > 0) {
        painter.setPen(Qt::red);
        painter.drawRect(static_cast<int>(static_cast<float>(m_rect->x()) *
            m_coef), static_cast<int>(static_cast<float>(m_rect->y()) * m_coef),
            static_cast<int>(static_cast<float>(m_rect->width()) * m_coef) - 1,
            static_cast<int>(static_cast<float>(m_rect->height()) * m_coef) - 1);
    }
}

// -------------------------------------------------------

void WidgetShowPicture::mouseMoveEvent(QMouseEvent *event) {
    if (m_canDrawRect) {
        QPoint pos = event->pos();
        bool inside = this->isInsideImage(pos);
        int posX, posY;
        if (inside) {
            this->setCursor(QCursor(Qt::CrossCursor));
        } else {
            if (event->buttons() & Qt::LeftButton) {
                this->setCursor(QCursor(Qt::CrossCursor));
            } else {
                this->setCursor(QCursor(Qt::ArrowCursor));
            }
        }
        if (event->buttons() & Qt::LeftButton) {
            if (m_firstPresure) {
                if (inside) {
                    m_firstPresure = false;
                    m_rect->setLeft(static_cast<qreal>(qFloor(pos.x() /
                        static_cast<qreal>(m_coef))));
                    m_rect->setTop(static_cast<qreal>(qFloor(pos.y() /
                        static_cast<qreal>(m_coef))));
                }
            } else {
                posX = pos.x() <= m_image.width() ? pos.x() : m_image.width();
                posY = pos.y() <= m_image.height() ? pos.y() : m_image.height();
                m_rect->setRight(static_cast<qreal>(qFloor(posX / static_cast
                    <qreal>(m_coef))));
                m_rect->setBottom(static_cast<qreal>(qFloor(posY / static_cast
                    <qreal>(m_coef))));
            }
            this->repaint();
        }
    }
}

// -------------------------------------------------------

void WidgetShowPicture::mouseReleaseEvent(QMouseEvent *) {
    if (m_canDrawRect) {
        m_firstPresure = true;
        m_canDrawRect = false;
        this->setCursor(QCursor(Qt::ArrowCursor));
        updateToRectBefore();
        this->repaint();

        emit rectDrawn();
    }
}

// -------------------------------------------------------

void WidgetShowPicture::leaveEvent(QEvent *) {
    this->setCursor(QCursor(Qt::ArrowCursor));
}
