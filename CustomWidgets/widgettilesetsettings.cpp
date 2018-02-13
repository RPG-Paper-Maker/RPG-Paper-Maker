/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#include "widgettilesetsettings.h"
#include "ui_widgettilesetsettings.h"

const QString WidgetTilesetSettings::tabStyleSheet =
        "background-color:rgb(245,245,245);";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTilesetSettings::WidgetTilesetSettings(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::WidgetTilesetSettings)
{
    ui->setupUi(this);

    ui->tab->setStyleSheet(tabStyleSheet);
}

WidgetTilesetSettings::~WidgetTilesetSettings()
{
    delete ui;
}

void WidgetTilesetSettings::setSquares(QHash<QPoint, CollisionSquare*>* squares)
{
    ui->widgetTilesetPraticable->setSquares(squares);
}

PictureKind WidgetTilesetSettings::kind() const {
    return m_kind;
}

void WidgetTilesetSettings::setKind(PictureKind kind) {
    m_kind = kind;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTilesetSettings::updateImage(SystemPicture* picture){
    ui->widgetTilesetPraticable->updateImage(picture, m_kind);
}
