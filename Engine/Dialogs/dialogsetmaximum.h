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

#ifndef DIALOGSETMAXIMUM_H
#define DIALOGSETMAXIMUM_H

#include <QDialog>
#include <QStandardItemModel>

// -------------------------------------------------------
//
//  CLASS DialogSetMaximum
//
//  A dialog used for setting the maximum number of items in
//  a super list.
//
// -------------------------------------------------------

namespace Ui {
class DialogSetMaximum;
}

class DialogSetMaximum : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSetMaximum(QStandardItemModel* model, int max,
                              QWidget *parent = 0);
    ~DialogSetMaximum();
    int maximum() const;

private:
    Ui::DialogSetMaximum *ui;
    QStandardItemModel* m_model;

    bool isOrdered(int limit) const;

private slots:
    void accept();
};

#endif // DIALOGSETMAXIMUM_H
