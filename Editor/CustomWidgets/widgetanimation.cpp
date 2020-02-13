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
#include "widgetanimation.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetAnimation::WidgetAnimation(QWidget *parent) :
    QWidget(parent),
    m_scrollArea(nullptr),
    m_idBattler(1)
{
    this->setFocus();
    this->setMouseTracking(true);
    this->setFixedWidth(640);
    this->setFixedHeight(480);
    this->updateBattlePicture(m_idBattler);
}

void WidgetAnimation::setScrollArea(QScrollArea *scrollArea) {
    m_scrollArea = scrollArea;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetAnimation::updateBattlePicture(int id) {
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

void WidgetAnimation::mousePressEvent(QMouseEvent *event) {

}

// -------------------------------------------------------

void WidgetAnimation::mouseMoveEvent(QMouseEvent *event) {
    m_textCoords = "[" + QString::number(event->x()) + "," + QString::number(event
        ->y()) + "]";
    this->repaint();
}

// -------------------------------------------------------

void WidgetAnimation::mouseLeaveEvent(QMouseEvent *) {
    m_textCoords = "";
    this->repaint();
}

// -------------------------------------------------------

void WidgetAnimation::paintEvent(QPaintEvent *) {
    QPainter painter(this);
    int offsetX, offsetY, frames;

    // Background
    painter.fillRect(0, 0, RPM::SCREEN_BASIC_WIDTH, RPM::SCREEN_BASIC_HEIGHT,
        RPM::COLOR_ALMOST_BLACK);
    painter.setPen(RPM::COLOR_ALMOST_WHITE);
    painter.drawLine(0, RPM::SCREEN_BASIC_HEIGHT / 2, RPM::SCREEN_BASIC_WIDTH,
        RPM::SCREEN_BASIC_HEIGHT / 2);
    painter.drawLine(RPM::SCREEN_BASIC_WIDTH / 2, 0, RPM::SCREEN_BASIC_WIDTH /
        2, RPM::SCREEN_BASIC_HEIGHT);

    // Battler
    frames = RPM::get()->project()->gameDatas()->systemDatas()->framesAnimation();
    painter.drawImage((RPM::SCREEN_BASIC_WIDTH / 2) - (m_imageBattler.width() /
        frames / 2), (RPM::SCREEN_BASIC_HEIGHT / 2) - (m_imageBattler.height() /
        9 / 2), m_imageBattler, 0, 0, m_imageBattler.width() / frames,
        m_imageBattler.height() / 9);

    // HUD
    offsetX = m_scrollArea == nullptr ? 0 : m_scrollArea->horizontalScrollBar()
        ->value();
    offsetY = m_scrollArea == nullptr ? 0 : m_scrollArea->verticalScrollBar()
        ->value();
    painter.drawText(20 + offsetX, 20 + offsetY, m_textCoords);
}
