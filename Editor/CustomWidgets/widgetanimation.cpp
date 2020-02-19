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
#include "common.h"

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
    m_selectedElement(nullptr),
    m_copiedElement(nullptr),
    m_moving(false),
    m_mouseOffsetX(0),
    m_mouseOffsetY(0),
    m_lastMouseX(0),
    m_lastMouseY(0)
{
    this->setFocus();
    this->setMouseTracking(true);
    this->setFixedWidth(RPM::SCREEN_BASIC_WIDTH);
    this->setFixedHeight(RPM::SCREEN_BASIC_HEIGHT);
    this->updateBattlerPicture(m_idBattler);
    this->setContextMenuPolicy(Qt::CustomContextMenu);
    m_contextMenu = ContextMenuList::createContextSuperList(this);
    connect(this, SIGNAL(customContextMenuRequested(const QPoint &)), this, SLOT
        (showContextMenu(const QPoint &)));
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
    m_selectedElement = nullptr;
    m_hoveredElement = nullptr;
    this->repaint();
}

void WidgetAnimation::setWidgetAnimationTexture(WidgetAnimationTexture *wat) {
    m_widgetAnimationTexture = wat;
}

SystemAnimationFrameElement * WidgetAnimation::selectedElement() const {
    return m_selectedElement;
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

SystemPicture * WidgetAnimation::pictureBattler() const {
    return reinterpret_cast<SystemPicture *>(SuperListItem::getById(RPM::get()
        ->project()->picturesDatas()->model(PictureKind::Battlers)
        ->invisibleRootItem(), m_idBattler, true));
}

// -------------------------------------------------------

void WidgetAnimation::updateContextMenuCan() {
    m_contextMenu->canEdit(m_selectedElement != nullptr);
    m_contextMenu->canCopy(m_selectedElement != nullptr);
    m_contextMenu->canPaste(m_copiedElement != nullptr);
    m_contextMenu->canDelete(m_selectedElement != nullptr);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void WidgetAnimation::keyPressEvent(QKeyEvent *event) {
    QList<QAction *> actions;
    QKeySequence seq;
    QAction* action;

    seq = Common::getKeySequence(event);
    actions = m_contextMenu->actions();

    // Forcing shortcuts
    action = actions.at(5);
    if (action->shortcut().matches(seq) && action->isEnabled()) {
        this->contextDelete();
        return;
    }
    action = actions.at(0);
    if (Common::isPressingEnter(event) && action->isEnabled()) {
        this->contextEdit();
        return;
    }
    action = actions.at(2);
    if (action->shortcut().matches(seq) && action->isEnabled()) {
        contextCopy();
        return;
    }
    action = actions.at(3);
    if (action->shortcut().matches(seq) && action->isEnabled()) {
        contextPaste();
        return;
    }
}

// -------------------------------------------------------

void WidgetAnimation::mouseDoubleClickEvent(QMouseEvent *) {
    this->contextEdit();
}

// -------------------------------------------------------

void WidgetAnimation::mouseMoveEvent(QMouseEvent *event) {
    SystemAnimationFrameElement *element;
    int x, y;

    this->setFocus();

    // Update text coords
    x = event->x();
    y = event->y();
    m_lastMouseX = x;
    m_lastMouseY = y;
    if (m_positionKind != AnimationPositionKind::ScreenCenter) {
        x -= RPM::SCREEN_BASIC_WIDTH / 2;
        y -= RPM::SCREEN_BASIC_HEIGHT / 2;
    }
    m_textCoords = "[" + QString::number(x) + "," + QString::number(y) + "]";

    // Update current hovered
    if (m_moving) {
        m_selectedElement->setX(x - m_mouseOffsetX);
        m_selectedElement->setY(y - m_mouseOffsetY);
    } else {
        QRect rect;
        int i, ex, ey, w, h, cx, cy;

        m_hoveredElement = nullptr;
        for (i = m_currentFrame->elementsCount() - 1; i >= 0; i--) {
            element = m_currentFrame->elementAt(i);
            cx = element->x();
            cy = element->y();
            w = qRound(m_widgetAnimationTexture->baseImage().width() /
                m_widgetAnimationTexture->columns() * (element->zoom() / 100.0));
            h = qRound(m_widgetAnimationTexture->baseImage().height() /
                m_widgetAnimationTexture->rows() * (element->zoom() / 100.0));
            ex = cx - (w / 2);
            ey = cy - (h / 2);
            rect.setCoords(ex, ey, ex + w, ey + h);
            if (rect.contains(Common::rotatePoint(x, y, cx, cy, -element
                ->angle())))
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
    this->setFocus();
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
            m_hoveredElement = m_selectedElement;
        } else {
            m_selectedElement = m_hoveredElement;
        }
        m_moving = true;
        m_mouseOffsetX = x - m_selectedElement->x();
        m_mouseOffsetY = y - m_selectedElement->y();
        this->repaint();
    } else if (event->buttons() & Qt::RightButton) {
        m_selectedElement = m_hoveredElement;
        this->repaint();
    }
    this->updateContextMenuCan();
}

void WidgetAnimation::mouseReleaseEvent(QMouseEvent *) {
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
    int i, l, offsetX, offsetY, frames, x, y, w, h, hw, hh;

    // Anti aliasing
    painter.setRenderHint(QPainter::Antialiasing);

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
        QRect rectTarget, rectSource;
        int sx, sy, sw, sh;
        double angle, flip;

        font.setPixelSize(10);
        painter.setFont(font);
        for (i = 0, l = m_currentFrame->elementsCount(); i < l; i++) {
            element = m_currentFrame->elementAt(i);
            sx = element->texColumn() * (m_widgetAnimationTexture->image()
                .width() / m_widgetAnimationTexture->rows());
            sy = element->texRow() * (m_widgetAnimationTexture->image().height()
                / m_widgetAnimationTexture->columns());
            sw = m_widgetAnimationTexture->baseImage().width() /
                m_widgetAnimationTexture->columns();
            sh = m_widgetAnimationTexture->baseImage().height() /
                m_widgetAnimationTexture->rows();
            w = qRound(m_widgetAnimationTexture->baseImage().width() /
                m_widgetAnimationTexture->columns() * (element->zoom() / 100.0));
            h = qRound(m_widgetAnimationTexture->baseImage().height() /
                m_widgetAnimationTexture->rows() * (element->zoom() / 100.0));
            hw = w / 2;
            hh = h / 2;
            x = element->x() - hw;
            y = element->y() - hh;
            if (m_positionKind != AnimationPositionKind::ScreenCenter) {
                x += RPM::SCREEN_BASIC_WIDTH / 2;
                y += RPM::SCREEN_BASIC_HEIGHT / 2;
            }
            angle = element->angle();
            flip = element->flipVerticaly() ? -1 : 1;
            painter.save();
            painter.translate(x + hw, y + hh);
            painter.scale(flip, 1);
            painter.rotate(angle);
            painter.setOpacity(element->opacity() / 100.0);
            rectTarget.setCoords(-hw, -hh, -hw + w, -hw + h);
            rectSource.setCoords(sx, sy, sx + sw, sy + sh);
            painter.drawImage(rectTarget, m_widgetAnimationTexture->image(),
                rectSource);
            painter.restore();
            painter.save();
            painter.translate(x + hw, y + hh);
            painter.rotate(angle);
            painter.setOpacity(1.0);
            painter.setPen(element == m_selectedElement ? RPM
                ::COLOR_MENU_SELECTION_BLUE : RPM::COLOR_PURPLE_SELECTION);
            painter.drawRect(-hw, -hh, w, h);
            painter.drawRect(-hw + 1, -hh + 1, w - 2, h - 2);
            painter.fillRect(-hw, -hh, ELEMENT_INDEX_SIZE, ELEMENT_INDEX_SIZE,
                RPM::COLOR_PURPLE_SELCTION_BACKGROUND);
            painter.drawRect(-hw, -hh, ELEMENT_INDEX_SIZE, ELEMENT_INDEX_SIZE);
            painter.drawRect(-hw, -hh, ELEMENT_INDEX_SIZE + 1,
                ELEMENT_INDEX_SIZE + 1);
            painter.drawText(-hw + 4, -hh + ELEMENT_INDEX_SIZE - 4, QString
                ::number(element->id()));
            if (m_hoveredElement == element) {
                painter.fillRect(-hw, -hh, w, h, RPM
                    ::COLOR_GRAY_HOVER_BACKGROUND);
            }
            painter.restore();
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

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetAnimation::showContextMenu(const QPoint &p) {
    this->updateContextMenuCan();
    m_contextMenu->showContextMenu(p);
}

// -------------------------------------------------------

void WidgetAnimation::contextEdit() {
    if (m_selectedElement->openDialog()) {
        m_currentFrame->reorder(m_selectedElement);
        this->repaint();
    }
}

// -------------------------------------------------------

void WidgetAnimation::contextCopy() {
    m_copiedElement = reinterpret_cast<SystemAnimationFrameElement *>(
        m_selectedElement->createCopy());
}

// -------------------------------------------------------

void WidgetAnimation::contextPaste() {
    SystemAnimationFrameElement *element;
    int x, y;

    x = m_lastMouseX;
    y = m_lastMouseY;
    if (m_positionKind != AnimationPositionKind::ScreenCenter) {
        x -= RPM::SCREEN_BASIC_WIDTH / 2;
        y -= RPM::SCREEN_BASIC_HEIGHT / 2;
    }
    element = reinterpret_cast<SystemAnimationFrameElement *>(m_copiedElement
        ->createCopy());
    element->setX(x);
    element->setY(y);
    element->setId(m_currentFrame->getElementMaxIndex() + 1);
    m_currentFrame->addElement(element);
    this->repaint();
}

// -------------------------------------------------------

void WidgetAnimation::contextDelete() {
    m_currentFrame->deleteElement(m_selectedElement);
    m_selectedElement = nullptr;
    m_hoveredElement = nullptr;
    this->repaint();
}
