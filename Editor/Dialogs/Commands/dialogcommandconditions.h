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
                                     bool hideElse = false,
                                     QWidget *parent = 0);
    virtual ~DialogCommandConditions();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandConditions *ui;
};

#endif // DIALOGCOMMANDCONDITIONS_H
