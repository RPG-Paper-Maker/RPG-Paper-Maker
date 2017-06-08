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

#ifndef WIDGETVARIABLESWITCH_H
#define WIDGETVARIABLESWITCH_H

#include <QWidget>
#include <QListWidget>
#include "variablesswitchesdatas.h"

// -------------------------------------------------------
//
//  CLASS WidgetVariableSwitch
//
//  Widget used for choosing a variable existing in the database.
//
// -------------------------------------------------------

namespace Ui {
class WidgetVariableSwitch;
}

class WidgetVariableSwitch : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetVariableSwitch(QWidget *parent = 0);
    ~WidgetVariableSwitch();
    void setVariable(bool b);
    int currentId() const;
    void setCurrentId(int i);
    QListWidget* list() const;
    void initialize(int i = 1);
    void openDialog();

private:
    Ui::WidgetVariableSwitch *ui;
    bool isVariable;
    int p_currentId;

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem*);
    void on_pushButton_clicked();
};

#endif // WIDGETVARIABLESWITCH_H
