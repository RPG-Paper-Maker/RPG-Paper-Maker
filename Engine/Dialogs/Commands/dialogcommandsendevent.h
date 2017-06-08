/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef DIALOGCOMMANDSENDEVENT_H
#define DIALOGCOMMANDSENDEVENT_H

#include "dialogcommand.h"
#include "systemobjectevent.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandMoveObject
//
//  A dialog used for sending events to one or several objects.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandSendEvent;
}

class DialogCommandSendEvent : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandSendEvent(EventCommand *command = nullptr,
                                    QWidget *parent = 0);
    ~DialogCommandSendEvent();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand*command);

private:
    Ui::DialogCommandSendEvent *ui;
    SystemObjectEvent* m_event;

    void chooseTarget(QVector<QString> &command) const;
};

#endif // DIALOGCOMMANDSENDEVENT_H
