/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
