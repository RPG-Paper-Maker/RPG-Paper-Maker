/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGINPUTNUMBER_H
#define DIALOGINPUTNUMBER_H

#include <QDialog>
#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandInputNumber
//
//  A dialog used for asking the user to enter a number.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandInputNumber;
}

class DialogCommandInputNumber : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandInputNumber(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters
        = nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandInputNumber();

    void initializePrimitives();
    void translate();

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandInputNumber *ui;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
};

#endif // DIALOGINPUTNUMBER_H
