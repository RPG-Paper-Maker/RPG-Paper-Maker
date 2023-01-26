/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDDISPLAYHIDEABATTLER_H
#define DIALOGCOMMANDDISPLAYHIDEABATTLER_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandDisplayHideABattler;
}

class DialogCommandDisplayHideABattler : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandDisplayHideABattler(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QStandardItemModel *troopMonstersList = nullptr, QWidget
        *parent = nullptr);
    virtual ~DialogCommandDisplayHideABattler();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandDisplayHideABattler *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_troopMonstersList;

public slots:
    void on_radioButtonEnemy_toggled(bool checked);
    void on_radioButtonHeroEnemyInstanceID_toggled(bool checked);
};

#endif // DIALOGCOMMANDDISPLAYHIDEABATTLER_H
