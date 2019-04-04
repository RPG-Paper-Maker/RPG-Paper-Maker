/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGSYSTEMNAME_H
#define DIALOGSYSTEMNAME_H

#include <QDialog>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemName
//
//  A dialog used for editing the model of a system name.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemName;
}

class DialogSystemName : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemName(SuperListItem& model, QWidget *parent = 0);
    ~DialogSystemName();

private:
    Ui::DialogSystemName *ui;
    SuperListItem& m_model;
    void initialize();

private slots:
    void on_lineEditName_textChanged(const QString &text);
};

#endif // DIALOGSYSTEMNAME_H
