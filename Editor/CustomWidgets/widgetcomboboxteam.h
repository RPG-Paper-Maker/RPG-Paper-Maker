/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef WIDGETCOMBOBOXTEAM_H
#define WIDGETCOMBOBOXTEAM_H

#include <QComboBox>

// -------------------------------------------------------
//
//  CLASS WidgetComboBoxTeam
//
//  A comboBox used for selecting the kind of team to select.
//
// -------------------------------------------------------

class WidgetComboBoxTeam : public QComboBox
{
    Q_OBJECT
public:
    explicit WidgetComboBoxTeam(QWidget *parent = nullptr);

    static QString toString(int operation);
};

#endif // WIDGETCOMBOBOXTEAM_H
