/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMTROOPREACTIONCONDITIONS_H
#define DIALOGSYSTEMTROOPREACTIONCONDITIONS_H

#include <QDialog>
#include "systemtroopreactionconditions.h"

namespace Ui {
class DialogSystemTroopReactionConditions;
}

class DialogSystemTroopReactionConditions : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemTroopReactionConditions(SystemTroopReactionConditions
        &conditions, QWidget *parent = nullptr);
    ~DialogSystemTroopReactionConditions();

    void initializePrimitives();
    void initialize();
    void translate();

private:
    Ui::DialogSystemTroopReactionConditions *ui;
    SystemTroopReactionConditions &m_conditions;

public slots:
    void on_checkBoxNumberOfTurns_toggled(bool checked);
    void on_checkBoxMonstersHeroes_toggled(bool checked);
    void on_comboBoxHeroesMonsters_currentIndexChanged(int index);
    void on_comboBoxHeroMonsterNumber_currentIndexChanged(int index);
    void on_checkBoxStatusID_toggled(bool checked);
    void on_checkBoxStatisticID_toggled(bool checked);
    void on_comboBoxStatisticCompare_currentIndexChanged(int index);
    void on_comboBoxStatisticCompareUnit_currentIndexChanged(int index);
};

#endif // DIALOGSYSTEMTROOPREACTIONCONDITIONS_H
