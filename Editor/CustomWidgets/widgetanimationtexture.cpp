/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QPainter>
#include <QtMath>
#include "widgetanimationtexture.h"
#include "rpm.h"

const int WidgetAnimationTexture::MAX_SIZE = 96;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetAnimationTexture::WidgetAnimationTexture(QWidget *parent) :
    QWidget(parent),
    m_idPicture(1),
    m_rows(5),
    m_columns(5),
    m_currentRow(0),
    m_currentColumn(0)
{
    this->setFocus();
    this->setMouseTracking(true);
    this->setFixedWidth(640);
    this->setFixedHeight(480);
    this->updatePicture(m_idPicture);
}

int WidgetAnimationTexture::rows() const {
    return m_rows;
}

void WidgetAnimationTexture::setRows(int r) {
    m_rows = r;
    this->repaint();
}

int WidgetAnimationTexture::columns() const {
    return m_columns;
}

void WidgetAnimationTexture::setColumns(int c) {
    m_columns = c;
    this->repaint();
}

int WidgetAnimationTexture::currentRow() const {
    return m_currentRow;
}

int WidgetAnimationTexture::currentColumn() const {
    return m_currentColumn;
}

const QImage & WidgetAnimationTexture::baseImage() const {
    return m_baseImage;
}

const QImage & WidgetAnimationTexture::image() const {
    return m_image;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetAnimationTexture::updatePicture(int id) {
    int width;

    m_idPicture = id;
    m_baseImage = QImage(reinterpret_cast<SystemPicture *>(SuperListItem
        ::getById(RPM::get()->project()->picturesDatas()->model(PictureKind
        ::Animations)->invisibleRootItem(), m_idPicture))->getPath(PictureKind
        ::Animations));
    m_image = m_baseImage.scaled(m_rows * MAX_SIZE, m_columns * MAX_SIZE);
    width = qMax(m_rows * m_columns * MAX_SIZE, this->parentWidget()->width());
    this->setGeometry(0, 0, width, MAX_SIZE);
    this->setFixedSize(width, MAX_SIZE);
    this->repaint();
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void WidgetAnimationTexture::mousePressEvent(QMouseEvent *event) {
    m_currentRow = (event->x() / MAX_SIZE) / m_columns;
    m_currentColumn = (event->x() / MAX_SIZE) % m_columns;
    this->repaint();
}

// -------------------------------------------------------

void WidgetAnimationTexture::paintEvent(QPaintEvent *) {
    QPainter painter(this);
    int i, j, x;

    // Background
    painter.fillRect(0, 0, this->width(), this->height(), RPM
        ::COLOR_ALMOST_TRANSPARENT);

    // Picture
    for (i = 0; i < m_rows; i++) {
        for (j = 0; j < m_columns; j++) {
            painter.drawImage(((i * m_columns) + j) * MAX_SIZE, 0, m_image, j *
                (m_image.width() / m_rows), i * (m_image.height() / m_columns),
                MAX_SIZE, MAX_SIZE);
        }
    }

    // Draw cursor
    x = ((m_currentRow * m_columns) + m_currentColumn) * MAX_SIZE;
    QPen pen;
    pen.setWidth(1);
    pen.setColor(RPM::COLOR_ALMOST_BLACK);
    painter.setPen(pen);
    painter.drawRect(x, 0, MAX_SIZE, MAX_SIZE);
    painter.drawRect(x + 1, 1, MAX_SIZE - 2, MAX_SIZE - 2);
    painter.drawRect(x + 4, 4, MAX_SIZE - 8, MAX_SIZE - 8);
    painter.drawRect(x + 5, 5, MAX_SIZE - 10, MAX_SIZE - 10);
    pen.setColor(RPM::COLOR_ALMOST_WHITE);
    painter.setPen(pen);
    painter.drawRect(x + 2, 2, MAX_SIZE - 4, MAX_SIZE - 4);
    painter.drawRect(x + 3, 3, MAX_SIZE - 6, MAX_SIZE - 6);
}
