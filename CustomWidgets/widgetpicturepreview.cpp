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

#include "widgetpicturepreview.h"
#include "rpm.h"
#include <QPainter>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetPicturePreview::WidgetPicturePreview(QWidget *parent) :
    QWidget(parent),
    m_selectionRectangle(new WidgetSelectionRectangle),
    m_chooseRect(false),
    m_indexX(0),
    m_indexY(0)
{

}

WidgetPicturePreview::~WidgetPicturePreview()
{
    delete m_selectionRectangle;
}

void WidgetPicturePreview::setKind(PictureKind kind) { m_kind = kind; }

void WidgetPicturePreview::setChooseRect(bool b) { m_chooseRect = b; }

int WidgetPicturePreview::indexX() const { return m_indexX; }

void WidgetPicturePreview::setIndexX(int i) {
    int frames = RPM::get()->project()->gameDatas()->systemDatas()
            ->framesAnimation();
    if (i >= frames)
        i = frames - 1;

    m_indexX = i;

    updateRectangle();
}

int WidgetPicturePreview::indexY() const { return m_indexY; }

void WidgetPicturePreview::setIndexY(int i) {
    int frames = RPM::get()->project()->gameDatas()->systemDatas()
            ->framesAnimation();
    if (i >= frames)
        i = frames - 1;

    m_indexY = i;

    updateRectangle();
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetPicturePreview::setImage(QString path){
    m_image.load(path);
    updateImageSize();
}

// -------------------------------------------------------

void WidgetPicturePreview::setNoneImage(){
    m_image = QImage();
    updateImageSize();
}

// -------------------------------------------------------

void WidgetPicturePreview::updateImageSize(){

    float coef = RPM::coefReverseSquareSize();

    // Set selector
    if (m_chooseRect && !m_image.isNull()){
        int frames = RPM::get()->project()->gameDatas()->systemDatas()
                ->framesAnimation();

        switch (m_kind){
        case PictureKind::Characters:
            m_selectionRectangle->setSquareWidth(m_image.width() *
                                                 coef / frames);
            m_selectionRectangle->setSquareHeight(m_image.height() *
                                                  coef/ frames);
            updateRectangleCharacter();
            break;
        default:
            break;
        }
    }

    // Set size
    if (m_chooseRect && !m_image.isNull() &&
        (m_kind == PictureKind::Characters || m_kind == PictureKind::Tilesets))
    {
        m_image = m_image.scaled(m_image.width() * coef,
                                 m_image.height() * coef);
    }
    this->setGeometry(0, 0, m_image.width(), m_image.height());
    setFixedSize(m_image.width(), m_image.height());
}

// -------------------------------------------------------

void WidgetPicturePreview::updateRectangle(){
    switch (m_kind){
    case PictureKind::Characters:
        updateRectangleCharacter(); break;
    default:
        break;
    }
}

// -------------------------------------------------------

void WidgetPicturePreview::updateRectangleCharacter(){
    m_selectionRectangle->setRectangle(m_indexX, m_indexY, 1, 1);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetPicturePreview::mousePressEvent(QMouseEvent *event){
    if (event->button() == Qt::MouseButton::LeftButton){
        m_selectionRectangle->makeFirstSelection(event->pos().x(),
                                                 event->pos().y(),
                                                 1.0f);
        QRect rect;
        m_selectionRectangle->getCoefRect(rect);
        m_indexX = rect.x();
        m_indexY = rect.y();
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetPicturePreview::paintEvent(QPaintEvent *){
    QPainter painter(this);

    painter.fillRect(QRect(0, 0, m_image.width(), m_image.height()),
                     RPM::colorAlmostTransparent);
    painter.drawImage(0, 0, m_image);

    if (m_chooseRect && m_kind == PictureKind::Characters)
        m_selectionRectangle->draw(painter);
}
