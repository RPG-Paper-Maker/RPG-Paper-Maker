/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDMODIFYTEAM_H
#define DIALOGCOMMANDMODIFYTEAM_H

#include <QButtonGroup>
#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandModifyTeam
//
//  A dialog used for changing the team.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandModifyTeam;
}

class DialogCommandModifyTeam : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandModifyTeam(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandModifyTeam();

    void initializePrimitives();
    void translate();

    virtual void initialize(EventCommand *command);
    virtual EventCommand * getCommand() const;

private:
    Ui::DialogCommandModifyTeam *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
    QButtonGroup *m_groupMain;
    QButtonGroup *m_groupHeroMonster;

private slots:
    void on_radioButtonNewInstance_toggled(bool checked);
    void on_radioButtonHero_toggled(bool checked);
    void on_radioButtonMonster_toggled(bool checked);
    void on_radioButtonAddEnemy_toggled(bool checked);
    void on_radioButtonModify_toggled(bool checked);
    void on_comboBoxModify_currentIndexChanged(int index);
};

#endif // DIALOGCOMMANDMODIFYTEAM_H
