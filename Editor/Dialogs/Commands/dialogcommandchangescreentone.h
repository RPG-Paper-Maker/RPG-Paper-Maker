/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGESCREENTONE_H
#define DIALOGCOMMANDCHANGESCREENTONE_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeScreenTone
//
//  A dialog used for changing screen tone.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeScreenTone;
}

class DialogCommandChangeScreenTone : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeScreenTone(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeScreenTone();

    virtual EventCommand * getCommand() const;

protected:
    SystemCommonObject *m_object;
    QStandardItemModel *m_parameters;

    void initializePrimitives();

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandChangeScreenTone *ui;

    void translate();
};

#endif // DIALOGCOMMANDCHANGESCREENTONE_H
