/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

private slots:
    void on_comboBoxMonster_currentIndexChanged(int index);
    void on_spinBoxLevel_valueChanged(int i);
};

#endif // DIALOGSYSTEMMONSTERTROOP_H
