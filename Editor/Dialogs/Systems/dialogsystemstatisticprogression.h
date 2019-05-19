/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
        statisticProgression);
    ~DialogSystemStatisticProgression();

private:
    Ui::DialogSystemStatisticProgression *ui;
    SystemStatisticProgression& m_statisticProgression;
    void initialize();

private slots:
    void on_comboBoxStatistic_currentIndexChanged(int index);
    void on_radioButtonFix_toggled(bool checked);
    void on_radioButtonFormula_toggled(bool checked);
    void on_tableProgressionFinalValueUpdated(int f);
};

#endif // DIALOGSYSTEMSTATISTICPROGRESSION_H
