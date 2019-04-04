/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

private slots:
    void on_lineEditName_textChanged(const QString &text);
};

#endif // DIALOGSYSTEMCREATEPARAMETER_H
