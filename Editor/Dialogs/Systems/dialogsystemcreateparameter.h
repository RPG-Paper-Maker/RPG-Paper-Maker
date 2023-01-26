/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMCREATEPARAMETER_H
#define DIALOGSYSTEMCREATEPARAMETER_H

#include <QDialog>
#include "systemcreateparameter.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemCreateParameter
//
//  A dialog used for editing the model of a system create parameter.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemCreateParameter;
}

class DialogSystemCreateParameter : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemCreateParameter(SystemCreateParameter& param,
                                         QWidget *parent = 0);
    ~DialogSystemCreateParameter();

private:
    Ui::DialogSystemCreateParameter *ui;
    SystemCreateParameter& m_param;

    void initialize();
    void translate();

private slots:
    void on_lineEditName_textChanged(const QString &text);
};

#endif // DIALOGSYSTEMCREATEPARAMETER_H
