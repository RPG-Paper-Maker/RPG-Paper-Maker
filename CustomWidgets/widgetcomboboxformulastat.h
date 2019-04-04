/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef WIDGETCOMBOBOXFORMULASTAT_H
#define WIDGETCOMBOBOXFORMULASTAT_H

#include <QComboBox>

// -------------------------------------------------------
//
//  CLASS WidgetComboBoxFormulaStat
//
//  A comboBox used for formula stat.
//
// -------------------------------------------------------

class WidgetComboBoxFormulaStat : public QComboBox
{
    Q_OBJECT
public:
    explicit WidgetComboBoxFormulaStat(QWidget *parent = nullptr);

    static QString toString(int i);
};

#endif // WIDGETCOMBOBOXFORMULASTAT_H
