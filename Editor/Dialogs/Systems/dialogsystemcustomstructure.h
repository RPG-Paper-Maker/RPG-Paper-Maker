/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMCUSTOMSTRUCTURE_H
#define DIALOGSYSTEMCUSTOMSTRUCTURE_H

#include <QDialog>
#include "systemcustomstructure.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemCustomStructure
//
//  A dialog used for editing the model of a system custom structure.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemCustomStructure;
}

class DialogSystemCustomStructure : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemCustomStructure(SystemCustomStructure &custom, QWidget
        *parent = nullptr);
    ~DialogSystemCustomStructure();

    void initialize();

private:
    Ui::DialogSystemCustomStructure *ui;
    SystemCustomStructure &m_custom;

    void translate();

public slots:
    void on_treeviewWindowClosed();
    void on_modelUpdated();
};

#endif // DIALOGSYSTEMCUSTOMSTRUCTURE_H
