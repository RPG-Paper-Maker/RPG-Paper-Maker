/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "widgetautotilesselector.h"
#include "rpm.h"

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

void WidgetAutotilesSelector::currentTexture(QRect &rect) const {
    m_selectionRectangle->getCoefRect(rect);
}

// -------------------------------------------------------

void WidgetAutotilesSelector::setImage(SystemAutotile *autotile) {
    QString path = autotile->picture()->getPath(PictureKind::Autotiles);
    QImage image = (!path.isEmpty() && QFile::exists(path)) ? QImage(path) :
        QImage();
    float coef = RPM::coefReverseSquareSize();
    if (!image.isNull()) {
        Map::editPictureAutotilePreview(image, m_texture);
        m_texture = m_texture.scaled(static_cast<int>(m_texture.width() * coef),
            static_cast<int>(m_texture.height() * coef));
    } else
        m_texture = image;

    this->setGeometry(this->geometry().x(), this->geometry().y(), static_cast
        <int>(SystemAutotile::getPreviewWidth(m_texture) * coef), static_cast
        <int>(SystemAutotile::getPreviewHeight(m_texture) * coef));
    setFixedSize(static_cast<int>(SystemAutotile::getPreviewWidth(m_texture) *
        coef), static_cast<int>(SystemAutotile::getPreviewHeight(m_texture) *
        coef));

    // If cursor out of the new texture
    QRect cursorRect;
    m_selectionRectangle->getCoefRect(cursorRect);
    QRect newTextureRect(0, 0, SystemAutotile::getPreviewWidth(m_texture) /
        RPM::get()->getSquareSize(), SystemAutotile::getPreviewHeight(
        m_texture) / RPM::get()->getSquareSize());
    if (!newTextureRect.contains(cursorRect)) {
        makeSelection(0, 0);
    }

    this->repaint();
}

// -------------------------------------------------------

void WidgetAutotilesSelector::makeSelection(int x, int y, float zoom) {
    m_selectionRectangle->makeFirstSelection(x, y, zoom);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetAutotilesSelector::mousePressEvent(QMouseEvent *event) {
    if (event->button() == Qt::MouseButton::LeftButton) {
        makeSelection(event->x(), event->y());
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetAutotilesSelector::paintEvent(QPaintEvent *) {
    QPainter painter(this);
    /*

    int rows = SystemAutotile::getPreviewRows(m_texture);
    int columns = SystemAutotile::getPreviewColumns(m_texture);

    for (int i = 0; i < columns; i++) {
        for (int j = 0; j < rows; j++) {
            QRect out(i * RPM::BASIC_SQUARE_SIZE,
                      j * RPM::BASIC_SQUARE_SIZE,
                      RPM::BASIC_SQUARE_SIZE, RPM::BASIC_SQUARE_SIZE);
            QRect in(i * SystemAutotile::NUMBER_COLUMNS *
                     RPM::BASIC_SQUARE_SIZE,
                     j * SystemAutotile::NUMBER_ROWS * RPM::BASIC_SQUARE_SIZE,
                     RPM::BASIC_SQUARE_SIZE, RPM::BASIC_SQUARE_SIZE);
            painter.drawImage(out, m_texture, in);
        }
    }*/
    painter.drawImage(0, 0, m_texture);

    m_selectionRectangle->draw(painter);
}
