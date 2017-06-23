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

#ifndef WIDGETVARIABLE_H
#define WIDGETVARIABLE_H

#include <QWidget>
#include <QListWidget>
#include "variablesdatas.h"

// -------------------------------------------------------
//
//  CLASS WidgetVariableSwitch
//
//  Widget used for choosing a variable existing in the database.
//
// -------------------------------------------------------

namespace Ui {
class WidgetVariable;
}

class WidgetVariable : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetVariable(QWidget *parent = 0);
    ~WidgetVariable();
    int currentId() const;
    void setCurrentId(int i);
    QListWidget* list() const;
    void initialize(int i = 1);
    void openDialog();

private:
    Ui::WidgetVariable *ui;
    int p_currentId;

private slots:
    void on_listWidget_itemDoubleClicked(QListWidgetItem*);
    void on_pushButton_clicked();
};

#endif // WIDGETVARIABLE_H
