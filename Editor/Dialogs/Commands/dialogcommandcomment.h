/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCOMMENT_H
#define DIALOGCOMMANDCOMMENT_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandComment
//
//  A dialog used for commenting.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandComment;
}

class DialogCommandComment : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandComment(EventCommand *command = nullptr, QWidget
        *parent = nullptr);
    ~DialogCommandComment();

    virtual EventCommand * getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandComment *ui;

    void translate();
};

#endif // DIALOGCOMMANDCOMMENT_H
