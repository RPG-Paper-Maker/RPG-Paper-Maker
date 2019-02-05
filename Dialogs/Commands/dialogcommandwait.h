/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
