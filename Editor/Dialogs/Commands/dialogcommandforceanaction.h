/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDFORCEANACTION_H
#define DIALOGCOMMANDFORCEANACTION_H

#include "dialogcommand.h"

namespace Ui {
class DialogCommandForceAnAction;
}

class DialogCommandForceAnAction : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandForceAnAction(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QStandardItemModel *troopMonstersList = nullptr, QWidget
        *parent = nullptr);
    virtual ~DialogCommandForceAnAction();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandForceAnAction *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QStandardItemModel *m_troopMonstersList;

public slots:
    void on_radioButtonEnemy_toggled(bool checked);
    void on_radioButtonHeroEnemyInstanceID_toggled(bool checked);
    void on_radioButtonUseSkillID_toggled(bool checked);
    void on_radioButtonUseItemID_toggled(bool checked);
    void on_comboBoxTarget_currentIndexChanged(int index);
    void on_radioButtonEnemyTarget_toggled(bool checked);
    void on_radioButtonHeroEnemyInstanceIDTarget_toggled(bool checked);
};

#endif // DIALOGCOMMANDFORCEANACTION_H
