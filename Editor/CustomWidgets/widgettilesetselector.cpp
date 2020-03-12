/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgettilesetselector.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetSelector::WidgetTilesetSelector(QWidget *parent) :
    QWidget(parent),
    m_isResizable(true),
    m_selectionRectangle(new WidgetSelectionRectangle)
{

}

WidgetTilesetSelector::~WidgetTilesetSelector()
{
    delete m_selectionRectangle;
}

void WidgetTilesetSelector::setIsResizable(bool b) {
    m_isResizable = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetSelector::setCurrentTexture(QRect& rect) {
    m_selectionRectangle->setRectangle(rect.x(), rect.y(), rect.width(), rect
        .height());
}

void WidgetTilesetSelector::currentTexture(QRect& rect) const{
    m_selectionRectangle->getCoefRect(rect);
}

// -------------------------------------------------------

void WidgetTilesetSelector::setImage(QString path){
    m_textureTileset = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) :
        QImage();
    updateImage();
}

// -------------------------------------------------------

void WidgetTilesetSelector::setImageNone(){
    m_textureTileset = QImage();
    updateImage();
}

// -------------------------------------------------------

void WidgetTilesetSelector::updateImage(){
    if (!m_textureTileset.isNull()){
        float coef = RPM::coefReverseSquareSize();
        m_textureTileset = m_textureTileset.scaled(
                    m_textureTileset.width() * coef,
                    m_textureTileset.height() * coef);
    }
    this->setGeometry(0, 0,
                      m_textureTileset.width(),
                      m_textureTileset.height());
    setFixedSize(m_textureTileset.width(), m_textureTileset.height());

    // If cursor out of the new texture
    QRect cursorRect;
    m_selectionRectangle->getCoefRect(cursorRect);
    QRect newTextureRect(0, 0,
                         m_textureTileset.width() / RPM::BASIC_SQUARE_SIZE,
                         m_textureTileset.height() / RPM::BASIC_SQUARE_SIZE);
    if (!newTextureRect.contains(cursorRect)) {
        makeFirstSelection(0, 0);
        this->repaint();
    }

    // If < 32 x 32
    if (m_textureTileset.width() < RPM::BASIC_SQUARE_SIZE ||
        m_textureTileset.height() < RPM::BASIC_SQUARE_SIZE)
        selectNone();
}

// -------------------------------------------------------

void WidgetTilesetSelector::setRealCursorPosition(){
    m_selectionRectangle->setRealPosition();
}

// -------------------------------------------------------

void WidgetTilesetSelector::makeFirstSelection(int x, int y, float zoom){
    m_selectionRectangle->makeFirstSelection(x, y, zoom);
}

// -------------------------------------------------------

void WidgetTilesetSelector::makeSelection(int x, int y, float zoom){
    m_selectionRectangle->makeSelection(x, y,
                                        m_textureTileset.width(),
                                        m_textureTileset.height(),
                                        zoom);
}

// -------------------------------------------------------

void WidgetTilesetSelector::selectNone() {
    m_selectionRectangle->selectNone();
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetTilesetSelector::mousePressEvent(QMouseEvent *event){
    if (event->button() == Qt::MouseButton::LeftButton){
        makeFirstSelection(event->x(), event->y());
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetTilesetSelector::mouseMoveEvent(QMouseEvent *event) {
    if (event->buttons() == Qt::LeftButton && m_isResizable) {
        makeSelection(event->x(), event->y());
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetTilesetSelector::paintEvent(QPaintEvent *){
    QPainter painter(this);

    painter.drawImage(0, 0, m_textureTileset);
    m_selectionRectangle->draw(painter);
}
