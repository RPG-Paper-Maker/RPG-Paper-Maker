/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QPainter>
#include <QScrollBar>
#include <QApplication>
#include "widgetanimation.h"
#include "rpm.h"

const int WidgetAnimation::ELEMENT_INDEX_SIZE = 16;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetAnimation::WidgetAnimation(QWidget *parent) :
    QWidget(parent),
    m_scrollArea(nullptr),
    m_idBattler(1),
    m_positionKind(AnimationPositionKind::Middle),
    m_currentFrame(nullptr),
    m_widgetAnimationTexture(nullptr),
    m_hoveredElement(nullptr),
    m_moving(false),
    m_mouseOffsetX(0),
    m_mouseOffsetY(0)
{
    this->setFocus();
    this->setMouseTracking(true);
    this->setFixedWidth(RPM::SCREEN_BASIC_WIDTH);
    this->setFixedHeight(RPM::SCREEN_BASIC_HEIGHT);
    this->updateBattlerPicture(m_idBattler);
}

void WidgetAnimation::setScrollArea(QScrollArea *scrollArea) {
    m_scrollArea = scrollArea;
}

void WidgetAnimation::setAnimationPositionKind(AnimationPositionKind pk) {
    m_positionKind = pk;
    this->repaint();
}

void WidgetAnimation::setCurrentFrame(SystemAnimationFrame *cf) {
    m_currentFrame = cf;
    this->repaint();
}

