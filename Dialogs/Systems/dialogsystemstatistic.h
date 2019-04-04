/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
