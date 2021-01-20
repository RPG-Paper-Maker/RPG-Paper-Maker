/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGFIRSTLAUNCH_H
#define DIALOGFIRSTLAUNCH_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogFirstLaunch
//
//  A dialog used for displaying informations in first launch.
//
// -------------------------------------------------------

namespace Ui {
class DialogFirstLaunch;
}

class DialogFirstLaunch : public QDialog
{
    Q_OBJECT

public:
    explicit DialogFirstLaunch(QWidget *parent = nullptr);
    ~DialogFirstLaunch();

    void initialize();

private:
    Ui::DialogFirstLaunch *ui;

    void translate();

public slots:
    void on_pushButtonOK_clicked();
};

#endif // DIALOGFIRSTLAUNCH_H
