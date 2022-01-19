/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void translate();

private slots:
    void on_comboBoxStatistic_currentIndexChanged(int index);
    void on_radioButtonFix_toggled(bool checked);
    void on_radioButtonFormula_toggled(bool checked);
    void on_tableProgressionFinalValueUpdated(int f);
};

#endif // DIALOGSYSTEMSTATISTICPROGRESSION_H
