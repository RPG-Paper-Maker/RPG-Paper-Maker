/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMSPEEDFREQUENCY_H
#define DIALOGSYSTEMSPEEDFREQUENCY_H

#include <QDialog>
#include "systemspeedfrequency.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemSpeedFrequency
//
//  A dialog used for editing the model of a system speed frequency.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemSpeedFrequency;
}

class DialogSystemSpeedFrequency : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemSpeedFrequency(SystemSpeedFrequency &sf, QWidget
        *parent = nullptr);
    ~DialogSystemSpeedFrequency();

private:
    Ui::DialogSystemSpeedFrequency *ui;
    SystemSpeedFrequency &m_speedFrequency;

    void initialize();

private slots:
    void on_lineEditName_textChanged(const QString &text);
};

#endif // DIALOGSYSTEMSPEEDFREQUENCY_H
