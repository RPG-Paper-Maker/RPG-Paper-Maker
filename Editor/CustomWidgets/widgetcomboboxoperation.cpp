/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString WidgetComboBoxOperation::operation() const {
    return QString::number(this->currentIndex());
}

QString WidgetComboBoxOperation::toString(int operation) {
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
