/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void translate();

public slots:
    void on_lineEditAbbrevation_textChanged(const QString & text);
    void on_radioButtonFix_toggled(bool check);
};

#endif // DIALOGSYSTEMSTATISTIC_H
