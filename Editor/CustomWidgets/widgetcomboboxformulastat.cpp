/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
