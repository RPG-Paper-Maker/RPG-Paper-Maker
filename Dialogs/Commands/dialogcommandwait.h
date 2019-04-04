/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGCOMMANDWAIT_H
#define DIALOGCOMMANDWAIT_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandWait
//
//  A dialog used for waiting.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandWait;
}

class DialogCommandWait : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandWait(EventCommand *command = nullptr,
                               QWidget *parent = 0);
    virtual ~DialogCommandWait();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandWait *ui;
};

#endif // DIALOGCOMMANDWAIT_H
