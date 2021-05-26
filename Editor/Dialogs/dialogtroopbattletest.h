/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGTROOPBATTLETEST_H
#define DIALOGTROOPBATTLETEST_H

#include <QDialog>
#include "systemherotroopbattletest.h"

namespace Ui {
class DialogTroopBattleTest;
}

class DialogTroopBattleTest : public QDialog
{
    Q_OBJECT

public:
    explicit DialogTroopBattleTest(int troopID, QWidget *parent = nullptr);
    ~DialogTroopBattleTest();

    void addHero(int index = 0);
    void translate();

private:
    Ui::DialogTroopBattleTest *ui;
    int m_troopID;
    QList<SystemHeroTroopBattleTest *> m_heros;
};

#endif // DIALOGTROOPBATTLETEST_H
