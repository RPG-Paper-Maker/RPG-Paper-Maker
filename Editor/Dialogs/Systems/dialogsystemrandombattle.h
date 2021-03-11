/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMRANDOMBATTLE_H
#define DIALOGSYSTEMRANDOMBATTLE_H

#include <QDialog>
#include "systemrandombattle.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemRandomBattle
//
//  A dialog used for editing the model of a system random battle.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemRandomBattle;
}

class DialogSystemRandomBattle : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemRandomBattle(SystemRandomBattle &randomBattle, QWidget
        *parent = nullptr);
    ~DialogSystemRandomBattle();

    void initialize();
    void translate();

private:
    Ui::DialogSystemRandomBattle *ui;
    SystemRandomBattle &m_randomBattle;

public slots:
    void on_priorityUpdated(int p);
};

#endif // DIALOGSYSTEMRANDOMBATTLE_H
