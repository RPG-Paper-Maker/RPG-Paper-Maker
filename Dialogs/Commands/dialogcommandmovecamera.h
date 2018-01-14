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

#ifndef DIALOGCOMMANDMOVECAMERA_H
#define DIALOGCOMMANDMOVECAMERA_H

#include "dialogcommand.h"
#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogCommandMoveCamera
//
//  A dialog used for moving the camera.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandMoveCamera;
}

class DialogCommandMoveCamera : public DialogCommand
{
    Q_OBJECT

public:
    DialogCommandMoveCamera(EventCommand *command = nullptr,
                            SystemCommonObject *object = nullptr,
                            QStandardItemModel* parameters = nullptr,
                            QWidget *parent = 0);
    virtual ~DialogCommandMoveCamera();
    EventCommand* getCommand() const;

private:
    Ui::DialogCommandMoveCamera *ui;

protected:
    virtual void initialize(EventCommand* command);
    QStandardItemModel* m_modelObjects;

private slots:
    void on_radioButtonTargetObjectID_toggled(bool checked);
};

#endif // DIALOGCOMMANDMOVECAMERA_H
