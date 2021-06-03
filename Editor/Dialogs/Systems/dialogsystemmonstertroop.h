/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMMONSTERTROOP_H
#define DIALOGSYSTEMMONSTERTROOP_H

#include <QDialog>
#include "systemmonstertroop.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemMonsterTroop
//
//  A dialog used for editing the model of a system monster troop.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemMonsterTroop;
}

class DialogSystemMonsterTroop : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemMonsterTroop(SystemMonsterTroop& monsterTroop, QWidget
        *parent = nullptr);
    ~DialogSystemMonsterTroop();

private:
    Ui::DialogSystemMonsterTroop *ui;
    SystemMonsterTroop& m_monsterTroop;

    void initialize();
    void translate();

private slots:
    void on_comboBoxMonster_currentIndexChanged(int index);
    void on_spinBoxLevel_valueChanged(int i);
    void on_checkBoxSpecificPosition_toggled(bool checked);
};

#endif // DIALOGSYSTEMMONSTERTROOP_H
