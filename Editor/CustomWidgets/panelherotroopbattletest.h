/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELHEROTROOPBATTLETEST_H
#define PANELHEROTROOPBATTLETEST_H

#include <QWidget>
#include "systemherotroopbattletest.h"

namespace Ui {
class PanelHeroTroopBattleTest;
}

class PanelHeroTroopBattleTest : public QWidget
{
    Q_OBJECT

public:
    explicit PanelHeroTroopBattleTest(SystemHeroTroopBattleTest *hero, QWidget
        *parent = nullptr);
    ~PanelHeroTroopBattleTest();

    void initialize();
    void translate();

private:
    Ui::PanelHeroTroopBattleTest *ui;
    SystemHeroTroopBattleTest *m_hero;

public slots:
    void on_comboBoxHero_currentIndexChanged(int index);
    void on_spinBoxLevel_valueChanged(int i);

signals:
    void heroChanged(QString name);
};

#endif // PANELHEROTROOPBATTLETEST_H
