/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

private slots:
    void on_checkBoxBB_toggled(bool checked);
};

#endif // DIALOGDEBUGOPTIONS_H
