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

#include "widgetcomboboxoperation.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetComboBoxOperation::WidgetComboBoxOperation(QWidget *parent)
    : QComboBox(parent)
{
    this->addItem("= (Equal to)");
    this->addItem("!= (Not equal to)");
    this->addItem(">= (Greater than or equal to)");
    this->addItem("<= (Lesser than or equal to)");
    this->addItem("> (Greater than)");
    this->addItem("< (Lesser than)");
    QSize size(215,23);
    this->setMinimumSize(size);
    this->setMaximumSize(size);
}

QString WidgetComboBoxOperation::operation() const{
    return QString::number(this->currentIndex());
}

QString WidgetComboBoxOperation::toString(int operation){
    switch(operation){
    case 0:
        return "=";
    case 1:
        return "!=";
    case 2:
        return ">=";
    case 3:
        return "<=";
    case 4:
        return ">";
    case 5:
        return "<";
    }
    return "";
}
