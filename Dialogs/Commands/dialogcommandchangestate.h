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

#ifndef DIALOGCOMMANDCHANGESTATE_H
#define DIALOGCOMMANDCHANGESTATE_H

#include "dialogcommand.h"
#include "systemcommonobject.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeState
//
//  A dialog used for changing the state of one or several objects.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeState;
}

class DialogCommandChangeState : public DialogCommand
{
    Q_OBJECT

public:
     DialogCommandChangeState(EventCommand *command = nullptr,
                              SystemCommonObject *object = nullptr,
                              QStandardItemModel* parameters = nullptr,
                              QWidget *parent = 0);
     virtual ~DialogCommandChangeState();
     EventCommand* getCommand() const;

protected:
     virtual void initialize(EventCommand* command);

private:
     Ui::DialogCommandChangeState *ui;
     SystemCommonObject* m_object;
     QStandardItemModel* m_parameters;
     void initializeStateId();
     void selectionState(QVector<QString>& command) const;
     void operation(QVector<QString>& command) const;
};

#endif // DIALOGCOMMANDCHANGESTATE_H

