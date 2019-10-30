/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCONDITIONS_H
#define DIALOGCOMMANDCONDITIONS_H

#include <QDialog>
#include <QButtonGroup>
#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandConditions
//
//  A dialog used for creating a if / else block.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandConditions;
}

class DialogCommandConditions : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandConditions(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, bool hideElse = false, QWidget *parent = nullptr);
    virtual ~DialogCommandConditions();

    void initializePrimitives();

    virtual EventCommand * getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;
    QButtonGroup *m_groupButtonMain, *m_groupButtonHeroesMain,
        *m_groupButtonHeroesEquiped;

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandConditions *ui;

private slots:
    void on_radioButtonVariableParamProp_clicked(bool checked);
    void on_radioButtonVariableParamProp_toggled(bool checked);
    void on_radioButtonHeroes_clicked(bool checked);
    void on_radioButtonHeroes_toggled(bool checked);
    void on_comboBoxHeroes_currentIndexChanged(int index);
    void on_radioButtonHeroesNamed_toggled(bool checked);
    void on_radioButtonHeroesInTeam_toggled(bool checked);
    void on_radioButtonHeroesSkill_toggled(bool checked);
    void on_radioButtonHeroesEquiped_toggled(bool checked);
    void on_radioButtonHeroesEquipedWeapon_toggled(bool checked);
    void on_radioButtonHeroesEquipedArmor_toggled(bool checked);
    void on_radioButtonHeroesStatus_toggled(bool checked);
    void on_radioButtonHeroesStatistic_toggled(bool checked);
};

#endif // DIALOGCOMMANDCONDITIONS_H
