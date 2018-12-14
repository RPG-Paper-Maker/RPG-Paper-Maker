/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "widgetcomboboxteam.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetComboBoxTeam::WidgetComboBoxTeam(QWidget *parent) : QComboBox(parent)
{
    this->addItem("team");
    this->addItem("reserve");
    this->addItem("hidden");
    QSize size(75,23);
    this->setMinimumSize(size);
    this->setMaximumSize(size);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString WidgetComboBoxTeam::toString(int operation) {
    switch(operation){
    case 0:
        return "team";
    case 1:
        return "reserve";
    case 2:
        return "hidden";
    }
    return "";
}
