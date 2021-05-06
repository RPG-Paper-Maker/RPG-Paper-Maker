/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    explicit DialogSystemState(SystemState& state, QWidget *parent = nullptr);
    ~DialogSystemState();

private:
    Ui::DialogSystemState *ui;
    SystemState& m_state;
    bool m_needUpdate;
    int m_previousID;

    void initialize();
    void translate();

public slots:
    virtual void accept();
    void on_comboBox_currentIndexChanged(int index);
    void on_pushButtonStates_clicked();
};

#endif // DIALOGSYSTEMSTATE_H
