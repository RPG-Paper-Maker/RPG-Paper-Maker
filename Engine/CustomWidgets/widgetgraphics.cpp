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
//  EVENTS
//
// -------------------------------------------------------

void WidgetGraphics::mousePressEvent(QMouseEvent*){
    m_selected = true;
    repaint();
}

// -------------------------------------------------------

void WidgetGraphics::mouseDoubleClickEvent(QMouseEvent*){
    if (m_state->graphicsKind() != MapEditorSubSelectionKind::None){
        PictureKind kind;
        SystemPicture* picture;

        // Get picture
        switch (m_state->graphicsKind()){
        case MapEditorSubSelectionKind::SpritesFix:
            kind = PictureKind::Characters; break;
        default:
            kind = PictureKind::None;
        }
        picture = (SystemPicture*) SuperListItem::getById(
                    Wanok::get()->project()->picturesDatas()->model(kind)
                    ->invisibleRootItem(), m_state->graphicsId());

        // Open dialog preview
        DialogPicturesPreview dialog(picture, kind);
        if (dialog.exec() == QDialog::Accepted)
            m_state->setGraphicsId(dialog.picture()->id());
    }
}

// -------------------------------------------------------

void WidgetGraphics::paintEvent(QPaintEvent* event){
    QFrame::paintEvent(event);

    QPainter painter(this);

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
