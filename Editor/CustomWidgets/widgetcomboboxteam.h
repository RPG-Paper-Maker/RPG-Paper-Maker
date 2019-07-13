/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
