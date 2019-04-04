/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGCOMMANDMODIFYTEAM_H
#define DIALOGCOMMANDMODIFYTEAM_H

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
                                     QWidget *parent = 0);
    virtual ~DialogCommandModifyTeam();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandModifyTeam *ui;
    void getNewInstance(QVector<QString> &command) const;
    void getAddRemove(QVector<QString> &command) const;

private slots:
    void on_radioButtonNewInstance_toggled(bool checked);
    void on_radioButtonHero_toggled(bool checked);
    void on_radioButtonMonster_toggled(bool checked);
    void on_radioButtonAddRemove_toggled(bool checked);
};

#endif // DIALOGCOMMANDMODIFYTEAM_H
