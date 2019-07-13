/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
