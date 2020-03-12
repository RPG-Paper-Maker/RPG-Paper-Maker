/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetselectionrectangle.h"
#include "rpm.h"

const int WidgetSelectionRectangle::BORDER_SIZE = 4;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetSelectionRectangle::WidgetSelectionRectangle(QWidget *parent) :
    QWidget(parent)
{
    m_textureCursor = QImage(":/textures/Ressources/tileset_cursor.png");
    m_rect.setCoords(0, 0,
                     RPM::BASIC_SQUARE_SIZE - 1,
                     RPM::BASIC_SQUARE_SIZE - 1);
    m_realX = 0;
    m_realY = 0;
    m_squareWidth = RPM::BASIC_SQUARE_SIZE;
    m_squareHeight = RPM::BASIC_SQUARE_SIZE;
}

WidgetSelectionRectangle::~WidgetSelectionRectangle()
{

}

void WidgetSelectionRectangle::setSquareWidth(int s) { m_squareWidth = s; }

void WidgetSelectionRectangle::setSquareHeight(int s) { m_squareHeight = s; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetSelectionRectangle::getCoefRect(QRect& rect) const{
    if (m_squareWidth != 0 && m_squareHeight != 0){
        rect.setX(m_realX / m_squareWidth);
        rect.setY(m_realY / m_squareHeight);
        rect.setWidth(m_rect.width() / m_squareWidth);
        rect.setHeight(m_rect.height() / m_squareHeight);
    }
    else {
        rect.setX(0); rect.setY(0); rect.setWidth(0); rect.setHeight(0);
    }
}

// -------------------------------------------------------

void WidgetSelectionRectangle::setRectangle(int x, int y,
                                            int width, int height)
{
    if (m_squareWidth != 0 && m_squareHeight != 0){
        m_rect.setX(x * m_squareWidth);
        m_rect.setY(y  * m_squareHeight);
        m_rect.setWidth(width * m_squareWidth);
        m_rect.setHeight(height * m_squareHeight);
    }
}

// -------------------------------------------------------

void WidgetSelectionRectangle::setRealPosition(){
    m_rect.setX(m_realX);
    m_rect.setY(m_realY);
}

// -------------------------------------------------------

void WidgetSelectionRectangle::makeFirstSelection(int x, int y, float zoom){
    if (m_squareWidth != 0 && m_squareHeight != 0){
        x = x / m_squareWidth;
        y = y / m_squareHeight;
        setRectangle((int)(x / zoom), (int)(y / zoom), 1, 1);
        m_realX = m_rect.x();
        m_realY = m_rect.y();
    }
}

// -------------------------------------------------------

void WidgetSelectionRectangle::makeSelection(int x, int y, int w, int h,
                                             float zoom)
{
    if (m_squareWidth != 0 && m_squareHeight != 0){

        // Setting width
        if (x < 0)
            x = 0;
        if (x >= w)
            x = w - 1;
        x = (int)(x / zoom);
        int init_pos_x = m_rect.x() / m_squareWidth;
        int pos_x = x / m_squareWidth;
        int i_x = init_pos_x <= pos_x ? 1 : -1;
        int width = (pos_x - init_pos_x) + i_x;
        m_rect.setWidth(width * m_squareWidth);

        // Setting height
        if (y < 0)
            y = 0;
        if (y >= h)
            y = h - 1;
        y = (int)(y / zoom);
        int init_pos_y = m_rect.y() / m_squareHeight;
        int pos_y = y / m_squareHeight;
        int i_y = init_pos_y <= pos_y ? 1 : -1;
        int height = (pos_y - init_pos_y) + i_y;
        m_rect.setHeight(height * m_squareHeight);
    }
}

// -------------------------------------------------------

void WidgetSelectionRectangle::selectNone() {
    m_rect.setWidth(0); m_rect.setHeight(0);
}

// -------------------------------------------------------

void WidgetSelectionRectangle::draw(QPainter& painter, float zoom){

    // Setting coords
    int x = m_rect.x();
    int xWidth = 0;

    if (m_rect.width() < 0){
        x += m_rect.width() + m_squareWidth;
        m_rect.setWidth(-m_rect.width());
        xWidth = m_rect.width() - m_squareWidth;
    }

    int y = m_rect.y();
    int yHeight = 0;

    if (m_rect.height() < 0)
    {
        y += m_rect.height() + m_squareHeight;
        m_rect.setHeight(-m_rect.height());
        yHeight = m_rect.height() - m_squareHeight;
    }

    if (m_squareWidth != 0 && m_squareHeight != 0)
        drawSquare(painter, x, y, zoom);

    m_realX = m_rect.x() - xWidth;
    m_realY = m_rect.y() - yHeight;
}

// -------------------------------------------------------

void WidgetSelectionRectangle::drawSquare(QPainter &painter,
                                          int x, int y, float zoom)
{
    // Left-Top
    painter.drawImage(QRect((int)(x * zoom),
                            (int)(y * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(0, 0, BORDER_SIZE, BORDER_SIZE)
                      );
    // Right-Top
    painter.drawImage(QRect((int)((x + m_rect.width() - BORDER_SIZE) * zoom),
                            (int)(y * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(m_textureCursor.width() - BORDER_SIZE,
                            0,
                            BORDER_SIZE,
                            BORDER_SIZE)
                      );
    // Right-Bot
    painter.drawImage(QRect((int)((x + m_rect.width() - BORDER_SIZE) * zoom),
                            (int)((y + m_rect.height() - BORDER_SIZE) * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(m_textureCursor.width() - BORDER_SIZE,
                            m_textureCursor.height() - BORDER_SIZE,
                            BORDER_SIZE,
                            BORDER_SIZE)
                      );
    // Left-Bot
    painter.drawImage(QRect((int)(x * zoom),
                            (int)((y + m_rect.height() - BORDER_SIZE) * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(0,
                            m_textureCursor.height() - BORDER_SIZE,
                            BORDER_SIZE,
                            BORDER_SIZE)
                      );

    // Top
    painter.drawImage(QRect((int)((x + BORDER_SIZE) * zoom),
                            (int)(y * zoom),
                            (int)((m_rect.width() - (BORDER_SIZE * 2)) * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(BORDER_SIZE, 0, 1, BORDER_SIZE)
                      );
    // Right
    painter.drawImage(QRect((int)((x + m_rect.width() - BORDER_SIZE) * zoom),
                            (int)((y + BORDER_SIZE) * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)((m_rect.height() - (BORDER_SIZE * 2))
                                  * zoom)),
                      m_textureCursor,
                      QRect(0, BORDER_SIZE, BORDER_SIZE, 1)
                      );
    // Bot
    painter.drawImage(QRect((int)((x + BORDER_SIZE) * zoom),
                            (int)((y + m_rect.height() - BORDER_SIZE) * zoom),
                            (int)((m_rect.width() - (BORDER_SIZE * 2)) * zoom),
                            (int)(BORDER_SIZE * zoom)),
                      m_textureCursor,
                      QRect(BORDER_SIZE, 0, 1, BORDER_SIZE)
                      );
    // Left
    painter.drawImage(QRect((int)(x * zoom),
                            (int)((y + BORDER_SIZE) * zoom),
                            (int)(BORDER_SIZE * zoom),
                            (int)((m_rect.height() - (BORDER_SIZE * 2)))),
                      m_textureCursor,
                      QRect(0, BORDER_SIZE, BORDER_SIZE, 1)
                      );
}
