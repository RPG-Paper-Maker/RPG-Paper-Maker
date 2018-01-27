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

#include "widgetautotilesselector.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetAutotilesSelector::WidgetAutotilesSelector(QWidget *parent) :
    QWidget(parent),
    m_selectionRectangle(new WidgetSelectionRectangle)
{

}

WidgetAutotilesSelector::~WidgetAutotilesSelector()
{
    delete m_selectionRectangle;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetAutotilesSelector::currentTexture(QRect& rect) const{
    m_selectionRectangle->getCoefRect(rect);
}

// -------------------------------------------------------

void WidgetAutotilesSelector::setImage(SystemAutotile* autotile){
    m_texture = QImage(autotile->picture()->getPath(PictureKind::Autotiles));
    if (!m_texture.isNull()){
        float coef = Wanok::coefReverseSquareSize();
        m_texture = m_texture.scaled(m_texture.width() * coef,
                                     m_texture.height() * coef);
    }
    this->setGeometry(this->geometry().x(), this->geometry().y(),
                      getPreviewWidth(), getPreviewHeight());
    setFixedSize(getPreviewWidth(), getPreviewHeight());

    // If cursor out of the new texture
    QRect cursorRect;
    m_selectionRectangle->getCoefRect(cursorRect);
    QRect newTextureRect(0, 0,
                         getPreviewWidth() / Wanok::BASIC_SQUARE_SIZE,
                         getPreviewHeight() / Wanok::BASIC_SQUARE_SIZE);
    if (!newTextureRect.contains(cursorRect)) {
        makeSelection(0, 0);
        this->repaint();
    }
}

// -------------------------------------------------------

int WidgetAutotilesSelector::getPreviewWidth() const {
    return getPreviewColumns() * Wanok::BASIC_SQUARE_SIZE;
}

// -------------------------------------------------------

int WidgetAutotilesSelector::getPreviewHeight() const {
    return getPreviewRows() * Wanok::BASIC_SQUARE_SIZE;
}

// -------------------------------------------------------

int WidgetAutotilesSelector::getPreviewColumns() const {
    return getPreviewSize(m_texture.width()) / SystemAutotile::NUMBER_COLUMNS;
}

// -------------------------------------------------------

int WidgetAutotilesSelector::getPreviewRows() const {
    return getPreviewSize(m_texture.height()) / SystemAutotile::NUMBER_ROWS;
}

// -------------------------------------------------------

int WidgetAutotilesSelector::getPreviewSize(int size) const {
    return size / Wanok::BASIC_SQUARE_SIZE;
}

// -------------------------------------------------------

void WidgetAutotilesSelector::makeSelection(int x, int y, float zoom){
    m_selectionRectangle->makeFirstSelection(x, y, zoom);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetAutotilesSelector::mousePressEvent(QMouseEvent *event){
    if (event->button() == Qt::MouseButton::LeftButton){
        makeSelection(event->x(), event->y());
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetAutotilesSelector::paintEvent(QPaintEvent *){
    QPainter painter(this);

    int rows = getPreviewRows();
    int columns = getPreviewColumns();

    for (int i = 0; i < columns; i++) {
        for (int j = 0; j < rows; j++) {
            QRect out(i * Wanok::BASIC_SQUARE_SIZE,
                      j * Wanok::BASIC_SQUARE_SIZE,
                      Wanok::BASIC_SQUARE_SIZE, Wanok::BASIC_SQUARE_SIZE);
            QRect in(i * SystemAutotile::NUMBER_COLUMNS *
                     Wanok::BASIC_SQUARE_SIZE,
                     j * SystemAutotile::NUMBER_ROWS * Wanok::BASIC_SQUARE_SIZE,
                     Wanok::BASIC_SQUARE_SIZE, Wanok::BASIC_SQUARE_SIZE);
            painter.drawImage(out, m_texture, in);
        }
    }

    m_selectionRectangle->draw(painter);
}
