/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGSYSTEMSTATE_H
#define DIALOGSYSTEMSTATE_H

#include <QDialog>
#include "systemstate.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemState
//
//  A dialog used for editing the model of a system state.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemState;
}

class DialogSystemState : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemState(SystemState& state, QWidget *parent = 0);
    ~DialogSystemState();

private:
    Ui::DialogSystemState *ui;
    SystemState& m_state;
    void initialize();

private slots:
    void on_comboBox_currentIndexChanged(int index);
};

#endif // DIALOGSYSTEMSTATE_H
