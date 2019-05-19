/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    explicit DialogCommand(QWidget *parent = 0);
    virtual EventCommand* getCommand() const = 0;

protected:
    virtual void initialize(EventCommand* command) = 0;
};

#endif // DIALOGCOMMAND_H
