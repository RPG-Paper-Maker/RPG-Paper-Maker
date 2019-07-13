/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetcomboboxformulastat.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetComboBoxFormulaStat::WidgetComboBoxFormulaStat(QWidget *parent) :
    QComboBox(parent)
{
    this->addItem("Statistic");
    this->addItem("Currency");
    this->addItem("variable");
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString WidgetComboBoxFormulaStat::toString(int i) {
    switch(i){
    case 0:
        return "statistic";
    case 1:
        return "currency";
    case 2:
        return "variable";
    }
    return "";
}
