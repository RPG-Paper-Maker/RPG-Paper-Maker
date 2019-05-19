/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "widgetgraphics.h"
#include "dialogpicturespreview.h"
#include "rpm.h"
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

void WidgetGraphics::setState(SystemState* s) {
    m_state = s;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemPicture* WidgetGraphics::getPicture(bool check) {
    PictureKind kind = getPictureKind();

    return m_state->graphicsId() == 0 && check ? RPM::get()->project()->currentMap(true)
        ->mapProperties()->tileset()->picture() : reinterpret_cast<
        SystemPicture *>(SuperListItem::getById(RPM::get()->project()
        ->picturesDatas()->model(kind)->invisibleRootItem(), m_state
        ->graphicsId()));
}

// -------------------------------------------------------

PictureKind WidgetGraphics::getPictureKind(bool check) {
    switch (m_state->graphicsKind()) {
    case MapEditorSubSelectionKind::SpritesFix:
    case MapEditorSubSelectionKind::SpritesFace:
        return m_state->graphicsId() == 0 && check ? PictureKind::Tilesets :
            PictureKind::Characters;
    default:
        return PictureKind::None;
    }
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetGraphics::mousePressEvent(QMouseEvent *) {
    m_selected = true;
    repaint();
}

// -------------------------------------------------------

void WidgetGraphics::mouseDoubleClickEvent(QMouseEvent *) {

    bool wasNone = false;
    if (m_state->graphicsKind() == MapEditorSubSelectionKind::None) {
        wasNone = true;
        reinterpret_cast<PanelObject *>(this->parent())->passToSprite();
    }

    PictureKind kind;
    SystemPicture *picture;

    // Get picture
    kind = getPictureKind();
    picture = getPicture();

    // Open dialog preview
    DialogPicturesPreview dialog(picture, kind);
    if (m_state->graphicsId() == 0) {
        dialog.setCurrentTexture(m_state->rectTileset());
    } else {
        dialog.setIndexX(m_state->indexX());
        dialog.setIndexY(m_state->indexY());
    }

    if (dialog.exec() == QDialog::Accepted) {
        RPM::get()->project()->writePicturesDatas();
        m_state->setGraphicsId(dialog.picture()->id());
        m_state->setIndexX(dialog.indexX());
        m_state->setIndexY(dialog.indexY());
        QRect rect;
        dialog.currentTexture(rect);
        m_state->setRectTileset(rect);
    } else {
        RPM::get()->project()->readPicturesDatas();
        if (wasNone)
            reinterpret_cast<PanelObject *>(this->parent())->passToNone();
    }

    repaint();
}

// -------------------------------------------------------

void WidgetGraphics::paintEvent(QPaintEvent *event) {
    QFrame::paintEvent(event);

    QPainter painter(this);

    // Draw background
    painter.fillRect(QRectF(rect().x() + 1, rect().y() + 1, rect().width() - 2,
        rect().height() - 2), RPM::colorAlmostTransparent);

    // Draw image
    if (m_state->graphicsKind() != MapEditorSubSelectionKind::None) {
        if (m_state->graphicsId() != -1) {
            PictureKind kind = getPictureKind(true);
            SystemPicture* picture = getPicture(true);
            QImage image(picture->getPath(kind));
            float coef = RPM::coefReverseSquareSize();
            int x, y, newX, newY, width, height, newWidth, newHeight;
            QRect rect;
            int squareSize = RPM::get()->getSquareSize();

            if (m_state->graphicsId() == 0) {
                rect = m_state->rectTileset();
                width = rect.width() * squareSize;
                height = rect.height() * squareSize;
                newX = rect.x() * squareSize;
                newY = rect.y() * squareSize;
            } else {
                width = image.width() / RPM::get()->project()->gameDatas()
                    ->systemDatas()->framesAnimation();
                height = image.height() / RPM::get()->project()->gameDatas()
                    ->systemDatas()->framesAnimation();
                newX = m_state->indexX() * width;
                newY = m_state->indexY() * height;
            }

            newWidth = static_cast<int>(width * coef);
            newHeight = static_cast<int>(height * coef);
            x = (this->rect().width() - newWidth) / 2;
            y = (this->rect().height() - newHeight) / 2;

            painter.drawImage(QRect(x, y, newWidth, newHeight), image, QRect(
                newX, newY, width, height));
        }
    }

    // Draw cursor
    if (m_selected) {
        QPen pen(Qt::DashLine);
        pen.setWidth(2);
        pen.setColor(QColor(100, 130, 170, 100));
        painter.setPen(pen);
        painter.drawRect(rect().x() + m_borderOffset, rect().y() + m_borderOffset,
            rect().width() - (m_borderOffset * 2), rect().height() - (
            m_borderOffset * 2));
    }
}