void WidgetAnimation::setWidgetAnimationTexture(WidgetAnimationTexture *wat) {
    m_widgetAnimationTexture = wat;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetAnimation::updateBattlerPicture(int id) {
    m_idBattler = id;
    m_imageBattler = QImage(reinterpret_cast<SystemPicture *>(SuperListItem
        ::getById(RPM::get()->project()->picturesDatas()->model(PictureKind
        ::Battlers)->invisibleRootItem(), m_idBattler))->getPath(PictureKind
        ::Battlers));
    this->repaint();
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void WidgetAnimation::mouseMoveEvent(QMouseEvent *event) {
    SystemAnimationFrameElement *element;
    int x, y, i;

    // Update text coords
    x = event->x();
    y = event->y();
    if (m_positionKind != AnimationPositionKind::ScreenCenter) {
        x -= RPM::SCREEN_BASIC_WIDTH / 2;
        y -= RPM::SCREEN_BASIC_HEIGHT / 2;
    }
    m_textCoords = "[" + QString::number(x) + "," + QString::number(y) + "]";

    if (m_moving) {
        m_selectedElement->setX(x - m_mouseOffsetX);
        m_selectedElement->setY(y - m_mouseOffsetY);
    } else { // Update current hovered
        m_hoveredElement = nullptr;
        for (i = m_currentFrame->elementsCount() - 1; i >= 0; i--) {
            element = m_currentFrame->elementAt(i);
            if (x >= element->x() && x <= element->x() + WidgetAnimationTexture
                ::MAX_SIZE && y >= element->y() && y <= element->y() +
                WidgetAnimationTexture::MAX_SIZE)
            {
                m_hoveredElement = element;
                break;
            }
        }
    }

    this->repaint();
}

// -------------------------------------------------------

void WidgetAnimation::mousePressEvent(QMouseEvent *event) {
    if (event->buttons() & Qt::LeftButton) {
        int x, y;

        x = event->x();
        y = event->y();
        if (m_positionKind != AnimationPositionKind::ScreenCenter) {
            x -= RPM::SCREEN_BASIC_WIDTH / 2;
            y -= RPM::SCREEN_BASIC_HEIGHT / 2;
        }
        if (m_hoveredElement == nullptr) {
            m_selectedElement = m_currentFrame->addElement(x, y,
                m_widgetAnimationTexture->currentRow(), m_widgetAnimationTexture
                ->currentColumn());
        } else {
            m_selectedElement = m_hoveredElement;
            m_moving = true;
            m_mouseOffsetX = x - m_selectedElement->x();
            m_mouseOffsetY = y - m_selectedElement->y();
        }
        this->repaint();
    }
}

void WidgetAnimation::mouseReleaseEvent(QMouseEvent *event) {
    m_moving = false;
}

// -------------------------------------------------------

void WidgetAnimation::mouseLeaveEvent(QMouseEvent *) {
    m_textCoords = "";
    this->repaint();
}

// -------------------------------------------------------

void WidgetAnimation::paintEvent(QPaintEvent *) {
    QPainter painter(this);
    SystemAnimationFrameElement *element;
    QFont font;
    int i, l, offsetX, offsetY, frames, x, y;

    // Background
    painter.fillRect(0, 0, RPM::SCREEN_BASIC_WIDTH, RPM::SCREEN_BASIC_HEIGHT,
        RPM::COLOR_ALMOST_BLACK);
    painter.setPen(RPM::COLOR_GREY);
    painter.drawLine(0, RPM::SCREEN_BASIC_HEIGHT / 2, RPM::SCREEN_BASIC_WIDTH,
        RPM::SCREEN_BASIC_HEIGHT / 2);
    painter.drawLine(RPM::SCREEN_BASIC_WIDTH / 2, 0, RPM::SCREEN_BASIC_WIDTH /
        2, RPM::SCREEN_BASIC_HEIGHT);

    // Battler
    frames = RPM::get()->project()->gameDatas()->systemDatas()->framesAnimation();
    switch (m_positionKind) {
    case AnimationPositionKind::Top:
        offsetY = (m_imageBattler.height() / 9); break;
    case AnimationPositionKind::Middle:
        offsetY = -(m_imageBattler.height() / 9 / 2); break;
    case AnimationPositionKind::Bottom:
        offsetY = -(m_imageBattler.height() / 9); break;
    default:
        offsetY = 0; break;
    }
    if (m_positionKind != AnimationPositionKind::ScreenCenter) {
        painter.drawImage((RPM::SCREEN_BASIC_WIDTH / 2) - (m_imageBattler
            .width() / frames / 2), (RPM::SCREEN_BASIC_HEIGHT / 2) + offsetY,
            m_imageBattler, 0, 0, m_imageBattler.width() / frames,
            m_imageBattler.height() / 9);
    }

    // Elements
    if (m_currentFrame != nullptr) {
        font.setPixelSize(10);
        painter.setFont(font);
        for (i = 0, l = m_currentFrame->elementsCount(); i < l; i++) {
            element = m_currentFrame->elementAt(i);
            x = element->x();
            y = element->y();
            if (m_positionKind != AnimationPositionKind::ScreenCenter) {
                x += RPM::SCREEN_BASIC_WIDTH / 2;
                y += RPM::SCREEN_BASIC_HEIGHT / 2;
            }
            painter.drawImage(x, y, m_widgetAnimationTexture->image(),
                element->texColumn() * (m_widgetAnimationTexture->image()
                .width() / m_widgetAnimationTexture->rows()), element->texRow()
                * (m_widgetAnimationTexture->image().height() /
                m_widgetAnimationTexture->columns()), WidgetAnimationTexture
                ::MAX_SIZE, WidgetAnimationTexture::MAX_SIZE);
            painter.setPen(element == m_selectedElement ? RPM
                ::COLOR_MENU_SELECTION_BLUE : RPM::COLOR_PURPLE_SELECTION);
            painter.drawRect(x, y, WidgetAnimationTexture::MAX_SIZE,
                WidgetAnimationTexture::MAX_SIZE);
            painter.drawRect(x + 1, y + 1, WidgetAnimationTexture::MAX_SIZE - 2,
                WidgetAnimationTexture::MAX_SIZE - 2);
            painter.drawRect(x, y, ELEMENT_INDEX_SIZE, ELEMENT_INDEX_SIZE);
            painter.drawRect(x, y, ELEMENT_INDEX_SIZE + 1, ELEMENT_INDEX_SIZE +
                1);
            painter.drawText(x + 4, y + ELEMENT_INDEX_SIZE - 4, QString::number(
                element->id()));
            if (m_hoveredElement == element) {
                painter.fillRect(x, y, WidgetAnimationTexture::MAX_SIZE,
                    WidgetAnimationTexture::MAX_SIZE, RPM
                    ::COLOR_GRAY_HOVER_BACKGROUND);
            }
        }
    }

    // HUD
    offsetX = m_scrollArea == nullptr ? 0 : m_scrollArea->horizontalScrollBar()
        ->value();
    offsetY = m_scrollArea == nullptr ? 0 : m_scrollArea->verticalScrollBar()
        ->value();
    painter.setPen(RPM::COLOR_ALMOST_WHITE);
    font.setPixelSize(13);
    painter.drawText(offsetX, 10 + offsetY, m_textCoords);
    if (m_selectedElement != nullptr) {
        QFontMetrics fm(font);
        QString coords;

        coords = m_selectedElement->getPositionString();
        painter.setPen(RPM::COLOR_MENU_SELECTION_BLUE);
        painter.drawText(m_scrollArea->width() + offsetX - fm.width(coords) -
            m_scrollArea->verticalScrollBar()->width(), 10 + offsetY, coords);
    }
}
