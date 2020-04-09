/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMCAMERAPROPERTIES_H
#define DIALOGSYSTEMCAMERAPROPERTIES_H

#include <QDialog>
#include "systemcameraproperties.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemCameraProperties
//
//  A dialog used for editing the model of a system camera properties.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemCameraProperties;
}

class DialogSystemCameraProperties : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemCameraProperties(SystemCameraProperties
        &cameraProperties, QWidget *parent = nullptr);
    ~DialogSystemCameraProperties();

private:
    Ui::DialogSystemCameraProperties *ui;
    SystemCameraProperties &m_cameraProperties;

    void initialize();
    void translate();

private slots:
    void on_lineEditName_textChanged(const QString &text);
};

#endif // DIALOGSYSTEMCAMERAPROPERTIES_H
