/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "widgeticon.h"
#include "ui_widgeticon.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetIcon::WidgetIcon(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetIcon)
{
    ui->setupUi(this);
}

WidgetIcon::~WidgetIcon()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetIcon::initializeIcon(SystemIcon *icon) {
    m_icon = icon;

    connect(ui->widgetPicture, SIGNAL(pictureChanged(SystemPicture *)),
            this, SLOT(on_pictureChanged(SystemPicture *)));
    ui->widgetShowPicture->setActivateCoef(false);
    ui->widgetPicture->setKind(PictureKind::Icons);
    ui->widgetPicture->initialize(m_icon->pictureID());
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetIcon::on_pictureChanged(SystemPicture *picture) {
    ui->widgetShowPicture->updatePicture(picture, PictureKind::Icons);
    m_icon->setPictureID(picture->id());
}
