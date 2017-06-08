/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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
    explicit WidgetComboBoxTeam(QWidget *parent = 0);
    static QString toString(int operation);

signals:

public slots:
};

#endif // WIDGETCOMBOBOXTEAM_H
