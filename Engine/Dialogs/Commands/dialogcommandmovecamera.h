/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
