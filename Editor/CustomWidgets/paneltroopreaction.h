/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELTROOPREACTION_H
#define PANELTROOPREACTION_H

#include <QWidget>
#include "systemtroopreaction.h"

namespace Ui {
class PanelTroopReaction;
}

class PanelTroopReaction : public QWidget
{
    Q_OBJECT

public:
    explicit PanelTroopReaction(QWidget *parent = nullptr);
    ~PanelTroopReaction();

    void initialize(SystemTroopReaction *reaction, QStandardItemModel *troopMonstersList);
    void translate();

private:
    Ui::PanelTroopReaction *ui;
    SystemTroopReaction *m_reaction;

signals:
    void nameChanged();

public slots:
    void on_lineEditName_textEdited(const QString &text);
    void on_pushButtonCondition_clicked();
    void on_comboBoxFrequency_currentIndexChanged(int index);
};

#endif // PANELTROOPREACTION_H
