/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSHOWTEXT_H
#define DIALOGCOMMANDSHOWTEXT_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandShowText
//
//  A dialog used for displaying text on HUD.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandShowText;
}

class DialogCommandShowText : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandShowText(EventCommand *command = nullptr,
                                   QWidget *parent = 0);
    virtual ~DialogCommandShowText();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandShowText *ui;
};

#endif // DIALOGCOMMANDSHOWTEXT_H
