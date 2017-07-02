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

#ifndef DIALOGSYSTEMSTATISTIC_H
#define DIALOGSYSTEMSTATISTIC_H

#include <QDialog>
#include "systemstatistic.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemStatistic
//
//  A dialog used for editing the model of a system statistic.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemStatistic;
}

class DialogSystemStatistic : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemStatistic(SystemStatistic& statistic,
                                   QWidget *parent = 0);
    ~DialogSystemStatistic();
    SystemStatistic& statistic() const;

private:
    Ui::DialogSystemStatistic *ui;
    SystemStatistic& m_statistic;
    void initialize();

public slots:
    void on_lineEditAbbrevation_textChanged(const QString & text);
    void on_radioButtonFix_toggled(bool check);
};

#endif // DIALOGSYSTEMSTATISTIC_H
