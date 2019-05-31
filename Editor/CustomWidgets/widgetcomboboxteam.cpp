/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
