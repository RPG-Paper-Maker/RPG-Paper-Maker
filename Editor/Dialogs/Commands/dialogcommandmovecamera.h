/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

    void translate();

protected:
    virtual void initialize(EventCommand* command);
    QStandardItemModel* m_modelObjects;

private slots:
    void on_radioButtonTargetObjectID_toggled(bool checked);
};

#endif // DIALOGCOMMANDMOVECAMERA_H
