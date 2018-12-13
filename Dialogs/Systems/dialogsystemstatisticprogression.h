/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef DIALOGSYSTEMSTATISTICPROGRESSION_H
#define DIALOGSYSTEMSTATISTICPROGRESSION_H

#include <QDialog>
#include "systemstatisticprogression.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemStatisticProgression
//
//  A dialog used for editing the model of a system statistic progression.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemStatisticProgression;
}

class DialogSystemStatisticProgression : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemStatisticProgression(SystemStatisticProgression&
                                              statisticProgression,
                                              QWidget *parent = 0);
    ~DialogSystemStatisticProgression();

private:
    Ui::DialogSystemStatisticProgression *ui;
    SystemStatisticProgression& m_statisticProgression;
    void initialize();

private slots:
    void on_comboBoxStatistic_currentIndexChanged(int index);
    void on_spinBoxInitial_valueChanged(int i);
    void on_spinBoxFinal_valueChanged(int i);
};

#endif // DIALOGSYSTEMSTATISTICPROGRESSION_H
