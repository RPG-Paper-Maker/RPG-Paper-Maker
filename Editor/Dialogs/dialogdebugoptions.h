/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGDEBUGOPTIONS_H
#define DIALOGDEBUGOPTIONS_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogDebugOptions
//
//  A dialog used for setting debug options.
//
// -------------------------------------------------------

namespace Ui {
class DialogDebugOptions;
}

class DialogDebugOptions : public QDialog
{
    Q_OBJECT

public:
    explicit DialogDebugOptions(QWidget *parent = 0);
    ~DialogDebugOptions();

private:
    Ui::DialogDebugOptions *ui;

    void initialize();
    void translate();

private slots:
    void on_checkBoxBB_toggled(bool checked);
    void on_checkBoxShowFPS_toggled(bool checked);
    void on_checkBoxBackupsActivated_toggled(bool checked);
    void on_spinBoxBackupsInterval_valueChanged(int &value);
    void on_spinBoxBackupsMax_valueChanged(int &value);
    void on_pushButtonSyncMapObjects_clicked();
};

#endif // DIALOGDEBUGOPTIONS_H
