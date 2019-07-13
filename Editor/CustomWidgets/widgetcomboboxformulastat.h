/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
