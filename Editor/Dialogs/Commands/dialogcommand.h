/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMAND_H
#define DIALOGCOMMAND_H

#include <QDialog>
#include "eventcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommand
//
//  Abstract class that all the dialog commands should inherit.
//
// -------------------------------------------------------

class DialogCommand : public QDialog
{
public:
    explicit DialogCommand(QWidget *parent = nullptr);

    virtual EventCommand* getCommand() const = 0;
    virtual void initialize(EventCommand* command) = 0;
};

#endif // DIALOGCOMMAND_H
