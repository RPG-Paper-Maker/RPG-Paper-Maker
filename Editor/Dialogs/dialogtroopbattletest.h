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

    void initialize();
    void addHero(int index = 0, SystemHeroTroopBattleTest *hero = nullptr);
    void translate();

private:
    Ui::DialogTroopBattleTest *ui;
    int m_troopID;
    int m_battleMapID;
    QList<SystemHeroTroopBattleTest *> m_heros;
    SystemHeroTroopBattleTest *m_copy;

public slots:
    void on_comboBoxBattleMap_currentIndexChanged(int index);
    void on_pushButtonAdd_clicked();
    void on_pushButtonRemove_clicked();
    void on_pushButtonCopy_clicked();
    void on_pushButtonPaste_clicked();
};

#endif // DIALOGTROOPBATTLETEST_H
