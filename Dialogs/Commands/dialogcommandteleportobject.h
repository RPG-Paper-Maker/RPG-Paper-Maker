/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef DIALOGCOMMANDTELEPORTOBJECT_H
#define DIALOGCOMMANDTELEPORTOBJECT_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandTeleportObject
//
//  A dialog used for teleporting an object to a position.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandTeleportObject;
}

class DialogCommandTeleportObject : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandTeleportObject(EventCommand *command = nullptr,
                                         SystemCommonObject *object = nullptr,
                                         QStandardItemModel *parameters =
                                         nullptr,
                                         QWidget *parent = 0);
    virtual ~DialogCommandTeleportObject();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandTeleportObject *ui;
    QStandardItemModel* m_modelObjects;

private slots:
   void on_radioButtonSelect_toggled(bool checked);
   void on_radioButtonNumber_toggled(bool checked);
   void on_radioButtonObject_toggled(bool checked);
};

#endif // DIALOGTELEPORTOBJECT_H
