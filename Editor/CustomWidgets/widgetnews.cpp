/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDesktopServices>
#include <QUrl>
#include "widgetnews.h"
#include "ui_widgetnews.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetNews::WidgetNews(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetNews)
{
    ui->setupUi(this);
}

WidgetNews::~WidgetNews()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetNews::update(QString title, QImage &image, QString link)
{
    ui->label->setText("<b>" + title + "</b>");
    ui->widgetImage->updateImage(image);
    m_link = link;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void WidgetNews::enterEvent(QEvent *)
{
    this->setCursor(Qt::PointingHandCursor);
}

// -------------------------------------------------------

void WidgetNews::leaveEvent(QEvent *)
{
    this->setCursor(Qt::ArrowCursor);
}

// -------------------------------------------------------

void WidgetNews::mousePressEvent(QMouseEvent *)
{
    QDesktopServices::openUrl(QUrl(m_link));
}
