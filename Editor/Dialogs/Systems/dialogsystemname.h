/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void translate();

private slots:
    void on_lineEditName_textChanged(const QString &text);
};

#endif // DIALOGSYSTEMNAME_H
