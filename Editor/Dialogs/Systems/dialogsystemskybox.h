/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMSKYBOX_H
#define DIALOGSYSTEMSKYBOX_H

#include <QDialog>
#include "systemskybox.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemSkyBox
//
//  A dialog used for editing the model of a system sky box.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemSkyBox;
}

class DialogSystemSkyBox : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemSkyBox(SystemSkyBox &sb, QWidget *parent = nullptr);
    ~DialogSystemSkyBox();

private:
    Ui::DialogSystemSkyBox *ui;
    SystemSkyBox &m_skyBox;

    void initialize();
    void translate();

public slots:
    void on_lineEditName_textChanged(const QString &text);

};

#endif // DIALOGSYSTEMSKYBOX_H
