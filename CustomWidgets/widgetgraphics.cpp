/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#include "widgetgraphics.h"
#include "dialogpicturespreview.h"
#include "wanok.h"
#include "panelobject.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetGraphics::WidgetGraphics(QWidget *parent) :
    QFrame(parent),
    m_state(nullptr),
    m_selected(false),
    m_borderOffset(5)
{

}

void WidgetGraphics::setState(SystemState* s) { m_state = s; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemPicture* WidgetGraphics::getPicture(){
    PictureKind kind = getPictureKind();

    return (SystemPicture*) SuperListItem::getById(
                Wanok::get()->project()->picturesDatas()->model(kind)
                ->invisibleRootItem(), m_state->graphicsId());
}

// -------------------------------------------------------

PictureKind WidgetGraphics::getPictureKind(){
    switch (m_state->graphicsKind()){
    case MapEditorSubSelectionKind::SpritesFix:
    case MapEditorSubSelectionKind::SpritesFace:
        return PictureKind::Characters;
    default:
        return PictureKind::None;
    }
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetGraphics::mousePressEvent(QMouseEvent*){
    m_selected = true;
    repaint();
}

// -------------------------------------------------------

void WidgetGraphics::mouseDoubleClickEvent(QMouseEvent*){

    bool wasNone = false;
    if (m_state->graphicsKind() == MapEditorSubSelectionKind::None){
        wasNone = true;
        ((PanelObject*) this->parent())->passToSprite();
    }

    PictureKind kind;
    SystemPicture* picture;

    // Get picture
    kind = getPictureKind();
    picture = getPicture();

    // Open dialog preview
    DialogPicturesPreview dialog(picture, kind);
    dialog.setIndexX(m_state->indexX());
    dialog.setIndexY(m_state->indexY());

    if (dialog.exec() == QDialog::Accepted){
        Wanok::get()->project()->writePicturesDatas();
        m_state->setGraphicsId(dialog.picture()->id());
        m_state->setIndexX(dialog.indexX());
        m_state->setIndexY(dialog.indexY());
    }
    else{
        Wanok::get()->project()->readPicturesDatas();
        if (wasNone)
            ((PanelObject*) this->parent())->passToNone();
    }

    repaint();
}

// -------------------------------------------------------

void WidgetGraphics::paintEvent(QPaintEvent* event){
    QFrame::paintEvent(event);

    QPainter painter(this);

    // Draw background
    painter.fillRect(QRectF(rect().x() + 1, rect().y() + 1,
                            rect().width() - 2, rect().height() - 2),
                     QColor(255, 255, 255));

    // Draw image
    if (m_state->graphicsKind() != MapEditorSubSelectionKind::None){
        if (m_state->graphicsId() != -1){
            PictureKind kind = getPictureKind();
            SystemPicture* picture = getPicture();
            QImage image(picture->getPath(kind));
            float coef = Wanok::coefReverseSquareSize();
            int width = image.width() / Wanok::get()->project()->gameDatas()
                    ->systemDatas()->framesAnimation();
            int height = image.height() / Wanok::get()->project()->gameDatas()
                    ->systemDatas()->framesAnimation();
            int newWidth = width * coef, newHeight = height * coef;
            int x = (this->rect().width() - newWidth) / 2;
            int y = (this->rect().height() - newHeight) / 2;
            painter.drawImage(QRect(x, y, newWidth, newHeight),
                              image,
                              QRect(m_state->indexX() * width,
                                    m_state->indexY() * height,
                                    width,
                                    height)
                              );
        }
    }

    // Draw cursor
    if (m_selected){
        QPen pen(Qt::DashLine);
        pen.setWidth(2);
        pen.setColor(QColor(100, 130, 170, 100));
        painter.setPen(pen);
        painter.drawRect(rect().x() + m_borderOffset,
                         rect().y() + m_borderOffset,
                         rect().width() - (m_borderOffset * 2),
                         rect().height() - (m_borderOffset * 2));
    }
}
