/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGEXPORT_H
#define DIALOGEXPORT_H

#include <QDialog>
#include "controlexport.h"

// -------------------------------------------------------
//
//  CLASS DialogExport
//
//  A dialog used for exporting the game in standalone.
//
// -------------------------------------------------------

namespace Ui {
class DialogExport;
}

class DialogExport : public QDialog
{
    Q_OBJECT

public:
    explicit DialogExport(Project *project, QWidget *parent = 0);
    ~DialogExport();

protected:
    ControlExport m_control;

private:
    Ui::DialogExport *ui;

    void translate();

private slots:
    void on_pushButtonLocation_clicked();
    void accept();
    void on_radioButtonDesktop_toggled(bool checked);
};

#endif // DIALOGEXPORT_H
