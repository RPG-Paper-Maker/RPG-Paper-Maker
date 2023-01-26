/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMSELECTSTATISTIC_H
#define DIALOGSYSTEMSELECTSTATISTIC_H

#include <QDialog>
#include "systemselectstatistic.h"

namespace Ui {
class DialogSystemSelectStatistic;
}

class DialogSystemSelectStatistic : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemSelectStatistic(SystemSelectStatistic &selectStatistic,
        QWidget *parent = nullptr);
    ~DialogSystemSelectStatistic();

    void initialize();
    void translate();

private:
    Ui::DialogSystemSelectStatistic *ui;
    SystemSelectStatistic &m_selectStatistic;
};

#endif // DIALOGSYSTEMSELECTSTATISTIC_H
