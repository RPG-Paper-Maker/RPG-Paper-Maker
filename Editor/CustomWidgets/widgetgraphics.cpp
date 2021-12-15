/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetgraphics.h"
#include "dialogpicturespreview.h"
#include "rpm.h"
#include "panelgraphics.h"
#include "dialogspecialelements.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetGraphics::WidgetGraphics(QWidget *parent) :
    WidgetPreviewObject3D(parent),
    m_state(nullptr),
    m_selected(false),
    m_borderOffset(5),
    m_valueID(nullptr),
    m_properties(nullptr),
    m_parameters(nullptr),
    m_isValueID(false)
{

}

WidgetGraphics::~WidgetGraphics()
{

}

void WidgetGraphics::setState(SystemState* s)
{
    m_state = s;
}

bool WidgetGraphics::isValueID() const
{
    return m_isValueID;
}

int WidgetGraphics::id() const
{
    return m_id;
}

int WidgetGraphics::indexX() const
{
    return m_indexX;
}

int WidgetGraphics::indexY() const
{
    return m_indexY;
}

QRect WidgetGraphics::currentRect() const
{
    return m_currentRect;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetGraphics::initializeParametersProperties(PrimitiveValue *valueID,
    QStandardItemModel *properties, QStandardItemModel *parameters)
{
    m_valueID = valueID;
    m_properties = properties;
    m_parameters = parameters;
}

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

void WidgetGraphics::updateCurrentObject()
{
    this->loadObject(reinterpret_cast<SystemObject3D *>(SuperListItem::getById(
        RPM::get()->project()->specialElementsDatas()->modelObjects3D()
        ->invisibleRootItem(), m_state->graphicsId())));
    this->updateObject();
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
    if (m_state->graphicsKind() == MapEditorSubSelectionKind::None)
    {
        wasNone = true;
        reinterpret_cast<PanelGraphics *>(this->parent())->passToSprite();
    }

    switch (m_state->graphicsKind())
    {
    case MapEditorSubSelectionKind::SpritesFix:
    case MapEditorSubSelectionKind::SpritesFace:
    {
        PictureKind kind;
        SystemPicture *picture;

        // Get picture
        kind = getPictureKind();
        picture = getPicture();

        // Open dialog preview
        m_isValueID = false;
        DialogPicturesPreview dialog(picture, kind, m_valueID, m_properties,
            m_parameters);
        if (m_state->graphicsId() == 0) {
            dialog.setCurrentTexture(m_state->rectTileset());
        } else {
            dialog.setIndexX(m_state->indexX());
            dialog.setIndexY(m_state->indexY());
        }

        if (dialog.exec() == QDialog::Accepted) {
            m_isValueID = dialog.isIDValue();
            m_id = dialog.picture()->id();
            m_indexX = dialog.indexX();
            m_indexY = dialog.indexY();
            RPM::get()->project()->writePicturesDatas();
            m_state->setGraphicsId(dialog.picture()->id());
            m_state->setIndexX(dialog.indexX());
            m_state->setIndexY(dialog.indexY());
            QRect rect;
            dialog.currentTexture(rect);
            m_state->setRectTileset(rect);
            m_currentRect = rect;
        } else {
            RPM::get()->project()->readPicturesDatas();
            if (wasNone)
                reinterpret_cast<PanelGraphics *>(this->parent())->passToNone();
        }
        break;
    }
    case MapEditorSubSelectionKind::Object3D:
    {
        DialogSpecialElements dialog(PictureKind::Object3D);
        dialog.selectSpecialElement(m_object3D);
        if (dialog.exec() == QDialog::Accepted)
        {
            m_state->setGraphicsId(dialog.getSpecialElement()->id());
        }
        this->updateCurrentObject();
        repaint();
        break;
    }
    default:
        break;
    }
    this->repaint();
}

// -------------------------------------------------------

void WidgetGraphics::paintEvent(QPaintEvent*)
{
    this->paintGL();
}

// -------------------------------------------------------

void WidgetGraphics::paintGL() {
    QPainter painter(this);

    // 3D
    painter.beginNativePainting();
    WidgetPreviewObject3D::paintGL();
    painter.endNativePainting();

    // Draw image
    if (m_state->graphicsKind() == MapEditorSubSelectionKind::SpritesFix ||
        m_state->graphicsKind() == MapEditorSubSelectionKind::SpritesFace)
    {
        if (m_state->graphicsId() != -1)
        {
            SystemPicture* picture = getPicture(true);
            QImage image(picture->getPath());
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
                height = image.height() / this->getPicture()->getRows();
                newX = (m_state->indexX() >= RPM::get()->project()->gameDatas()
                    ->systemDatas()->framesAnimation() ? RPM::get()->project()
                    ->gameDatas()->systemDatas()->framesAnimation() - 1 :
                    m_state->indexX()) * width;
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
        pen.setColor(RPM::COLOR_PURPLE_SELECTION);
        painter.setPen(pen);
        painter.drawRect(rect().x() + m_borderOffset, rect().y() + m_borderOffset,
            rect().width() - (m_borderOffset * 2), rect().height() - (
            m_borderOffset * 2));
    }
    painter.end();
}
