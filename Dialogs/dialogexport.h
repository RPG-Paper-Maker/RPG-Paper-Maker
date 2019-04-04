/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

private slots:
    void on_pushButtonLocation_clicked();
    void accept();
    void on_radioButtonDesktop_toggled(bool checked);
};

#endif // DIALOGEXPORT_H
