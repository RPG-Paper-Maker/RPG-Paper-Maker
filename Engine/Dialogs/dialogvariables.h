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

#ifndef DIALOGVARIABLES_H
#define DIALOGVARIABLES_H

#include <QDialog>
#include <QStandardItemModel>
#include <QAbstractButton>

// -------------------------------------------------------
//
//  CLASS DialogVariables
//
//  A dialog used for managing variables (or switches).
//
// -------------------------------------------------------

namespace Ui {
class DialogVariables;
}

class DialogVariables : public QDialog
{
    Q_OBJECT

public:
    explicit DialogVariables(QWidget *parent = 0);
    ~DialogVariables();
    void initializeModel(QStandardItemModel* m);
    int getSelectedId() const;

private:
    Ui::DialogVariables *ui;

private slots:
    void on_pageSelected(QModelIndex index);
    void on_buttonBox_clicked(QAbstractButton *button);
};

#endif // DIALOGVARIABLES_H
